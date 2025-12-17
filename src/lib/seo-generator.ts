/**
 * SEO Generator Utility
 * Generates meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
 */

import { CVData } from "@/lib/gemini-pdf-parser";
import { SEOData, ThemeColors } from "@/types/templates";

/**
 * Extended SEO metadata interface for HTML generation
 */
export interface SEOMetadata {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    professionalSummary?: string;
    author: string;
    canonicalUrl?: string;
    robots: string;
    ogImage?: string;
    locale: string;
}

/**
 * Escapes HTML special characters for safe insertion into HTML attributes
 */
function escapeHtmlAttribute(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/**
 * Generates primary meta tags HTML
 */
export function generatePrimaryMetaTags(seoData: SEOMetadata): string {
    const title = escapeHtmlAttribute(seoData.metaTitle);
    const description = escapeHtmlAttribute(seoData.metaDescription);
    const keywords = seoData.keywords.map(k => escapeHtmlAttribute(k)).join(", ");
    const author = escapeHtmlAttribute(seoData.author);

    return `
  <!-- Primary Meta Tags -->
  <title>${title}</title>
  <meta name="title" content="${title}">
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <meta name="author" content="${author}">
  <meta name="robots" content="${seoData.robots}">
  <meta name="generator" content="PersonalWeb.info">`;
}

/**
 * Generates Open Graph meta tags for social media sharing (Facebook, LinkedIn, WhatsApp, etc.)
 */
export function generateOpenGraphTags(
    seoData: SEOMetadata,
    siteUrl: string
): string {
    const title = escapeHtmlAttribute(seoData.metaTitle);
    const description = escapeHtmlAttribute(seoData.metaDescription);
    const author = escapeHtmlAttribute(seoData.author);
    const url = escapeHtmlAttribute(siteUrl);
    const ogImage = seoData.ogImage ? escapeHtmlAttribute(seoData.ogImage) : "";

    let tags = `
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:site_name" content="${author}">
  <meta property="og:locale" content="${seoData.locale}">`;

    if (ogImage) {
        tags += `
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:alt" content="${author} - Professional Portfolio">`;
    }

    return tags;
}

/**
 * Generates Twitter Card meta tags
 */
export function generateTwitterCardTags(
    seoData: SEOMetadata,
    siteUrl: string
): string {
    const title = escapeHtmlAttribute(seoData.metaTitle);
    const description = escapeHtmlAttribute(seoData.metaDescription);
    const url = escapeHtmlAttribute(siteUrl);
    const ogImage = seoData.ogImage ? escapeHtmlAttribute(seoData.ogImage) : "";

    let tags = `
  <!-- Twitter Card -->
  <meta property="twitter:card" content="${ogImage ? "summary_large_image" : "summary"}">
  <meta property="twitter:url" content="${url}">
  <meta property="twitter:title" content="${title}">
  <meta property="twitter:description" content="${description}">`;

    if (ogImage) {
        tags += `
  <meta property="twitter:image" content="${ogImage}">`;
    }

    return tags;
}

/**
 * Generates canonical URL link tag
 */
export function generateCanonicalUrl(siteUrl: string): string {
    const url = escapeHtmlAttribute(siteUrl);
    return `
  <!-- Canonical URL -->
  <link rel="canonical" href="${url}">`;
}

/**
 * Generates JSON-LD structured data for Person schema
 * This helps search engines understand the content and display rich snippets
 */
export function generateJsonLdPersonSchema(
    cvData: CVData,
    seoData: SEOMetadata,
    siteUrl: string
): string {
    const socialLinks: string[] = [];

    // Collect social media URLs (using correct property names from CVPersonalInfo)
    if (cvData.personalInfo.linkedin) {
        socialLinks.push(cvData.personalInfo.linkedin);
    }
    if (cvData.personalInfo.github) {
        socialLinks.push(cvData.personalInfo.github);
    }
    if (cvData.personalInfo.x) {
        socialLinks.push(cvData.personalInfo.x);
    }
    if (cvData.personalInfo.facebook) {
        socialLinks.push(cvData.personalInfo.facebook);
    }
    if (cvData.personalInfo.instagram) {
        socialLinks.push(cvData.personalInfo.instagram);
    }
    if (cvData.personalInfo.website) {
        socialLinks.push(cvData.personalInfo.website);
    }

    // Extract skill names (handling both string and object formats)
    const skillNames = cvData.skills.map((skill) => {
        if (typeof skill === "string") return skill;
        return skill.name;
    });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: cvData.personalInfo.name,
        jobTitle: cvData.personalInfo.title || undefined,
        email: cvData.personalInfo.email || undefined,
        url: siteUrl,
        description: seoData.professionalSummary || seoData.metaDescription,
        image: cvData.personalInfo.profilePhotoUrl || undefined,
        sameAs: socialLinks.length > 0 ? socialLinks : undefined,
        knowsAbout: skillNames.length > 0 ? skillNames : undefined,
        address: cvData.personalInfo.location
            ? {
                "@type": "PostalAddress",
                addressLocality: cvData.personalInfo.location,
            }
            : undefined,
    };

    // Remove undefined fields
    const cleanJsonLd = JSON.parse(
        JSON.stringify(jsonLd, (_, value) => (value === undefined ? undefined : value))
    );

    return `
  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
${JSON.stringify(cleanJsonLd, null, 2)}
  </script>`;
}

