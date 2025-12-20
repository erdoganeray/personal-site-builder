import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * POST /api/user/update-password
 * Updates user password with current password verification
 * 
 * Request body:
 * - currentPassword: string (required)
 * - newPassword: string (required, min 6 characters)
 * 
 * Response:
 * - 200: Password updated successfully
 * - 400: Bad request (missing fields or invalid password)
 * - 401: Unauthorized (no session or wrong current password)
 * - 404: User not found
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

        // 2. Request body'den şifreleri al
        const body = await request.json();
        const { currentPassword, newPassword } = body;

        // 3. Validasyon
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: "Mevcut şifre ve yeni şifre gereklidir" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "Yeni şifre en az 6 karakter olmalıdır" },
                { status: 400 }
            );
        }

        // 4. Kullanıcıyı database'den al
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Kullanıcı bulunamadı" },
                { status: 404 }
            );
        }

        // 5. Mevcut şifre doğrulama
        if (!user.password) {
            return NextResponse.json(
                { error: "Bu hesap şifre ile korunan bir hesap değil" },
                { status: 400 }
            );
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Mevcut şifre yanlış" },
                { status: 401 }
            );
        }

        // 6. Yeni şifre hash'leme
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 7. Database'de şifreyi güncelle
        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword },
        });

        console.log(`✅ Password updated for user ${session.user.id}`);

        // 8. Success response
        return NextResponse.json({
            success: true,
            message: "Şifreniz başarıyla güncellendi",
        });
    } catch (error) {
        console.error("Password update error:", error);
        return NextResponse.json(
            { error: "Şifre güncellenirken bir hata oluştu" },
            { status: 500 }
        );
    }
}
