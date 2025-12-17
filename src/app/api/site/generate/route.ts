import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWebsite } from "@/lib/gemini";
import { CVData } from "@/lib/gemini-pdf-parser";
import { analyzeSiteDesign } from "@/lib/design-analyzer";
import { getTemplateById } from "@/components/site-templates";
import { populateTemplate } from "@/lib/template-engine";
import { getFontPairById } from "@/lib/font-registry";

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

    // 7. CV verisi zaten JSON formatında
    let cvData: CVData;
    try {
      cvData = site.cvContent as unknown as CVData;
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

    // 8. Gemini ile tasarım planını oluştur (renk + component seçimi)
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

    // 8.5 Stock Photo Selection - Eğer stok fotoğraflı template seçildiyse
    const stockPhotoTemplates = ['hero-fullscreen-bg', 'hero-split-image', 'contact-image-side'];
    const selectedTemplateIds = designPlan.selectedComponents.map((c: any) => c.templateId);
    const needsStockPhotos = selectedTemplateIds.some((id: string) => stockPhotoTemplates.includes(id));

    if (needsStockPhotos) {
      console.log("📸 Stock photo templates detected, fetching images...");
      try {
        const { generateBatchSearchQueries, selectBestPhotoAlgorithmic } = await import("@/lib/stock-photo-selector");
        const { searchMultipleQueries } = await import("@/lib/stock-photo-service");
        const { STOCK_PHOTO_CATEGORIES } = await import("@/lib/stock-photo-registry");

        // Gerekli kategorileri belirle
        const requiredCategories: string[] = [];
        if (selectedTemplateIds.includes('hero-fullscreen-bg') || selectedTemplateIds.includes('hero-split-image')) {
          requiredCategories.push('hero');
        }
        if (selectedTemplateIds.includes('contact-image-side')) {
          requiredCategories.push('contact');
        }

        // Batch Gemini query - tek seferde tüm kategoriler için sorgular üret
        const batchQueries = await generateBatchSearchQueries(requiredCategories, {
          cvData: {
            name: cvData.personalInfo?.name,
            profession: cvData.personalInfo?.title || cvData.summary?.split('.')[0]?.substring(0, 50),
            industry: cvData.experience?.[0]?.company,
            skills: cvData.skills?.slice(0, 5).map((s: any) => typeof s === 'string' ? s : s.name),
            summary: cvData.summary
          },
          templateStyle: designPlan.style || 'modern',
          themeColors: designPlan.themeColors ? {
            primary: designPlan.themeColors.primary,
            secondary: designPlan.themeColors.secondary,
            isDarkTheme: designPlan.themeColors.background?.startsWith('#0') || designPlan.themeColors.background?.startsWith('#1')
          } : undefined
        });

        // Paralel stock photo fetch - tüm kategoriler için aynı anda
        const photoPromises = requiredCategories.map(async (category) => {
          const categoryConfig = STOCK_PHOTO_CATEGORIES[category];
          const queries = batchQueries[category]?.queries || categoryConfig.defaultQueries;

          console.log(`🖼️ Fetching ${category} stock photo with queries: ${queries.join(', ')}`);

          // Pexels'de ara
          const candidates = await searchMultipleQueries(queries, {
            orientation: categoryConfig?.orientation || 'landscape',
            perPage: 5,
            minWidth: categoryConfig?.minWidth || 1280
          });

          if (candidates.length === 0) {
            throw new Error(`No photos found for ${category}`);
          }

          // Algoritmik seçim
          const selectedPhoto = selectBestPhotoAlgorithmic(
            candidates,
            designPlan.themeColors?.primary || '#2563eb',
            categoryConfig?.orientation === 'landscape'
          );

          return {
            category,
            photo: {
              url: selectedPhoto.src.large2x || selectedPhoto.src.large || selectedPhoto.src.original,
              alt: selectedPhoto.alt || `Professional ${category} image`,
              photographer: selectedPhoto.photographer,
              pexelsId: selectedPhoto.id,
              avgColor: selectedPhoto.avg_color,
              source: 'pexels'
            }
          };
        });

        console.log(`🖼️ Fetching ${photoPromises.length} stock photos in parallel...`);
        const results = await Promise.all(photoPromises);

        // Sonuçları stockImages objesine ekle
        const stockImages: Record<string, any> = {};
        results.forEach(r => {
          stockImages[r.category] = r.photo;
          console.log(`✅ ${r.category} stock photo: ${r.photo.url.substring(0, 50)}...`);
        });

        // designPlan'a stockImages ekle
        designPlan.stockImages = stockImages;
        console.log("📸 Stock photos added to design plan");
      } catch (stockError) {
        console.error("⚠️ Stock photo fetch error (continuing without stock photos):", stockError);
        // Hata olursa devam et, fallback SVG'ler kullanılacak
      }
    }

    // 9. Seçilen template'leri al ve CV verileriyle doldur
    console.log("Populating templates with CV data...");
    let finalHtml = '';
    let finalCss = '';
    let finalJs = '';

    try {
      // HTML başlangıcı
      const fontPair = getFontPairById(designPlan.fontPairId || 'professional-1');
      const googleFontsUrl = fontPair?.googleFontsUrl || 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap';

      // Generate dynamic favicon from initials
      const initials = cvData.personalInfo.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
      const faviconColor = designPlan.themeColors.primary || '#3B82F6';
      const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${faviconColor}"/><text x="32" y="42" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">${initials}</text></svg>`;
      const faviconBase64 = `data:image/svg+xml;base64,${Buffer.from(faviconSvg).toString('base64')}`;

      finalHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cvData.personalInfo.name}</title>
  <meta name="description" content="${cvData.personalInfo.title || 'Professional Portfolio'}">
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="${faviconBase64}">
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${googleFontsUrl}" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
`;

      // Helper function to check if a component should be included based on CV data
      const shouldIncludeComponent = (category: string): boolean => {
        switch (category) {
          case 'experience':
            return cvData.experience && cvData.experience.length > 0;
          case 'education':
            return cvData.education && cvData.education.length > 0;
          case 'portfolio':
            return cvData.portfolio && cvData.portfolio.length > 0;
          case 'skills':
            return cvData.skills && cvData.skills.length > 0;
          case 'languages':
            return cvData.languages && cvData.languages.length > 0;
          // Always include these components
          case 'navigation':
          case 'hero':
          case 'contact':
          case 'footer':
            return true;
          default:
            return true;
        }
      };

      // Filter out components that have no data
      const componentsToRender = designPlan.selectedComponents.filter(selected => {
        const shouldInclude = shouldIncludeComponent(selected.category);
        if (!shouldInclude) {
          console.log(`Skipping ${selected.category} component - no data available`);
        }
        return shouldInclude;
      });

      // Her component için template'i doldur
      for (const selected of componentsToRender) {
        const template = getTemplateById(selected.templateId);

        if (!template) {
          console.warn(`Template not found: ${selected.templateId}`);
          continue;
        }

        const populated = populateTemplate(
          template,
          cvData,
          designPlan.themeColors,
          componentsToRender,
          designPlan.iconStyle,
          designPlan.iconSizes,
          designPlan.stockImages // Stock images parametresi
        );

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
  font-family: '${designPlan.themeColors.fontBody || 'Inter'}', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: ${designPlan.themeColors.text};
  background: ${designPlan.themeColors.background};
}

h1, h2, h3, h4, h5, h6 {
  font-family: '${designPlan.themeColors.fontHeading || 'Inter'}', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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

    // 10. Üretilen HTML, CSS ve JS'i veritabanına kaydet
    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: {
        htmlContent: finalHtml,
        cssContent: finalCss,
        jsContent: finalJs,
        title: cvData.personalInfo.name,
        status: "previewed",
        updatedAt: new Date(),
        designPlan: designPlan as any, // Tasarım planını kaydet
      },
    });

    // 12. Başarılı response döndür
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
    });

  } catch (error) {
    console.error("Error checking site status:", error);

    return NextResponse.json(
      { error: "Failed to check site status" },
      { status: 500 }
    );
  }
}
