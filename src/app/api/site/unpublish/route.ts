import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unpublishFromCloudflare, deleteKVMapping } from "@/lib/cloudflare-deploy";
import { recalculateUserStorage } from "@/lib/storage-calculator";
import { revalidatePath } from "next/cache";

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
      // R2'den silme başarısız olsa bile devam et
    }

    // 6.5. KV store'dan subdomain mapping'i sil
    if (site.subdomain) {
      const kvDelete = await deleteKVMapping(site.subdomain);
      if (!kvDelete.success) {
        console.warn("⚠️ KV delete failed:", kvDelete.error);
        // KV delete başarısız olsa bile devam et
      }
    }

    // 7. Calculate reservation expiration based on user's plan
    const user = await prisma.user.findUnique({
      where: { id: site.user.id },
      select: { planType: true },
    });

    const reservationDays = user?.planType === "PAID" ? 30 : 7; // 30 days for PAID, 7 days for FREE
    const reservationExpiresAt = new Date();
    reservationExpiresAt.setDate(reservationExpiresAt.getDate() + reservationDays);

    // 8. Veritabanını güncelle - yayın durumunu kaldır ama subdomain'i rezerve et
    const updateData: any = {
      status: "previewed",
      cloudflareUrl: null,
      publishedAt: null,
    };

    // If subdomain exists, set/reset reservation timer
    if (site.subdomain) {
      updateData.subdomainReservationExpiresAt = reservationExpiresAt;
    }

    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: updateData,
    });

    // 7.5. Recalculate storage to remove HTML, CSS, JS file sizes
    try {
      await recalculateUserStorage(site.user.id);
      console.log(`✅ Storage recalculated for user ${site.user.id} after unpublish`);
    } catch (storageError) {
      console.error("⚠️ Storage recalculation failed (non-blocking):", storageError);
      // Don't block unpublish flow if storage calculation fails
    }

    // 7.6. Revalidate dashboard cache
    revalidatePath('/dashboard');
    revalidatePath('/dashboard?tab=domain-management');

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
