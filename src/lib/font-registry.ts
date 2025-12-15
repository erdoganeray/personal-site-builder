/**
 * Font Registry
 * 
 * Google Fonts collection and font pair definitions for the site builder.
 * Each font pair consists of a heading font and a body font that work well together.
 */

export interface FontPair {
    heading: string;
    body: string;
    googleFontsUrl: string;
    category: 'modern' | 'professional' | 'creative' | 'minimal';
    description: string;
}

/**
 * Curated collection of Google Fonts pairs
 * Each pair is optimized for readability and aesthetic harmony
 */
export const FONT_PAIRS: Record<string, FontPair> = {
    // Modern Fonts - Tech, startup, modern profiles
    'modern-1': {
        heading: 'Inter',
        body: 'Inter',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        category: 'modern',
        description: 'Clean, versatile sans-serif perfect for tech and modern profiles'
    },
    'modern-2': {
        heading: 'Poppins',
        body: 'Poppins',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap',
        category: 'modern',
        description: 'Geometric sans-serif with a friendly, modern feel'
    },
    'modern-3': {
        heading: 'Montserrat',
        body: 'Montserrat',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap',
        category: 'modern',
        description: 'Urban, modern typeface inspired by signage'
    },
    'modern-4': {
        heading: 'Space Grotesk',
        body: 'Inter',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap',
        category: 'modern',
        description: 'Distinctive headings with clean body text'
    },

    // Professional Fonts - Corporate, business profiles
    'professional-1': {
        heading: 'Roboto',
        body: 'Roboto',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap',
        category: 'professional',
        description: 'Google\'s flagship font, professional and highly readable'
    },
    'professional-2': {
        heading: 'Open Sans',
        body: 'Open Sans',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap',
        category: 'professional',
        description: 'Friendly yet professional, excellent for business'
    },
    'professional-3': {
        heading: 'Lato',
        body: 'Lato',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap',
        category: 'professional',
        description: 'Semi-rounded sans-serif with warmth and stability'
    },
    'professional-4': {
        heading: 'Work Sans',
        body: 'Work Sans',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;800&display=swap',
        category: 'professional',
        description: 'Optimized for on-screen text, professional and clear'
    },

    // Creative Fonts - Designers, artists, creative professionals
    'creative-1': {
        heading: 'Playfair Display',
        body: 'Source Sans Pro',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800;900&family=Source+Sans+Pro:wght@400;600;700&display=swap',
        category: 'creative',
        description: 'Elegant serif headings with clean sans-serif body'
    },
    'creative-2': {
        heading: 'Merriweather',
        body: 'Open Sans',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@700;900&family=Open+Sans:wght@400;600;700&display=swap',
        category: 'creative',
        description: 'Classic serif with modern sans-serif pairing'
    },
    'creative-3': {
        heading: 'Raleway',
        body: 'Raleway',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&display=swap',
        category: 'creative',
        description: 'Elegant and distinctive, perfect for creative portfolios'
    },
    'creative-4': {
        heading: 'Cormorant Garamond',
        body: 'Proza Libre',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Proza+Libre:wght@400;600;700&display=swap',
        category: 'creative',
        description: 'Sophisticated serif with contemporary sans-serif'
    },

    // Minimal Fonts - Clean, simple, minimalist designs
    'minimal-1': {
        heading: 'DM Sans',
        body: 'DM Sans',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap',
        category: 'minimal',
        description: 'Geometric sans-serif with excellent legibility'
    },
    'minimal-2': {
        heading: 'IBM Plex Sans',
        body: 'IBM Plex Sans',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap',
        category: 'minimal',
        description: 'Neutral, minimal typeface with personality'
    },
    'minimal-3': {
        heading: 'Outfit',
        body: 'Outfit',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap',
        category: 'minimal',
        description: 'Modern geometric sans-serif, clean and minimal'
    },
    'minimal-4': {
        heading: 'Manrope',
        body: 'Manrope',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap',
        category: 'minimal',
        description: 'Modern, minimal sans-serif with smooth curves'
    }
};

/**
 * Get a font pair by its ID
 * @param id - Font pair ID (e.g., 'modern-1', 'professional-2')
 * @returns FontPair object or undefined if not found
 */
export function getFontPairById(id: string): FontPair | undefined {
    return FONT_PAIRS[id];
}

/**
 * Get all font pairs in a specific category
 * @param category - Font category ('modern', 'professional', 'creative', 'minimal')
 * @returns Array of FontPair objects
 */
export function getFontPairsByCategory(category: 'modern' | 'professional' | 'creative' | 'minimal'): FontPair[] {
    return Object.entries(FONT_PAIRS)
        .filter(([_, pair]) => pair.category === category)
        .map(([_, pair]) => pair);
}

/**
 * Get all available font pair IDs
 * @returns Array of font pair IDs
 */
export function getAllFontPairIds(): string[] {
    return Object.keys(FONT_PAIRS);
}

/**
 * Get a default font pair for a given category
 * @param category - Font category
 * @returns Default FontPair for the category
 */
export function getDefaultFontPairForCategory(category: 'modern' | 'professional' | 'creative' | 'minimal'): FontPair {
    const defaults: Record<string, string> = {
        modern: 'modern-1',
        professional: 'professional-1',
        creative: 'creative-1',
        minimal: 'minimal-1'
    };

    return FONT_PAIRS[defaults[category]];
}

/**
 * Generate a formatted list of font pairs for AI prompts
 * @returns Formatted string describing all available font pairs
 */
export function generateFontPairsPromptText(): string {
    const categories = ['modern', 'professional', 'creative', 'minimal'] as const;

    let promptText = 'Mevcut Font Çiftleri:\n\n';

    categories.forEach(category => {
        const pairs = getFontPairsByCategory(category);
        promptText += `${category.toUpperCase()} FONTS:\n`;

        pairs.forEach((pair, index) => {
            const id = Object.entries(FONT_PAIRS).find(([_, p]) => p === pair)?.[0];
            promptText += `  ${id}: ${pair.heading}${pair.heading !== pair.body ? ` (heading) + ${pair.body} (body)` : ''} - ${pair.description}\n`;
        });

        promptText += '\n';
    });

    return promptText;
}
