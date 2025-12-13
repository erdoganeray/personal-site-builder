import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Check if a subdomain is available
 * GET /api/domain/check-subdomain?subdomain=myname
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const subdomain = searchParams.get("subdomain");

        if (!subdomain) {
            return NextResponse.json(
                { available: false, message: "Subdomain is required" },
                { status: 400 }
            );
        }

        // Validate subdomain format (alphanumeric and hyphens only, 3-63 chars)
        const subdomainRegex = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/;
        if (!subdomainRegex.test(subdomain)) {
            return NextResponse.json({
                available: false,
                message: "Subdomain sadece küçük harf, rakam ve tire (-) içerebilir (3-63 karakter)",
            });
        }

        // Check if subdomain exists in database
        const existingSite = await prisma.site.findUnique({
            where: { subdomain },
            select: {
                id: true,
                subdomain: true,
                subdomainReservationExpiresAt: true,
                status: true,
            },
        });

        if (!existingSite) {
            // Subdomain is available
            return NextResponse.json({
                available: true,
                message: "Bu subdomain kullanılabilir",
            });
        }

        // Check if reservation has expired
        if (
            existingSite.subdomainReservationExpiresAt &&
            new Date(existingSite.subdomainReservationExpiresAt) < new Date()
        ) {
            // Reservation expired, subdomain is available
            // Clear the expired reservation
            await prisma.site.update({
                where: { id: existingSite.id },
                data: {
                    subdomain: null,
                    subdomainReservationExpiresAt: null,
                },
            });

            return NextResponse.json({
                available: true,
                message: "Bu subdomain kullanılabilir",
            });
        }

        // Subdomain is taken or reserved
        return NextResponse.json({
            available: false,
            message: "Bu subdomain kullanımda veya rezerve edilmiş",
        });
    } catch (error) {
        console.error("❌ Check subdomain error:", error);
        return NextResponse.json(
            { available: false, message: "Bir hata oluştu" },
            { status: 500 }
        );
    }
}
