/**
 * Chat Suggestions
 * 
 * Provides context-aware suggestions and redirect messages for the chat interface.
 */

import { DesignPlan } from "./revision-operations";
import { CVData } from "./gemini-pdf-parser";

export interface ChatSuggestions {
    componentOperations: string[];
    themeChanges: string[];
    layoutChanges: string[];
}

/**
 * Get suggestions based on current site state
 * @param designPlan Current design plan
 * @param cvData Current CV data
 * @returns Contextual suggestions
 */
export function getSuggestionsForSite(
    designPlan: DesignPlan,
    cvData: CVData | null
): ChatSuggestions {
    const currentCategories = designPlan.selectedComponents.map((c) => c.category);

    const componentOperations: string[] = [];
    const themeChanges: string[] = [
        "Renkleri mavi tonlara çevir",
        "Daha koyu bir tema kullan",
        "Accent rengini turuncu yap",
        "Minimalist bir renk paleti kullan",
    ];
    const layoutChanges: string[] = [];

    // Suggest adding components that have CV data but aren't in the design
    if (cvData) {
        if (cvData.portfolio && cvData.portfolio.length > 0 && !currentCategories.includes("portfolio")) {
            componentOperations.push("Portfolio bölümünü ekle");
        }

        if (cvData.experience && cvData.experience.length > 0 && !currentCategories.includes("experience")) {
            componentOperations.push("Deneyim bölümünü ekle");
        }

        if (cvData.education && cvData.education.length > 0 && !currentCategories.includes("education")) {
            componentOperations.push("Eğitim bölümünü ekle");
        }

        if (cvData.skills && cvData.skills.length > 0 && !currentCategories.includes("skills")) {
            componentOperations.push("Yetenekler bölümünü ekle");
        }

        if (cvData.languages && cvData.languages.length > 0 && !currentCategories.includes("languages")) {
            componentOperations.push("Diller bölümünü ekle");
        }
    }

    // Suggest removing existing components
    if (currentCategories.includes("portfolio")) {
        componentOperations.push("Portfolio bölümünü kaldır");
    }
    if (currentCategories.includes("experience")) {
        componentOperations.push("Deneyim bölümünü kaldır");
    }

    // Suggest template changes for existing components
    if (currentCategories.includes("hero")) {
        componentOperations.push("Hero bölümünü daha modern yap");
        componentOperations.push("Hero'yu minimal tasarıma çevir");
    }

    if (currentCategories.includes("experience")) {
        componentOperations.push("Deneyim bölümünü timeline'dan kart görünümüne çevir");
    }

    if (currentCategories.includes("portfolio")) {
        componentOperations.push("Portfolio'yu grid'den masonry'ye çevir");
    }

    // Suggest layout changes
    if (currentCategories.includes("portfolio") && currentCategories.includes("experience")) {
        const portfolioIndex = currentCategories.indexOf("portfolio");
        const experienceIndex = currentCategories.indexOf("experience");

        if (portfolioIndex > experienceIndex) {
            layoutChanges.push("Portfolio'yu deneyimden önce göster");
        } else {
            layoutChanges.push("Deneyimi portfolio'dan önce göster");
        }
    }

    if (currentCategories.includes("contact")) {
        layoutChanges.push("İletişim bölümünü yukarı taşı");
    }

    return {
        componentOperations: componentOperations.slice(0, 4), // Limit to 4 suggestions
        themeChanges: themeChanges.slice(0, 4),
        layoutChanges: layoutChanges.slice(0, 3),
    };
}

/**
 * Get redirect message for MyInfo page
 * @param field Field to redirect to
 * @returns User-friendly redirect message
 */
export function getRedirectMessage(
    field: "personal" | "experience" | "education" | "skills" | "languages" | "portfolio"
): string {
    const fieldNames: Record<typeof field, string> = {
        personal: "Kişisel Bilgiler",
        experience: "Deneyim",
        education: "Eğitim",
        skills: "Yetenekler",
        languages: "Diller",
        portfolio: "Portfolio",
    };

    const fieldName = fieldNames[field];

    return `📝 Bu değişikliği yapmak için **Bilgilerim > ${fieldName}** bölümüne gitmeniz gerekiyor. CV içeriği değişiklikleri chat üzerinden yapılamaz.`;
}
