import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reviseWebsite } from "@/lib/gemini";

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

    // 5. Revize hakkı kontrolü
    if (site.revisionCount >= site.maxRevisions) {
      return NextResponse.json(
        { error: `You have reached the maximum number of revisions (${site.maxRevisions})` },
        { status: 400 }
      );
    }

    // 6. HTML içeriği kontrolü
    if (!site.htmlContent) {
      return NextResponse.json(
        { error: "Site has no HTML content to revise" },
        { status: 400 }
      );
    }

    // 7. Site status'ünü "generating" yap
    await prisma.site.update({
      where: { id: siteId },
      data: { status: "generating" },
    });

    // 8. Gemini ile revize yap
    let revisedResult;
    try {
      revisedResult = await reviseWebsite(site.htmlContent, revisionRequest.trim());
    } catch (geminiError) {
      console.error("Gemini revision error:", geminiError);
      
      // Hata durumunda status'ü geri draft yap
      await prisma.site.update({
        where: { id: siteId },
        data: { status: "draft" },
      });
      
      return NextResponse.json(
        {
          error: "Failed to revise website. Please try again with a clearer request.",
          details: geminiError instanceof Error ? geminiError.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    // 9. Revize edilmiş HTML'i veritabanına kaydet ve revisionCount'u artır
    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: {
        htmlContent: revisedResult.html,
        status: "draft", // Preview için draft olarak bırak
        revisionCount: site.revisionCount + 1,
        updatedAt: new Date(),
      },
    });

    // 10. Başarılı response döndür
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
