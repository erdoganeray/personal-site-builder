import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWebsite } from "@/lib/gemini";
import { CVData } from "@/lib/gemini-pdf-parser";

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication kontrolü
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    // 2. Request body'den siteId'yi al
    const body = await req.json();
    const { siteId, customPrompt } = body;

    if (!siteId) {
      return NextResponse.json(
        { error: "Site ID is required" },
        { status: 400 }
      );
    }

    // 3. Site'ı veritabanından al ve kullanıcıya ait olduğunu doğrula
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

    if (site.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "You don't have permission to generate this site" },
        { status: 403 }
      );
    }

    // 4. CV verisinin olduğunu kontrol et
    if (!site.cvTextData) {
      return NextResponse.json(
        { error: "CV data is missing. Please upload a CV first." },
        { status: 400 }
      );
    }

    // 5. Site'ın status'ünü "generating" yap
    await prisma.site.update({
      where: { id: siteId },
      data: { status: "generating" },
    });

    // 6. CV verisini parse et
    let cvData: CVData;
    try {
      cvData = JSON.parse(site.cvTextData);
    } catch (parseError) {
      console.error("Failed to parse CV data:", parseError);
      
      // Hata durumunda status'ü geri draft yap
      await prisma.site.update({
        where: { id: siteId },
        data: { status: "draft" },
      });
      
      return NextResponse.json(
        { error: "Invalid CV data format. Please re-upload your CV." },
        { status: 400 }
      );
    }

    // 7. Gemini ile website oluştur
    let generatedSite;
    try {
      generatedSite = await generateWebsite({
        cvData,
        linkedinUrl: site.linkedinUrl || undefined,
        githubUrl: site.githubUrl || undefined,
        customPrompt: customPrompt || undefined,
      });
    } catch (geminiError) {
      console.error("Gemini generation error:", geminiError);
      
      // Hata durumunda status'ü geri draft yap
      await prisma.site.update({
        where: { id: siteId },
        data: { status: "draft" },
      });
      
      return NextResponse.json(
        {
          error: "Failed to generate website. Please try again.",
          details: geminiError instanceof Error ? geminiError.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    // 8. Üretilen HTML'i veritabanına kaydet
    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: {
        htmlContent: generatedSite.html,
        title: generatedSite.title,
        status: "draft", // Preview için draft olarak bırak
        updatedAt: new Date(),
      },
    });

    // 9. Başarılı response döndür
    return NextResponse.json({
      success: true,
      message: "Website generated successfully",
      site: {
        id: updatedSite.id,
        title: updatedSite.title,
        status: updatedSite.status,
        previewUrl: `/preview/${updatedSite.id}`,
      },
      description: generatedSite.description,
    });

  } catch (error) {
    console.error("Unexpected error in /api/site/generate:", error);
    
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint - Site'ın oluşturma durumunu kontrol etmek için (opsiyonel)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get("siteId");

    if (!siteId) {
      return NextResponse.json(
        { error: "Site ID is required" },
        { status: 400 }
      );
    }

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

    if (site.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: site.id,
      title: site.title,
      status: site.status,
      hasHtmlContent: !!site.htmlContent,
      revisionCount: site.revisionCount,
      maxRevisions: site.maxRevisions,
    });

  } catch (error) {
    console.error("Error checking site status:", error);
    
    return NextResponse.json(
      { error: "Failed to check site status" },
      { status: 500 }
    );
  }
}
