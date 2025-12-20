import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).refine((password) => {
        // Password strength validation - must be at least "Güçlü" (score >= 3)
        const requirements = [
            password.length >= 6,
            password.length >= 8,
            /[A-Z]/.test(password),
            /[a-z]/.test(password),
            /[0-9]/.test(password),
            /[^A-Za-z0-9]/.test(password)
        ];
        const metCount = requirements.filter(Boolean).length;

        let score = 0;
        if (password.length >= 6) score = 1;
        if (password.length >= 8 && metCount >= 3) score = 2;
        if (password.length >= 8 && metCount >= 4) score = 3;
        if (password.length >= 10 && metCount >= 5) score = 4;

        return score >= 3;
    }, {
        message: "Şifre en az 'Güçlü' seviyesinde olmalıdır (8+ karakter, büyük/küçük harf ve rakam/özel karakter)"
    }),
    name: z.string().optional(),
    anonymousSessionToken: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, name, anonymousSessionToken } = registerSchema.parse(body);

        // Check if user already exists with this email
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Bu e-posta adresi zaten kullanılıyor" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        let user;

        // Check if there's an anonymous user to convert
        if (anonymousSessionToken) {
            const anonymousUser = await prisma.user.findUnique({
                where: { anonymousSessionToken },
                include: { sites: true }
            });

            if (anonymousUser) {
                // Convert anonymous user to real user
                user = await prisma.user.update({
                    where: { id: anonymousUser.id },
                    data: {
                        email,
                        password: hashedPassword,
                        name: name || null,
                        isAnonymous: false,
                        anonymousSessionToken: null,
                    },
                });

                console.log(`[Register] Converted anonymous user ${user.id} to real user (email: ${email})`);

                return NextResponse.json(
                    {
                        user: {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                        },
                        converted: true,
                        hasSite: anonymousUser.sites.length > 0,
                    },
                    { status: 201 }
                );
            }
        }

        // Create new user (no anonymous user to convert)
        user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
                isAnonymous: false,
            },
        });

        console.log(`[Register] Created new user ${user.id} (email: ${email})`);

        return NextResponse.json(
            {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
                converted: false,
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Geçersiz giriş", details: error.issues },
                { status: 400 }
            );
        }

        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Kayıt sırasında bir hata oluştu" },
            { status: 500 }
        );
    }
}
