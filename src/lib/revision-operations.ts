/**
 * Revision Operations
 * 
 * Template-based revision operations for modifying site design plans.
 * These functions manipulate the designPlan.selectedComponents array
 * without regenerating the entire site code.
 */

import { CVData } from "./gemini-pdf-parser";

export interface SelectedComponent {
    category: string;
    templateId: string;
}

export interface DesignPlan {
    selectedComponents: SelectedComponent[];
    themeColors?: {
        primary: string;
        secondary: string;
        accent: string;
        background?: string;
        text?: string;
        fontHeading?: string;
        fontBody?: string;
    };
    iconStyle?: 'outline' | 'solid';
    iconSizes?: {
        navigation: string;
        social: string;
    };
    fontStyle?: 'modern' | 'professional' | 'creative' | 'minimal';
    fontPairId?: string;
}

export interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background?: string;
    text?: string;
    fontHeading?: string;
    fontBody?: string;
}

/**
 * Add a component to the design plan
 * @param designPlan Current design plan
 * @param category Component category (e.g., 'portfolio', 'experience')
 * @param templateId Template ID to use
 * @param position Optional position to insert at (default: append)
 * @returns Updated design plan
 */
export function addComponent(
    designPlan: DesignPlan,
    category: string,
    templateId: string,
    position?: number
): DesignPlan {
    const newComponent: SelectedComponent = { category, templateId };
    const components = [...designPlan.selectedComponents];

    // Check if component already exists
    const existingIndex = components.findIndex((c) => c.category === category);
    if (existingIndex !== -1) {
        throw new Error(`Component '${category}' already exists in the design plan`);
    }

    // Insert at position or append
    if (position !== undefined && position >= 0 && position <= components.length) {
        components.splice(position, 0, newComponent);
    } else {
        components.push(newComponent);
    }

    return {
        ...designPlan,
        selectedComponents: components,
    };
}

/**
 * Remove a component from the design plan
 * @param designPlan Current design plan
 * @param category Component category to remove
 * @returns Updated design plan
 */
export function removeComponent(
    designPlan: DesignPlan,
    category: string
): DesignPlan {
    const components = designPlan.selectedComponents.filter(
        (c) => c.category !== category
    );

    if (components.length === designPlan.selectedComponents.length) {
        throw new Error(`Component '${category}' not found in design plan`);
    }

    return {
        ...designPlan,
        selectedComponents: components,
    };
}

/**
 * Reorder components in the design plan
 * @param designPlan Current design plan
 * @param newOrder Array of category names in desired order
 * @returns Updated design plan
 */
export function reorderComponents(
    designPlan: DesignPlan,
    newOrder: string[]
): DesignPlan {
    // Validate that all categories in newOrder exist
    const currentCategories = designPlan.selectedComponents.map((c) => c.category);
    const missingCategories = newOrder.filter((cat) => !currentCategories.includes(cat));

    if (missingCategories.length > 0) {
        throw new Error(`Categories not found: ${missingCategories.join(', ')}`);
    }

    // Check for extra categories in current that aren't in newOrder
    const extraCategories = currentCategories.filter((cat) => !newOrder.includes(cat));
    if (extraCategories.length > 0) {
        throw new Error(`New order is missing categories: ${extraCategories.join(', ')}`);
    }

    // Reorder components based on newOrder
    const reorderedComponents = newOrder.map((category) => {
        const component = designPlan.selectedComponents.find((c) => c.category === category);
        if (!component) {
            throw new Error(`Component '${category}' not found`);
        }
        return component;
    });

    return {
        ...designPlan,
        selectedComponents: reorderedComponents,
    };
}

/**
 * Change the template of an existing component
 * @param designPlan Current design plan
 * @param category Component category to change
 * @param newTemplateId New template ID
 * @returns Updated design plan
 */
