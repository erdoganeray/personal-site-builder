import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reviseWebsite } from "@/lib/gemini";
import {
  checkAndResetEditCounter,
  hasRemainingEdits,
  incrementEditCounter,
  getRemainingEdits,
} from "@/lib/subscription-utils";
import { getPlanLimits, PlanType } from "@/lib/plan-constants";

/**
 * POST /api/site/revise
 * Mevcut site'ı kullanıcı isteğine göre revize eder
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Kullanıcı authentication kontrolü
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    // 2. Request body'den siteId ve revisionRequest al
    const { siteId, revisionRequest } = await req.json();

    if (!siteId || !revisionRequest) {
      return NextResponse.json(
        { error: "siteId and revisionRequest are required" },
        { status: 400 }
      );
    }

    if (typeof revisionRequest !== 'string' || revisionRequest.trim().length === 0) {
      return NextResponse.json(
        { error: "Revision request must be a non-empty string" },
        { status: 400 }
      );
    }

    // 3. Kullanıcıyı database'den bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 4. Site'ı database'den bul ve kullanıcıya ait olduğunu kontrol et
    const site = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    if (site.userId !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to revise this site" },
        { status: 403 }
      );
    }

    // 5. Check and reset monthly edit counter if needed
    const userWithResetCounter = await checkAndResetEditCounter(user.id);

    // 6. Check if user has remaining edits this month
    if (!hasRemainingEdits(userWithResetCounter.planType, userWithResetCounter.editsThisMonth)) {
      const limits = getPlanLimits(userWithResetCounter.planType as PlanType);
      return NextResponse.json(
        {
          error: `Bu ay için düzenleme hakkınız doldu (${limits.editsPerMonth}/${limits.editsPerMonth}). Yeni ay başında hakkınız yenilenecek.`,
          resetDate: userWithResetCounter.editsResetDate,
        },
        { status: 400 }
      );
    }

    // 7. HTML, CSS ve JS içeriği kontrolü
    if (!site.htmlContent || !site.cssContent || !site.jsContent) {
      return NextResponse.json(
        { error: "Site has missing content (HTML, CSS, or JS) to revise" },
        { status: 400 }
      );
    }

    // 8. Önceki status'ü sakla ve "generating" yap
    const previousStatus = site.status;
    await prisma.site.update({
      where: { id: siteId },
      data: { status: "generating" },
    });

    // 9. Gemini ile revize yap
    let revisedResult;
    try {
      revisedResult = await reviseWebsite(
        site.htmlContent,
        site.cssContent,
        site.jsContent,
        revisionRequest.trim()
      );
    } catch (geminiError) {
      console.error("Gemini revision error:", geminiError);

      // Hata durumunda status'ü önceki haline geri al
      await prisma.site.update({
        where: { id: siteId },
        data: { status: previousStatus },
      });

      return NextResponse.json(
        {
          error: "Failed to revise website. Please try again with a clearer request.",
          details: geminiError instanceof Error ? geminiError.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    // 10. Increment edit counter
    const updatedUser = await incrementEditCounter(user.id);

    // 11. Revize edilmiş HTML, CSS ve JS'i veritabanına kaydet
    // Status'ü önceki haline (previewed veya published) geri getir
    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: {
        htmlContent: revisedResult.html,
        cssContent: revisedResult.css,
        jsContent: revisedResult.js,
        status: previousStatus, // Önceki status'ü koru (previewed veya published)
        revisionCount: site.revisionCount + 1, // Keep for backward compatibility
        updatedAt: new Date(),
      },
    });

    // 12. Başarılı response döndür
    const remainingEdits = getRemainingEdits(updatedUser.planType, updatedUser.editsThisMonth);
    const limits = getPlanLimits(updatedUser.planType as PlanType);

    return NextResponse.json({
      success: true,
      message: "Website revised successfully",
      changes: revisedResult.changes,
      site: {
        id: updatedSite.id,
        title: updatedSite.title,
        status: updatedSite.status,
        revisionCount: updatedSite.revisionCount,
        maxRevisions: updatedSite.maxRevisions,
      },
      subscription: {
        editsUsed: updatedUser.editsThisMonth,
        editsLimit: limits.editsPerMonth,
        editsRemaining: remainingEdits,
        resetDate: updatedUser.editsResetDate,
      },
    });

  } catch (error) {
    console.error("Error in /api/site/revise:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
