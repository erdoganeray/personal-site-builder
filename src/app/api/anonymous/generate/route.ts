import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeSiteDesign } from "@/lib/design-analyzer";
import { CVData } from "@/lib/gemini-pdf-parser";
import { getTemplateById } from "@/components/site-templates";
import { populateTemplate } from "@/lib/template-engine";
import { getFontPairById } from "@/lib/font-registry";
import { generateAllSEOTags } from "@/lib/seo-generator";

/**
 * POST /api/anonymous/generate
 * Anonim kullanıcılar için site oluşturma endpoint'i
 * 
 * Body: { anonymousSessionToken: string, siteId: string, customPrompt?: string, portfolioUrls?: string[] }
 */
export async function POST(req: NextRequest) {
    try {
        const { anonymousSessionToken, siteId, customPrompt, portfolioUrls } = await req.json();

        // Validasyonlar
        if (!anonymousSessionToken) {
            return NextResponse.json(
                { error: "Anonymous session token is required" },
                { status: 400 }
            );
        }

        if (!siteId) {
            return NextResponse.json(
                { error: "Site ID is required" },
                { status: 400 }
            );
        }

        // Token ile kullanıcıyı doğrula
        const user = await prisma.user.findUnique({
            where: { anonymousSessionToken }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid session token" },
                { status: 401 }
            );
        }

        // Site'ı bul ve kullanıcıya ait olduğunu doğrula
        const site = await prisma.site.findUnique({
            where: { id: siteId }
        });

        if (!site || site.userId !== user.id) {
            return NextResponse.json(
                { error: "Site not found or access denied" },
                { status: 404 }
            );
        }

        if (!site.cvContent) {
            return NextResponse.json(
                { error: "CV content not found. Please analyze CV first." },
                { status: 400 }
            );
        }

        const cvData = site.cvContent as unknown as CVData;

        // Eğer portfolioUrls varsa, cvData.portfolio'ya ekle
        if (portfolioUrls && Array.isArray(portfolioUrls) && portfolioUrls.length > 0) {
            console.log(`[Anonymous Generate] Adding ${portfolioUrls.length} portfolio images`);

            // Mevcut portfolio'yu koru veya yeni oluştur
            cvData.portfolio = cvData.portfolio || [];

            // Her URL için portfolio item oluştur
            const newPortfolioItems = portfolioUrls.map((url, index) => ({
                imageUrl: url,
                title: `Proje ${cvData.portfolio.length + index + 1}`,
                description: '',
            }));

            cvData.portfolio = [...cvData.portfolio, ...newPortfolioItems];
        }

        console.log(`[Anonymous Generate] Starting design analysis for site: ${siteId}`);

        // Status'ü generating yap
        await prisma.site.update({
            where: { id: siteId },
            data: { status: "generating" }
        });

        // 1. Design analizi yap
        let designPlan;
        try {
            designPlan = await analyzeSiteDesign(cvData, customPrompt || undefined);
            console.log(`[Anonymous Generate] Design plan created`);
        } catch (designError) {
            console.error("Design analysis error:", designError);
            await prisma.site.update({
                where: { id: siteId },
                data: { status: "draft" }
            });
            return NextResponse.json(
                { error: "Failed to analyze design requirements" },
                { status: 500 }
            );
        }

        // 2. Stock photos (if needed)
        const stockPhotoTemplates = ['hero-fullscreen-bg', 'hero-split-image', 'contact-image-side'];
        const selectedTemplateIds = designPlan.selectedComponents.map((c: any) => c.templateId);
        const needsStockPhotos = selectedTemplateIds.some((id: string) => stockPhotoTemplates.includes(id));

        if (needsStockPhotos) {
            try {
                const { generateBatchSearchQueries, selectBestPhotoAlgorithmic } = await import("@/lib/stock-photo-selector");
                const { searchMultipleQueries } = await import("@/lib/stock-photo-service");
                const { STOCK_PHOTO_CATEGORIES } = await import("@/lib/stock-photo-registry");

                const requiredCategories: string[] = [];
                if (selectedTemplateIds.includes('hero-fullscreen-bg') || selectedTemplateIds.includes('hero-split-image')) {
                    requiredCategories.push('hero');
                }
                if (selectedTemplateIds.includes('contact-image-side')) {
                    requiredCategories.push('contact');
                }

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

                const photoPromises = requiredCategories.map(async (category) => {
                    const categoryConfig = STOCK_PHOTO_CATEGORIES[category];
                    const queries = batchQueries[category]?.queries || categoryConfig.defaultQueries;
                    const candidates = await searchMultipleQueries(queries, {
                        orientation: categoryConfig?.orientation || 'landscape',
                        perPage: 5,
                        minWidth: categoryConfig?.minWidth || 1280
                    });

                    if (candidates.length === 0) {
                        throw new Error(`No photos found for ${category}`);
                    }

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

                const results = await Promise.all(photoPromises);
                const stockImages: Record<string, any> = {};
                results.forEach(r => {
                    stockImages[r.category] = r.photo;
                });
                designPlan.stockImages = stockImages;
            } catch (stockError) {
                console.error("Stock photo error (continuing):", stockError);
            }
        }

        // 3. Template'leri render et
        console.log(`[Anonymous Generate] Rendering templates...`);
        let finalHtml = '';
        let finalCss = '';
        let finalJs = '';

        try {
            const fontPair = getFontPairById(designPlan.fontPairId || 'professional-1');
            const googleFontsUrl = fontPair?.googleFontsUrl || 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap';

            // Favicon
            const initials = (cvData.personalInfo?.name || 'U')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase())
                .slice(0, 2)
                .join('');
            const faviconColor = designPlan.themeColors?.primary || '#3B82F6';
            const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${faviconColor}"/><text x="32" y="42" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">${initials}</text></svg>`;
            const faviconBase64 = `data:image/svg+xml;base64,${Buffer.from(faviconSvg).toString('base64')}`;

            // SEO tags
            const seoTags = generateAllSEOTags(
                cvData,
                designPlan.seoData,
                designPlan.themeColors,
                ''
            );

            finalHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
${seoTags}
  <link rel="icon" type="image/svg+xml" href="${faviconBase64}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${googleFontsUrl}" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
<main role="main">
`;

            // Component filtering
            const shouldIncludeComponent = (category: string): boolean => {
                switch (category) {
                    case 'experience': return cvData.experience && cvData.experience.length > 0;
                    case 'education': return cvData.education && cvData.education.length > 0;
                    case 'portfolio': return cvData.portfolio && cvData.portfolio.length > 0;
                    case 'skills': return cvData.skills && cvData.skills.length > 0;
                    case 'languages': return cvData.languages && cvData.languages.length > 0;
                    default: return true;
                }
            };

            const componentsToRender = designPlan.selectedComponents.filter((selected: any) =>
                shouldIncludeComponent(selected.category)
            );

            for (const selected of componentsToRender) {
                const template = getTemplateById(selected.templateId);
                if (!template) continue;

                const populated = populateTemplate(
                    template,
                    cvData,
                    designPlan.themeColors,
                    componentsToRender,
                    designPlan.iconStyle,
                    designPlan.iconSizes,
                    designPlan.stockImages,
                    true // useAbsoluteUrls - preview için R2 URL'lerini olduğu gibi kullan
                );

                finalHtml += populated.html + '\n';
                finalCss += populated.css + '\n\n';
                if (populated.js) {
                    finalJs += populated.js + '\n\n';
                }
            }

            finalHtml += `
</main>
  <script src="script.js"></script>
</body>
</html>`;

            // CSS reset
            finalCss = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: '${designPlan.themeColors?.fontBody || 'Inter'}', sans-serif;
  line-height: 1.6;
  color: ${designPlan.themeColors?.text || '#333'};
  background: ${designPlan.themeColors?.background || '#ffffff'};
}

h1, h2, h3, h4, h5, h6 {
  font-family: '${designPlan.themeColors?.fontHeading || 'Inter'}', sans-serif;
}

html { scroll-behavior: smooth; }
a { text-decoration: none; color: inherit; }

${finalCss}`;

            // JS
            finalJs = `
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

${finalJs}`;

        } catch (templateError) {
            console.error("Template error:", templateError);
            await prisma.site.update({
                where: { id: siteId },
                data: { status: "draft" }
            });
            return NextResponse.json(
                { error: "Failed to generate website" },
                { status: 500 }
            );
        }

        // 4. Site'ı güncelle (status: preview)
        const updatedSite = await prisma.site.update({
            where: { id: siteId },
            data: {
                designPlan: designPlan as any,
                htmlContent: finalHtml,
                cssContent: finalCss,
                jsContent: finalJs,
                title: cvData.personalInfo?.name || "Personal Website",
                status: "preview"
            }
        });

        console.log(`[Anonymous Generate] Site generated: ${siteId}`);

        return NextResponse.json({
            success: true,
            site: {
                id: updatedSite.id,
                title: updatedSite.title,
                status: updatedSite.status
            }
        });

    } catch (error) {
        console.error("Anonymous generate error:", error);
        return NextResponse.json(
            { success: false, error: "Site oluşturma sırasında bir hata oluştu" },
            { status: 500 }
        );
    }
}
