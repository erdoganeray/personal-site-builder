import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deployToCloudflare } from "@/lib/cloudflare-deploy";

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

    // 5. HTML, CSS ve JS içeriği var mı kontrol et
    if (!site.htmlContent || !site.cssContent || !site.jsContent) {
      return NextResponse.json(
        { error: "Missing content (HTML, CSS, or JS). Generate site first." },
        { status: 400 }
      );
    }

    // 6. Username var mı kontrol et, yoksa email'den oluştur
    let username = site.user.username;
    if (!username) {
      // Username yoksa email'den oluştur
      username = site.user.email.split("@")[0];

      // Veritabanına kaydet
      await prisma.user.update({
        where: { id: site.user.id },
        data: { username },
      });
    }

    // 7. Cloudflare'e deploy et (HTML, CSS, JS)
    const deployment = await deployToCloudflare(
      username,
      site.user.id,
      siteId,
      site.htmlContent,
      site.cssContent,
      site.jsContent
    );

    if (!deployment.success) {
      return NextResponse.json(
        { error: deployment.error || "Deployment failed" },
        { status: 500 }
      );
    }

    // 8. Veritabanını güncelle
    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: {
        status: "published",
        subdomain: deployment.subdomain,
        cloudflareUrl: deployment.url,
        publishedAt: new Date(),
      },
    });

    // 9. Başarılı yanıt
    return NextResponse.json({
      success: true,
      message: "Site published successfully!",
      deployedUrl: deployment.url,
      subdomain: deployment.subdomain,
      site: updatedSite,
    });
  } catch (error) {
    console.error("❌ Publish error:", error);
    return NextResponse.json(
      { error: "Failed to publish site" },
      { status: 500 }
    );
  }
}
