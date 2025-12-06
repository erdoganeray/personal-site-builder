import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWebsite } from "@/lib/gemini";
import { CVData } from "@/lib/gemini-pdf-parser";
import { analyzeSiteDesign } from "@/lib/design-analyzer";
import { getTemplateById } from "@/components/site-templates";
import { populateTemplate } from "@/lib/template-engine";

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
    if (!site.cvContent) {
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

    // 6. CV verisi zaten JSON formatında
    let cvData: CVData;
    try {
      cvData = site.cvContent as CVData;
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

    // 7. Gemini ile tasarım planını oluştur (renk + component seçimi)
    console.log("Analyzing site design with Gemini...");
    let designPlan;
    try {
      designPlan = await analyzeSiteDesign(cvData, customPrompt);
      console.log("Design plan created:", JSON.stringify(designPlan, null, 2));
    } catch (designError) {
      console.error("Design analysis error:", designError);

      await prisma.site.update({
        where: { id: siteId },
        data: { status: "draft" },
      });

      return NextResponse.json(
        {
          error: "Failed to analyze design requirements. Please try again.",
          details: designError instanceof Error ? designError.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    // 8. Seçilen template'leri al ve CV verileriyle doldur
    console.log("Populating templates with CV data...");
    let finalHtml = '';
    let finalCss = '';
    let finalJs = '';

    try {
      // HTML başlangıcı
      finalHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cvData.personalInfo.name} - Kişisel Web Sitesi</title>
  <meta name="description" content="${cvData.personalInfo.title || 'Professional Portfolio'}">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
`;

      // Her component için template'i doldur
      for (const selected of designPlan.selectedComponents) {
        const template = getTemplateById(selected.templateId);
        
        if (!template) {
          console.warn(`Template not found: ${selected.templateId}`);
          continue;
        }

        const populated = populateTemplate(template, cvData, designPlan.themeColors);
        
        finalHtml += populated.html + '\n';
        finalCss += populated.css + '\n\n';
        if (populated.js) {
          finalJs += populated.js + '\n\n';
        }
      }

      // HTML bitişi
      finalHtml += `
  <script src="script.js"></script>
</body>
</html>`;

      // CSS reset ve genel stiller ekle
      finalCss = `
/* CSS Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: ${designPlan.themeColors.text};
  background: ${designPlan.themeColors.background};
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

html {
  scroll-behavior: smooth;
}

a {
  text-decoration: none;
  color: inherit;
}

${finalCss}
`;

      // JS için temel smooth scroll ekle
      finalJs = `
// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

${finalJs}
`;

    } catch (templateError) {
      console.error("Template population error:", templateError);

      await prisma.site.update({
        where: { id: siteId },
        data: { status: "draft" },
      });

      return NextResponse.json(
        {
          error: "Failed to generate website from templates. Please try again.",
          details: templateError instanceof Error ? templateError.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    // 9. Üretilen HTML, CSS ve JS'i veritabanına kaydet
    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: {
        htmlContent: finalHtml,
        cssContent: finalCss,
        jsContent: finalJs,
        title: `${cvData.personalInfo.name} - Kişisel Web Sitesi`,
        status: "previewed",
        updatedAt: new Date(),
        designPlan: designPlan, // Tasarım planını kaydet
        previewContent: {
          cvData: site.cvContent,
          designPlan: designPlan
        },
      },
    });

    // 9. Başarılı response döndür
    return NextResponse.json({
      success: true,
      message: "Website generated successfully using template system",
      site: {
        id: updatedSite.id,
        title: updatedSite.title,
        status: updatedSite.status,
        previewUrl: `/preview/${updatedSite.id}`,
      },
      designPlan: designPlan,
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
