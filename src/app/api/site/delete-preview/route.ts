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

        // Önce site'ın kullanıcıya ait olduğunu kontrol et
        const site = await prisma.site.findUnique({
            where: { id: siteId },
        });

        if (!site) {
            return NextResponse.json({ error: "Site bulunamadı" }, { status: 404 });
        }

        if (site.userId !== session.user.id) {
            return NextResponse.json({ error: "Bu siteyi silme yetkiniz yok" }, { status: 403 });
        }

        // Sadece preview datalarını sil, status'ü draft'a çek
        await prisma.site.update({
            where: { id: siteId },
            data: {
                htmlContent: null,
                cssContent: null,
                jsContent: null,
                designPlan: Prisma.DbNull,
                status: "draft",
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