export function changeComponentTemplate(
    designPlan: DesignPlan,
    category: string,
    newTemplateId: string
): DesignPlan {
    const components = [...designPlan.selectedComponents];
    const componentIndex = components.findIndex((c) => c.category === category);

    if (componentIndex === -1) {
        throw new Error(`Component '${category}' not found in design plan`);
    }

    components[componentIndex] = {
        ...components[componentIndex],
        templateId: newTemplateId,
    };

    return {
        ...designPlan,
        selectedComponents: components,
    };
}

/**
 * Update theme colors in the design plan using 4-color base palette
 * @param designPlan Current design plan
 * @param basePalette 4 base colors (primary, secondary, accent, neutral)
 * @param theme Optional theme type (light/dark)
 * @returns Updated design plan with full color palette
 */
export function updateThemeColors(
    designPlan: DesignPlan,
    basePalette: {
        primary: string;
        secondary: string;
        accent: string;
        neutral: string;
    },
    theme?: 'light' | 'dark'
): DesignPlan {
    const { generateFullPalette } = require('./color-utils');

    // Tema belirtilmemişse mevcut temayı koru veya varsayılan olarak 'light' kullan
    const currentTheme = theme || (designPlan as any).theme || 'light';

    // 4 ana renkten full palette oluştur
    const fullPalette = generateFullPalette(basePalette, currentTheme);

    // Font bilgilerini koru
    const themeColorsWithFonts = {
        ...fullPalette,
        fontHeading: designPlan.themeColors?.fontHeading,
        fontBody: designPlan.themeColors?.fontBody,
    };

    return {
        ...designPlan,
        themeColors: themeColorsWithFonts as any,
        theme: currentTheme,
    } as any;
}

/**
 * Extract base palette from existing design plan theme colors
 * Useful for partial color updates in revise operations
 * @param designPlan Current design plan
 * @returns Base palette with 4 colors
 */
export function extractBasePaletteFromDesignPlan(designPlan: DesignPlan): {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
} {
    const colors = designPlan.themeColors;
    return {
        primary: colors?.primary || '#2563eb',
        secondary: colors?.secondary || '#7c3aed',
        accent: colors?.accent || '#06b6d4',
        neutral: (colors as any)?.neutral || colors?.text || '#64748b',
    };
}

/**
 * Validate if a component can be added based on CV data
 * @param cvData Current CV data
 * @param category Component category to validate
 * @returns Object with isValid flag and reason if invalid
 */
export function validateComponentAddition(
    cvData: CVData | null,
    category: string
): { isValid: boolean; reason?: string } {
    if (!cvData) {
        return { isValid: false, reason: "CV verisi bulunamadı" };
    }

    switch (category) {
        case "portfolio":
            if (!cvData.portfolio || cvData.portfolio.length === 0) {
                return {
                    isValid: false,
                    reason: "Portfolio eklemek için en az bir portfolio fotoğrafı eklemelisiniz",
                };
            }
            break;

        case "experience":
            if (!cvData.experience || cvData.experience.length === 0) {
                return {
                    isValid: false,
                    reason: "Deneyim bölümü eklemek için en az bir iş deneyimi eklemelisiniz",
                };
            }
            break;

        case "education":
            if (!cvData.education || cvData.education.length === 0) {
                return {
                    isValid: false,
                    reason: "Eğitim bölümü eklemek için en az bir eğitim bilgisi eklemelisiniz",
                };
            }
            break;

        case "skills":
            if (!cvData.skills || cvData.skills.length === 0) {
                return {
                    isValid: false,
                    reason: "Yetenekler bölümü eklemek için en az bir yetenek eklemelisiniz",
                };
            }
            break;

        case "languages":
            if (!cvData.languages || cvData.languages.length === 0) {
                return {
                    isValid: false,
                    reason: "Diller bölümü eklemek için en az bir dil eklemelisiniz",
                };
            }
            break;

        // Components that don't require CV data validation
        case "nav":
        case "hero":
        case "contact":
        case "footer":
            break;

        default:
            return {
                isValid: false,
                reason: `Bilinmeyen component kategorisi: ${category}`,
            };
    }

    return { isValid: true };
}
