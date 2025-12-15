import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deployToCloudflare, updateKVMapping } from "@/lib/cloudflare-deploy";
import { recalculateUserStorage } from "@/lib/storage-calculator";

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

    // 6. Subdomain kontrolü - site'da subdomain var mı?
    if (!site.subdomain) {
      return NextResponse.json(
        { error: "Lütfen önce Domain Yönetimi sayfasından bir subdomain belirleyin" },
        { status: 400 }
      );
    }

    // 7. Cloudflare'e deploy et (HTML, CSS, JS)
    const deployment = await deployToCloudflare(
      site.subdomain, // Use the subdomain from site record
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

    // 7.5. KV store'a subdomain mapping ekle (Worker için)
    const kvUpdate = await updateKVMapping(
      deployment.subdomain!,
      site.user.id,
      siteId
    );

    if (!kvUpdate.success) {
      console.warn("⚠️ KV update failed:", kvUpdate.error);
      console.log(`📝 Manual KV sync command:\ncd workers/subdomain-router && wrangler kv key put --remote --binding=SITE_MAPPINGS "${deployment.subdomain}" '{"userId":"${site.user.id}","siteId":"${siteId}"}'`);
      // KV update başarısız olsa bile devam et
    }

    // 8. Veritabanını güncelle ve published snapshot'ları kaydet
    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: {
        status: "published",
        subdomain: deployment.subdomain,
        cloudflareUrl: deployment.url,
        publishedAt: new Date(),
        subdomainReservationExpiresAt: null, // Clear reservation when published
        // Save published content snapshots for change detection
        publishedHtmlContent: site.htmlContent,
        publishedCssContent: site.cssContent,
        publishedJsContent: site.jsContent,
        publishedCvContent: site.cvContent as any,
      },
    });

    // 8.5. Auto-cleanup: Remove orphaned assets from previous published version
    if (site.publishedCvContent) {
      try {
        const { extractAssetKeys, cleanupOrphanedAssets } = await import("@/lib/asset-cleanup-utils");

        // Extract asset keys from old and new content
        const oldAssets = extractAssetKeys(site.publishedCvContent, site.userId);
        const newAssets = extractAssetKeys(site.cvContent, site.userId);

        // Find orphaned assets (in old but not in new)
        const orphanedAssets = oldAssets.filter(key => !newAssets.includes(key));

        if (orphanedAssets.length > 0) {
          console.log(`🧹 Found ${orphanedAssets.length} orphaned assets to clean up`);
          await cleanupOrphanedAssets(orphanedAssets, site.userId);
        } else {
          console.log(`✅ No orphaned assets to clean up`);
        }
      } catch (cleanupError) {
        console.error("⚠️ Auto-cleanup failed (non-blocking):", cleanupError);
        // Don't block publish flow if cleanup fails
      }
    }

    // 9. Recalculate storage to include HTML, CSS, JS files
    try {
      await recalculateUserStorage(site.user.id);
      console.log(`✅ Storage recalculated for user ${site.user.id} after publish`);
    } catch (storageError) {
      console.error("⚠️ Storage recalculation failed (non-blocking):", storageError);
      // Don't block publish flow if storage calculation fails
    }

    // 10. Başarılı yanıt
    return NextResponse.json({
      success: true,
      message: "Site published successfully!",
      cloudflareUrl: deployment.url,
      subdomain: deployment.subdomain,
      site: updatedSite,
      kvSynced: kvUpdate.success,
      manualKvCommand: !kvUpdate.success ? `wrangler kv key put --remote --binding=SITE_MAPPINGS "${deployment.subdomain}" '{"userId":"${site.user.id}","siteId":"${siteId}"}'` : undefined,
    });
  } catch (error) {
    console.error("❌ Publish error:", error);
    return NextResponse.json(
      { error: "Failed to publish site" },
      { status: 500 }
    );
  }
}
