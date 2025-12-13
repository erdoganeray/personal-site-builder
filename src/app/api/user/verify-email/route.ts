import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/**
 * GET /api/user/verify-email?token={token}
 * Verifies email change and updates user email
 * 
 * Query parameters:
 * - token: string (required)
 * 
 * Response:
 * - 200: Email verified and updated
 * - 400: Invalid or expired token
 * - 404: User not found
 * - 500: Server error
 */
export async function GET(request: NextRequest) {
    try {
        // 1. Token'ı al
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.json(
                { error: "Token gereklidir" },
                { status: 400 }
            );
        }

        // 2. Token'ı hash'le
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // 3. Token ile kullanıcıyı bul
        const user = await prisma.user.findFirst({
            where: {
                emailVerificationToken: hashedToken,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Geçersiz veya kullanılmış token" },
                { status: 400 }
            );
        }

        // 4. Token süresi dolmuş mu kontrol et
        if (user.emailTokenExpiresAt && user.emailTokenExpiresAt < new Date()) {
            // Süresi dolmuş token'ı temizle
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    pendingEmail: null,
                    emailVerificationToken: null,
                    emailTokenExpiresAt: null,
                },
            });

            return NextResponse.json(
                { error: "Token süresi dolmuş. Lütfen yeni bir doğrulama isteği yapın." },
                { status: 400 }
            );
        }

        // 5. Pending email var mı kontrol et
        if (!user.pendingEmail) {
            return NextResponse.json(
                { error: "Bekleyen e-posta değişikliği bulunamadı" },
                { status: 400 }
            );
        }

        // 6. E-postayı güncelle ve token'ı temizle
        await prisma.user.update({
            where: { id: user.id },
            data: {
                email: user.pendingEmail,
                pendingEmail: null,
                emailVerificationToken: null,
                emailTokenExpiresAt: null,
            },
        });

        console.log(`✅ Email verified and updated for user ${user.id}: ${user.pendingEmail}`);

        // 7. Success response
        return NextResponse.json({
            success: true,
            message: "E-posta adresiniz başarıyla güncellendi",
        });
    } catch (error) {
        console.error("Email verification error:", error);
        return NextResponse.json(
            { error: "E-posta doğrulama başarısız oldu" },
            { status: 500 }
        );
    }
}
