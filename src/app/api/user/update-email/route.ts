import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/user/update-email
 * Initiates email update process by sending verification email
 * 
 * Request body:
 * - newEmail: string (required)
 * 
 * Response:
 * - 200: Verification email sent
 * - 400: Bad request (invalid email or duplicate)
 * - 401: Unauthorized
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Session kontrolü
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Oturum bulunamadı. Lütfen giriş yapın." },
        { status: 401 }
      );
    }

    // 2. Request body'den yeni e-postayı al
    const body = await request.json();
    const { newEmail } = body;

    // 3. Validasyon
    if (!newEmail || !newEmail.includes("@")) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi girin" },
        { status: 400 }
      );
    }

    // Mevcut e-posta ile aynı mı kontrol et
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true },
    });

    if (currentUser?.email === newEmail) {
      return NextResponse.json(
        { error: "Bu zaten mevcut e-posta adresiniz" },
        { status: 400 }
      );
    }

    // 4. E-posta benzersizlik kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanılıyor" },
        { status: 400 }
      );
    }

    // 5. Doğrulama token'ı oluştur
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 saat

    // 6. Database'de pending email ve token'ı kaydet
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        pendingEmail: newEmail,
        emailVerificationToken: hashedToken,
        emailTokenExpiresAt: expiresAt,
      },
    });

    // 7. Doğrulama e-postası gönder
    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

    try {
      await resend.emails.send({
        from: "PersonaWeb <info@personalweb.info>",
        to: newEmail,
        subject: "E-posta Adresinizi Doğrulayın",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background: #667eea; color: white !important; padding: 14px 32px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
                .button:hover { background: #5568d3; }
                .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
                .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 15px 0; }
                code { background: #e0e0e0; padding: 2px 6px; border-radius: 3px; font-family: monospace; word-break: break-all; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2 style="margin: 0;">📧 E-posta Adresinizi Doğrulayın</h2>
                </div>
                <div class="content">
                  <p>Merhaba,</p>
                  <p>E-posta adresinizi <strong>${newEmail}</strong> olarak değiştirmek için bir istek aldık.</p>
                  <p>Değişikliği onaylamak için aşağıdaki butona tıklayın:</p>
                  
                  <div style="text-align: center;">
                    <a href="${verificationLink}" class="button">E-postamı Doğrula</a>
                  </div>
                  
                  <p style="color: #666; font-size: 14px; margin-top: 20px;">
                    Veya bu linki tarayıcınıza kopyalayın:<br>
                    <code>${verificationLink}</code>
                  </p>
                  
                  <div class="warning">
                    <strong>⏰ Önemli:</strong> Bu link 24 saat geçerlidir.
                  </div>
                  
                  <div class="footer">
                    <p><strong>Bu isteği siz yapmadıysanız:</strong></p>
                    <p>Bu e-postayı görmezden gelebilirsiniz. Hesabınızda hiçbir değişiklik yapılmayacaktır.</p>
                    <p>Hesabınızın güvenliği için şifrenizi kimseyle paylaşmayın.</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      console.log(`✅ Verification email sent to ${newEmail} for user ${session.user.id}`);
    } catch (emailError) {
      console.error("Email sending error:", emailError);

      // E-posta gönderilemezse pending state'i temizle
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          pendingEmail: null,
          emailVerificationToken: null,
          emailTokenExpiresAt: null,
        },
      });

      return NextResponse.json(
        { error: "E-posta gönderilemedi. Lütfen tekrar deneyin." },
        { status: 500 }
      );
    }

    // 8. Success response
    return NextResponse.json({
      success: true,
      message: "Doğrulama e-postası gönderildi. Lütfen e-postanızı kontrol edin.",
    });
  } catch (error) {
    console.error("Email update request error:", error);
    return NextResponse.json(
      { error: "E-posta güncelleme isteği başarısız oldu" },
      { status: 500 }
    );
  }
}
