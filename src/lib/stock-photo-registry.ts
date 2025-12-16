/**
 * Stock Photo Registry - Kategori tanımları ve fallback görseller
 * 
 * Her template kategorisi için arama parametreleri ve yedek görselleri tanımlar.
 */

export interface StockPhotoCategory {
    id: string;
    /** Gemini fallback durumunda kullanılacak varsayılan sorgular */
    defaultQueries: string[];
    /** API başarısız olursa kullanılacak yedek görsel */
    fallbackUrl: string;
    /** Pexels API için görsel yönelimi */
    orientation: 'landscape' | 'portrait' | 'square';
    /** Minimum görsel genişliği (piksel) */
    minWidth: number;
    /** Kategori açıklaması (Gemini prompt için) */
    description: string;
}

/**
 * Desteklenen stok fotoğraf kategorileri
 */
export const STOCK_PHOTO_CATEGORIES: Record<string, StockPhotoCategory> = {
    'hero': {
        id: 'hero',
        defaultQueries: [
            'professional workspace aesthetic',
            'modern office background',
            'abstract business gradient'
        ],
        fallbackUrl: '/defaults/hero-fallback.svg',
        orientation: 'landscape',
        minWidth: 1920,
        description: 'Hero section background - should be professional, modern, and suitable as a backdrop'
    },
    'hero-creative': {
        id: 'hero-creative',
        defaultQueries: [
            'creative colorful abstract',
            'artistic design background',
            'vibrant gradient texture'
        ],
        fallbackUrl: '/defaults/hero-creative-fallback.svg',
        orientation: 'landscape',
        minWidth: 1920,
        description: 'Creative hero background - artistic, colorful, suitable for designers and creative professionals'
    },
    'hero-tech': {
        id: 'hero-tech',
        defaultQueries: [
            'technology abstract background',
            'coding developer workspace',
            'digital innovation concept'
        ],
        fallbackUrl: '/defaults/hero-tech-fallback.svg',
        orientation: 'landscape',
        minWidth: 1920,
        description: 'Tech-focused hero background - suitable for developers, engineers, tech professionals'
    },
    'contact': {
        id: 'contact',
        defaultQueries: [
            'business communication concept',
            'contact us office',
            'professional meeting handshake'
        ],
        fallbackUrl: '/defaults/contact-fallback.svg',
        orientation: 'landscape',
        minWidth: 1280,
        description: 'Contact section image - communication, connection, or professional interaction themes'
    },
    'about': {
        id: 'about',
        defaultQueries: [
            'professional portrait background',
            'modern minimal workspace',
            'personal branding backdrop'
        ],
        fallbackUrl: '/defaults/about-fallback.svg',
        orientation: 'landscape',
        minWidth: 1280,
        description: 'About section background - personal, professional, suitable for bio/story sections'
    }
};

/**
 * Fallback görseller - API başarısız olduğunda kullanılır
 * Bu görseller public/defaults/ klasöründe bulunmalıdır
 */
export const FALLBACK_IMAGES: Record<string, string> = {
    'hero': '/defaults/hero-fallback.svg',
    'hero-creative': '/defaults/hero-creative-fallback.svg',
    'hero-tech': '/defaults/hero-tech-fallback.svg',
    'contact': '/defaults/contact-fallback.svg',
    'about': '/defaults/about-fallback.svg',
    // Genel fallback - kategori bulunamazsa
    'default': '/defaults/generic-fallback.svg'
};

/**
 * Meslek bazlı kategori önerileri
 * Gemini bu eşleştirmeyi override edebilir
 */
export const PROFESSION_CATEGORY_MAP: Record<string, string> = {
    // Tech & Engineering
    'software': 'hero-tech',
    'developer': 'hero-tech',
    'engineer': 'hero-tech',
    'programmer': 'hero-tech',
    'data': 'hero-tech',
    'devops': 'hero-tech',
    'cloud': 'hero-tech',
    'cyber': 'hero-tech',

    // Creative
    'designer': 'hero-creative',
    'artist': 'hero-creative',
    'creative': 'hero-creative',
    'graphic': 'hero-creative',
    'ux': 'hero-creative',
    'ui': 'hero-creative',
    'photographer': 'hero-creative',
    'videographer': 'hero-creative',

    // Default for others
    'default': 'hero'
};

/**
 * Kategori ID'sinden StockPhotoCategory nesnesini döndürür
 */
export function getCategory(categoryId: string): StockPhotoCategory | undefined {
    return STOCK_PHOTO_CATEGORIES[categoryId];
}

/**
 * Kategori ID'sinden fallback URL döndürür
 */
export function getFallbackUrl(categoryId: string): string {
    return FALLBACK_IMAGES[categoryId] || FALLBACK_IMAGES['default'];
}

/**
 * Meslek anahtar kelimesinden önerilen kategori ID'sini döndürür
 */
export function suggestCategoryByProfession(profession: string): string {
    const lowerProfession = profession.toLowerCase();

    for (const [keyword, category] of Object.entries(PROFESSION_CATEGORY_MAP)) {
        if (lowerProfession.includes(keyword)) {
            return category;
        }
    }

    return PROFESSION_CATEGORY_MAP['default'];
}

/**
 * Tüm kategori ID'lerini döndürür
 */
export function getAllCategoryIds(): string[] {
    return Object.keys(STOCK_PHOTO_CATEGORIES);
}
