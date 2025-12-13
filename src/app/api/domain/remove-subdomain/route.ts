import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Remove subdomain from site
 * DELETE /api/domain/remove-subdomain
 * Body: { siteId: string }
 */
export async function DELETE(req: NextRequest) {
    try {
        // 1. Authentication check
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Get request body
        const body = await req.json();
        const { siteId } = body;

        if (!siteId) {
            return NextResponse.json(
                { success: false, message: "Site ID gerekli" },
                { status: 400 }
            );
        }

        // 3. Get site and verify ownership
        const site = await prisma.site.findUnique({
            where: { id: siteId },
            include: { user: true },
        });

        if (!site) {
            return NextResponse.json(
                { success: false, message: "Site bulunamadı" },
                { status: 404 }
            );
        }

        if (site.user.email !== session.user.email) {
            return NextResponse.json(
                { success: false, message: "Bu site size ait değil" },
                { status: 403 }
            );
        }

        // 4. Check if site is published
        if (site.status === "published") {
            return NextResponse.json({
                success: false,
                message: "Subdomain'i kaldırmak için önce siteyi yayından kaldırın",
            });
        }

        // 5. Remove subdomain and reservation
        await prisma.site.update({
            where: { id: siteId },
            data: {
                subdomain: null,
                subdomainReservationExpiresAt: null,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Subdomain başarıyla kaldırıldı",
        });
    } catch (error) {
        console.error("❌ Remove subdomain error:", error);
        return NextResponse.json(
            { success: false, message: "Bir hata oluştu" },
            { status: 500 }
        );
    }
}
