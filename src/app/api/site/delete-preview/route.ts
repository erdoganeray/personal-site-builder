import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const siteId = searchParams.get("id");

        if (!siteId) {
            return NextResponse.json({ error: "Site ID is required" }, { status: 400 });
        }

        // Site ve kullanıcı bilgisini çek (plan tipi için user gerekli)
        const site = await prisma.site.findUnique({
            where: { id: siteId },
            include: { user: true },
        });

        if (!site) {
            return NextResponse.json({ error: "Site bulunamadı" }, { status: 404 });
        }

        if (site.userId !== session.user.id) {
            return NextResponse.json({ error: "Bu siteyi silme yetkiniz yok" }, { status: 403 });
        }

        // Subdomain varsa rezervasyon süresini ayarla/yenile
        let subdomainReservationExpiresAt: Date | null = null;
        if (site.subdomain) {
            const reservationDays = site.user.planType === "PAID" ? 30 : 7;
            subdomainReservationExpiresAt = new Date();
            subdomainReservationExpiresAt.setDate(subdomainReservationExpiresAt.getDate() + reservationDays);
        }

        // Sadece preview datalarını sil, status'ü draft'a çek, subdomain rezervasyonunu koru/ayarla
        await prisma.site.update({
            where: { id: siteId },
            data: {
                htmlContent: null,
                cssContent: null,
                jsContent: null,
                designPlan: Prisma.DbNull,
                status: "draft",
                subdomainReservationExpiresAt: subdomainReservationExpiresAt,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Önizleme sitesi başarıyla silindi"
        });
    } catch (error) {
        console.error("Önizleme silme hatası:", error);
        return NextResponse.json(
            { error: "Önizleme silinemedi" },
            { status: 500 }
        );
    }
}
