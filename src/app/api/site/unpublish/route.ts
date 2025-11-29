import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unpublishFromCloudflare } from "@/lib/cloudflare-deploy";

export async function POST(req: NextRequest) {
  try {
    // 1. Kullanıcı authentication kontrolü
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Request body'den siteId al
    const body = await req.json();
    const { siteId } = body;

    if (!siteId) {
      return NextResponse.json(
        { error: "Site ID is required" },
        { status: 400 }
      );
    }

    // 3. Site'ı veritabanından çek
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      include: { user: true },
    });

    if (!site) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    // 4. Site'ın bu kullanıcıya ait olduğunu kontrol et
    if (site.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized - Site does not belong to you" },
        { status: 403 }
      );
    }

    // 5. Site yayında mı kontrol et
    if (site.status !== "published") {
      return NextResponse.json(
        { error: "Site is not published" },
        { status: 400 }
      );
    }

    // 6. Cloudflare R2'den dosyayı sil
    const unpublishResult = await unpublishFromCloudflare(site.user.id, siteId);
    
    if (!unpublishResult.success) {
      console.warn("⚠️ R2'den silme başarısız:", unpublishResult.error);
      // R2'den silme başarısız olsa bile veritabanını güncelle
    }

    // 7. Veritabanını güncelle - yayın durumunu kaldır
    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: {
        status: "draft",
        subdomain: null,
        cloudflareUrl: null,
        publishedAt: null,
      },
    });

    // 8. Başarılı yanıt
    return NextResponse.json({
      success: true,
      message: "Site yayından kaldırıldı",
      site: updatedSite,
    });
  } catch (error) {
    console.error("❌ Unpublish error:", error);
    return NextResponse.json(
      { error: "Failed to unpublish site" },
      { status: 500 }
    );
  }
}
