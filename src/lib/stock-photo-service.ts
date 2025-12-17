/**
 * Stock Photo Service - Pexels API Client
 * 
 * Pexels API ile stok fotoğraf arama ve seçme işlemlerini yönetir.
 * Hotlinking yaklaşımı kullanılır - görseller doğrudan Pexels CDN'den serve edilir.
 */

import {
    STOCK_PHOTO_CATEGORIES,
    getFallbackUrl,
    type StockPhotoCategory
} from './stock-photo-registry';

// ==================== Types ====================

export interface PexelsPhoto {
    id: number;
    width: number;
    height: number;
    url: string;
    photographer: string;
    photographer_url: string;
    photographer_id: number;
    avg_color: string;
    src: {
        original: string;
        large2x: string;
        large: string;
        medium: string;
        small: string;
        portrait: string;
        landscape: string;
        tiny: string;
    };
    liked: boolean;
    alt: string;
}

export interface PexelsSearchResponse {
    total_results: number;
    page: number;
    per_page: number;
    photos: PexelsPhoto[];
    next_page?: string;
}

export interface StockPhotoResult {
    /** Görsel URL'i (Pexels CDN) */
    url: string;
    /** Alt text */
    alt: string;
    /** Fotoğrafçı ismi (attribution için) */
    photographer?: string;
    /** Pexels foto ID'si */
    pexelsId?: number;
    /** Ortalama renk (hex) */
    avgColor?: string;
    /** Kaynak türü */
    source: 'pexels' | 'fallback';
}

export interface SearchOptions {
    /** Görsel yönelimi */
    orientation?: 'landscape' | 'portrait' | 'square';
    /** Sayfa başına sonuç */
    perPage?: number;
    /** Sayfa numarası */
    page?: number;
    /** Minimum genişlik */
    minWidth?: number;
    /** Minimum yükseklik */
    minHeight?: number;
}

// ==================== Constants ====================

const PEXELS_API_BASE = 'https://api.pexels.com/v1';

// ==================== Main Functions ====================

/**
 * Pexels API'da stok fotoğraf arar
 * 
 * @param query - Arama sorgusu (İngilizce)
 * @param options - Arama opsiyonları
 * @returns Bulunan fotoğraflar
 */
