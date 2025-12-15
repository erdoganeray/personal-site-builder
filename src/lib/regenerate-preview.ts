import { prisma } from "@/lib/prisma";
import { CVData } from "@/lib/gemini-pdf-parser";
import { getTemplateById } from "@/components/site-templates";
import { populateTemplate } from "@/lib/template-engine";
import { getFontPairById } from "@/lib/font-registry";

/**
 * Regenerates htmlContent, cssContent, jsContent from cvContent + designPlan
 * This is the core logic shared between API endpoint and internal calls
 */
export async function regeneratePreviewContent(siteId: string): Promise<{
  success: boolean;
  error?: string;
  site?: any;
}> {
  try {
    // 1. Get site from database
    const site = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      return { success: false, error: "Site not found" };
    }

    // 2. Validate cvContent and designPlan exist
    if (!site.cvContent) {
      return { success: false, error: "CV data is missing" };
    }

    if (!site.designPlan) {
      return { success: false, error: "Design plan is missing" };
    }

    // 3. Parse cvContent and designPlan
    let cvData: CVData;
    let designPlan: any;

    try {
      cvData = site.cvContent as unknown as CVData;
      designPlan = site.designPlan as any;
    } catch (parseError) {
      console.error("Failed to parse CV data or design plan:", parseError);
      return { success: false, error: "Invalid CV data or design plan format" };
    }

    // 4. Regenerate HTML, CSS, JS from templates
    console.log(`🔄 Regenerating preview for site ${siteId}...`);
    console.log(`📋 Design Plan:`, JSON.stringify(designPlan.selectedComponents.map((c: any) => c.category), null, 2));
    console.log(`📊 CV Data Summary:`, {
      hasExperience: cvData.experience?.length || 0,
      hasEducation: cvData.education?.length || 0,
      hasPortfolio: cvData.portfolio?.length || 0,
      hasSkills: cvData.skills?.length || 0,
      hasLanguages: cvData.languages?.length || 0,
    });

    let finalHtml = '';
    let finalCss = '';
    let finalJs = '';

    try {
      // HTML beginning
      const fontPair = getFontPairById(designPlan.fontPairId || 'professional-1');
      const googleFontsUrl = fontPair?.googleFontsUrl || 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap';

      finalHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cvData.personalInfo.name} - Kişisel Web Sitesi</title>
  <meta name="description" content="${cvData.personalInfo.title || 'Professional Portfolio'}">
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
      const componentsToRender = designPlan.selectedComponents.filter((selected: any) => {
        const shouldInclude = shouldIncludeComponent(selected.category);
        if (!shouldInclude) {
          console.log(`Skipping ${selected.category} component - no data available`);
        }
        return shouldInclude;
      });

      // Populate each component template with updated cvContent
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
          designPlan.iconSizes
        );

        finalHtml += populated.html + '\n';
        finalCss += populated.css + '\n\n';
        if (populated.js) {
          finalJs += populated.js + '\n\n';
        }
      }

      // HTML ending
      finalHtml += `
  <script src="script.js"></script>
</body>
</html>`;

      // Add CSS reset and global styles
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

      // Add basic smooth scroll JS
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
      return {
        success: false,
        error: "Failed to regenerate preview from templates",
      };
    }

    // 5. Update database with regenerated content
    const updatedSite = await prisma.site.update({
      where: { id: siteId },
      data: {
        htmlContent: finalHtml,
        cssContent: finalCss,
        jsContent: finalJs,
        title: `${cvData.personalInfo.name} - Kişisel Web Sitesi`,
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Preview regenerated successfully for site ${siteId}`);

    return {
      success: true,
      site: {
        id: updatedSite.id,
        title: updatedSite.title,
        status: updatedSite.status,
      },
    };

  } catch (error) {
    console.error("Unexpected error during preview regeneration:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