/**
 * Generates keywords from CV data automatically
 */
export function generateKeywordsFromCV(cvData: CVData): string[] {
    const keywords: Set<string> = new Set();

    // Add job title keywords
    if (cvData.personalInfo.title) {
        keywords.add(cvData.personalInfo.title);
        // Split compound titles
        cvData.personalInfo.title.split(/[,\-\/&]/).forEach((part) => {
            const trimmed = part.trim();
            if (trimmed.length > 2) keywords.add(trimmed);
        });
    }

    // Add top skills (max 5)
    cvData.skills.slice(0, 5).forEach((skill) => {
        const skillName = typeof skill === "string" ? skill : skill.name;
        keywords.add(skillName);
    });

    // Add company names from experience (max 3)
    cvData.experience.slice(0, 3).forEach((exp) => {
        if (exp.company) keywords.add(exp.company);
    });

    // Add education institutions (max 2)
    cvData.education.slice(0, 2).forEach((edu) => {
        if (edu.school) keywords.add(edu.school);
    });

    // Add location
    if (cvData.personalInfo.location) {
        keywords.add(cvData.personalInfo.location);
    }

    // Convert to array and limit to 10
    return Array.from(keywords).slice(0, 10);
}

/**
 * Generates OG Image URL
 * Returns profile photo URL if available, otherwise generates initials-based image
 */
export function generateOgImageUrl(
    cvData: CVData,
    themeColors: ThemeColors
): string | undefined {
    // If profile photo exists, use it
    if (cvData.personalInfo.profilePhotoUrl) {
        return cvData.personalInfo.profilePhotoUrl;
    }

    // Otherwise, generate SVG with initials (same logic as favicon)
    // Note: For OG images, we need a hosted URL, so we return undefined
    // and let the HTML generator create an inline data URI if needed
    // In production, this could be a dynamic image generation endpoint
    return undefined;
}

/**
 * Generates complete SEO metadata from CV data and AI-generated SEO data
 */
export function generateSEOMetadata(
    cvData: CVData,
    seoData: SEOData | undefined,
    themeColors: ThemeColors,
    siteUrl?: string
): SEOMetadata {
    // Generate fallback SEO data if not provided by AI
    const fallbackTitle = `${cvData.personalInfo.name}${cvData.personalInfo.title ? ` - ${cvData.personalInfo.title}` : ""} | Portfolio`;
    const fallbackDescription =
        cvData.summary?.slice(0, 160) ||
        `${cvData.personalInfo.name}'s professional portfolio and resume.`;
    const fallbackKeywords = generateKeywordsFromCV(cvData);

    return {
        metaTitle: seoData?.metaTitle || fallbackTitle,
        metaDescription: seoData?.metaDescription || fallbackDescription,
        keywords: seoData?.keywords?.length ? seoData.keywords : fallbackKeywords,
        professionalSummary: seoData?.professionalSummary || cvData.summary,
        author: cvData.personalInfo.name,
        canonicalUrl: siteUrl,
        robots: "index, follow",
        ogImage: generateOgImageUrl(cvData, themeColors),
        locale: "tr_TR",
    };
}

/**
 * Generates all SEO HTML tags combined
 */
export function generateAllSEOTags(
    cvData: CVData,
    seoData: SEOData | undefined,
    themeColors: ThemeColors,
    siteUrl: string
): string {
    const metadata = generateSEOMetadata(cvData, seoData, themeColors, siteUrl);

    return [
        generatePrimaryMetaTags(metadata),
        generateOpenGraphTags(metadata, siteUrl),
        generateTwitterCardTags(metadata, siteUrl),
        generateCanonicalUrl(siteUrl),
        generateJsonLdPersonSchema(cvData, metadata, siteUrl),
    ].join("\n");
}