export async function searchStockPhotos(
    query: string,
    options: SearchOptions = {}
): Promise<PexelsPhoto[]> {
    const apiKey = process.env.PEXELS_API_KEY;

    if (!apiKey) {
        console.error('❌ PEXELS_API_KEY environment variable is not set');
        return [];
    }

    const params = new URLSearchParams({
        query: query.trim(),
        orientation: options.orientation || 'landscape',
        per_page: String(options.perPage || 10),
        page: String(options.page || 1),
        locale: 'en-US'
    });

    try {
        console.log(`🔍 Pexels search: "${query}" (${options.orientation || 'landscape'})`);

        const response = await fetch(
            `${PEXELS_API_BASE}/search?${params}`,
            {
                headers: {
                    'Authorization': apiKey
                },
                cache: 'force-cache' // Tarayıcı cache'ini kullan
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Pexels API error: ${response.status} - ${errorText}`);
            return [];
        }

        const data: PexelsSearchResponse = await response.json();

        console.log(`✅ Pexels found ${data.photos.length} photos for "${query}"`);

        // Minimum boyut filtresi uygula
        let filteredPhotos = data.photos;

        if (options.minWidth) {
            filteredPhotos = filteredPhotos.filter(p => p.width >= options.minWidth!);
        }

        if (options.minHeight) {
            filteredPhotos = filteredPhotos.filter(p => p.height >= options.minHeight!);
        }

        return filteredPhotos;
    } catch (error) {
        console.error('❌ Pexels API fetch error:', error);
        return [];
    }
}

/**
 * Belirli bir kategori için stok fotoğraf arar
 * 
 * @param categoryId - Kategori ID'si (örn: 'hero', 'contact')
 * @param customQuery - Özel arama sorgusu (opsiyonel)
 * @returns En uygun fotoğraf veya fallback
 */
export async function getStockPhotoByCategory(
    categoryId: string,
    customQuery?: string
): Promise<StockPhotoResult> {
    const category = STOCK_PHOTO_CATEGORIES[categoryId];

    if (!category) {
        console.warn(`⚠️ Unknown stock photo category: ${categoryId}`);
        return createFallbackResult(categoryId);
    }

    // Arama sorgusu belirle
    const query = customQuery || category.defaultQueries[0];

    // Pexels'de ara
    const photos = await searchStockPhotos(query, {
        orientation: category.orientation,
        perPage: 5,
        minWidth: category.minWidth
    });

    if (photos.length === 0) {
        // Alternatif sorgularla dene
        for (const altQuery of category.defaultQueries.slice(1)) {
            const altPhotos = await searchStockPhotos(altQuery, {
                orientation: category.orientation,
                perPage: 3
            });

            if (altPhotos.length > 0) {
                return photoToResult(altPhotos[0]);
            }
        }

        // Hiç sonuç bulunamadı, fallback döndür
        console.warn(`⚠️ No photos found for category "${categoryId}", using fallback`);
        return createFallbackResult(categoryId);
    }

    // İlk fotoğrafı döndür (Gemini entegrasyonu ile seçim yapılacak)
    return photoToResult(photos[0]);
}

/**
 * Birden fazla arama sorgusu ile fotoğraf aday listesi oluşturur
 * Gemini ile seçim yapmak için kullanılır
 * 
 * @param queries - Arama sorguları listesi
 * @param options - Arama opsiyonları
 * @returns Tüm sorgulardan bulunan benzersiz fotoğraflar
 */
export async function searchMultipleQueries(
    queries: string[],
    options: SearchOptions = {}
): Promise<PexelsPhoto[]> {
    const allPhotos: PexelsPhoto[] = [];
    const seenIds = new Set<number>();

    // Paralel arama yap - tüm sorguları aynı anda çalıştır
    const searchPromises = queries.map(query =>
        searchStockPhotos(query, {
            ...options,
            perPage: options.perPage || 5
        })
    );

    const results = await Promise.all(searchPromises);

    // Sonuçları birleştir, benzersiz olanları al
    for (const photos of results) {
        for (const photo of photos) {
            if (!seenIds.has(photo.id)) {
                seenIds.add(photo.id);
                allPhotos.push(photo);
            }
        }
        // Yeterli aday var mı?
        if (allPhotos.length >= 10) break;
    }

    return allPhotos;
}

/**
 * Pexels fotoğraf ID'si ile fotoğraf getirir
 * 
 * @param photoId - Pexels fotoğraf ID'si
 * @returns Fotoğraf detayları veya null
 */
export async function getPhotoById(photoId: number): Promise<PexelsPhoto | null> {
    const apiKey = process.env.PEXELS_API_KEY;

    if (!apiKey) {
        console.error('❌ PEXELS_API_KEY environment variable is not set');
        return null;
    }

    try {
        const response = await fetch(
            `${PEXELS_API_BASE}/photos/${photoId}`,
            {
                headers: {
                    'Authorization': apiKey
                }
            }
        );

        if (!response.ok) {
            console.error(`❌ Pexels API error: ${response.status}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('❌ Pexels API fetch error:', error);
        return null;
    }
}

// ==================== Helper Functions ====================

/**
 * PexelsPhoto nesnesini StockPhotoResult'a dönüştürür
 */
function photoToResult(photo: PexelsPhoto): StockPhotoResult {
    return {
        url: photo.src.large2x || photo.src.large || photo.src.original,
        alt: photo.alt || 'Professional stock image',
        photographer: photo.photographer,
        pexelsId: photo.id,
        avgColor: photo.avg_color,
        source: 'pexels'
    };
}

/**
 * Fallback sonuç oluşturur
 */
function createFallbackResult(categoryId: string): StockPhotoResult {
    return {
        url: getFallbackUrl(categoryId),
        alt: `Default ${categoryId} background image`,
        source: 'fallback'
    };
}

/**
 * Görsel boyutunu seçer (responsive için)
 * 
 * @param photo - Pexels fotoğraf nesnesi
 * @param preferredWidth - Tercih edilen genişlik
 * @returns Uygun boyuttaki görsel URL'i
 */
export function selectImageSize(
    photo: PexelsPhoto,
    preferredWidth: number = 1920
): string {
    if (preferredWidth >= 2000) {
        return photo.src.original;
    } else if (preferredWidth >= 1200) {
        return photo.src.large2x;
    } else if (preferredWidth >= 800) {
        return photo.src.large;
    } else if (preferredWidth >= 400) {
        return photo.src.medium;
    } else {
        return photo.src.small;
    }
}

/**
 * Pexels görsel URL'ine boyut parametresi ekler
 * 
 * @param url - Orijinal Pexels URL
 * @param width - İstenen genişlik
 * @param height - İstenen yükseklik (opsiyonel)
 * @returns Boyutlandırılmış URL
 */
export function resizeImageUrl(
    url: string,
    width: number,
    height?: number
): string {
    const urlObj = new URL(url);

    urlObj.searchParams.set('w', String(width));
    urlObj.searchParams.set('auto', 'compress');
    urlObj.searchParams.set('cs', 'tinysrgb');

    if (height) {
        urlObj.searchParams.set('h', String(height));
        urlObj.searchParams.set('fit', 'crop');
    }

    return urlObj.toString();
}
