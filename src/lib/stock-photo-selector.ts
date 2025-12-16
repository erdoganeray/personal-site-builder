/**
 * Stock Photo Selector - Gemini AI ile Akıllı Görsel Seçimi
 * 
 * Bu modül, CV verilerini analiz ederek en uygun stok fotoğrafları seçer.
 * İki aşamalı yaklaşım kullanır:
 * 1. CV'ye özel Pexels arama sorguları üretimi
 * 2. Aday görseller arasından en uygun olanın seçimi
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { CVData } from "./gemini-pdf-parser";
import type { ThemeColors } from "../types/templates";
import {
    searchStockPhotos,
    searchMultipleQueries,
    type PexelsPhoto,
    type StockPhotoResult
} from "./stock-photo-service";
import {
    STOCK_PHOTO_CATEGORIES,
    getFallbackUrl,
    suggestCategoryByProfession
} from "./stock-photo-registry";

// ==================== Types ====================

export interface PhotoSelectionContext {
    /** CV verileri */
    cvData: {
        name?: string;
        profession?: string;
        industry?: string;
        skills?: string[];
        summary?: string;
    };
    /** Template kategorisi */
    templateCategory: 'hero' | 'hero-creative' | 'hero-tech' | 'contact' | 'about';
    /** Site stili */
    templateStyle?: 'professional' | 'creative' | 'minimal' | 'modern';
    /** Tema renkleri */
    themeColors?: {
        primary: string;
        secondary: string;
        isDarkTheme: boolean;
    };
}

export interface GeneratedSearchQueries {
    /** Arama sorguları (öncelik sırasına göre) */
    queries: string[];
    /** Gemini'nin seçim gerekçesi */
    reasoning: string;
}

export interface PhotoSelectionResult {
    /** Seçilen görsel */
    photo: StockPhotoResult;
    /** Seçim gerekçesi */
    reasoning?: string;
    /** Kullanılan arama sorguları */
    usedQueries?: string[];
}

// ==================== Main Functions ====================

/**
 * CV verilerine göre optimize arama sorguları üretir
 * 
 * @param context - CV ve template bilgileri
 * @returns Arama sorguları ve gerekçe
 */
export async function generateOptimalSearchQuery(
    context: PhotoSelectionContext
): Promise<GeneratedSearchQueries> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.warn('⚠️ GEMINI_API_KEY not set, using default queries');
        return getDefaultQueries(context);
    }

    try {
        const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        const categoryConfig = STOCK_PHOTO_CATEGORIES[context.templateCategory];
        const categoryDescription = categoryConfig?.description || 'Professional background image';

        const prompt = `
Sen profesyonel bir web sitesi tasarımcısısın. Aşağıdaki CV bilgilerine dayanarak,
${context.templateCategory} bölümü için en uygun stok fotoğraf arama sorgularını üret.

CV Bilgileri:
- İsim: ${context.cvData.name || 'Belirtilmemiş'}
- Meslek/Ünvan: ${context.cvData.profession || 'Belirtilmemiş'}
- Sektör: ${context.cvData.industry || 'Belirtilmemiş'}
- Yetenekler: ${context.cvData.skills?.slice(0, 5).join(', ') || 'Belirtilmemiş'}
- Özet: ${context.cvData.summary?.substring(0, 200) || 'Belirtilmemiş'}

Template Bilgileri:
- Kategori: ${context.templateCategory}
- Açıklama: ${categoryDescription}
- Site Stili: ${context.templateStyle || 'modern'}
${context.themeColors ? `- Tema: ${context.themeColors.isDarkTheme ? 'Koyu' : 'Açık'} tema` : ''}

Kurallar:
1. İngilizce arama sorguları üret (Pexels için)
2. Mesleğe ve sektöre uygun görseller için sorgular olsun
3. Her sorgu 2-4 kelime olmalı (çok spesifik olma)
4. Profesyonel ve modern görseller için optimize et
5. 3 farklı arama sorgusu öner, öncelik sırasına göre

ÖNEMLİ: Sadece JSON formatında yanıt ver, başka açıklama ekleme.

Yanıt formatı:
{
  "queries": ["query1", "query2", "query3"],
  "reasoning": "Kısa açıklama (Türkçe, max 50 kelime)"
}
`;

        console.log(`🤖 Gemini: Generating search queries for ${context.templateCategory}...`);

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // JSON parse
        let cleanedText = responseText.trim();
        cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/^```\s*/, '');
        cleanedText = cleanedText.replace(/\s*```$/g, '');
        cleanedText = cleanedText.trim();

        const parsed = JSON.parse(cleanedText);

        if (!parsed.queries || !Array.isArray(parsed.queries) || parsed.queries.length === 0) {
            throw new Error('Invalid response format');
        }

        console.log(`✅ Gemini generated queries: ${parsed.queries.join(', ')}`);

        return {
            queries: parsed.queries.slice(0, 3),
            reasoning: parsed.reasoning || 'AI-generated queries based on CV'
        };

    } catch (error) {
        console.error('❌ Gemini query generation error:', error);
        return getDefaultQueries(context);
    }
}

/**
 * Aday görseller arasından en uygun olanı seçer
 * 
 * @param candidates - Pexels'den gelen aday görseller
 * @param context - CV ve template bilgileri
 * @returns Seçilen görsel
 */
export async function selectBestPhotoWithAI(
    candidates: PexelsPhoto[],
    context: PhotoSelectionContext
): Promise<PexelsPhoto> {
    // Aday yoksa veya tek aday varsa direkt döndür
    if (candidates.length === 0) {
        throw new Error('No candidates provided');
    }

    if (candidates.length === 1) {
        return candidates[0];
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.warn('⚠️ GEMINI_API_KEY not set, selecting first candidate');
        return candidates[0];
    }

    try {
        const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        // Aday bilgilerini hazırla (görsel URL'leri analiz için dahil etmiyoruz - sadece metadata)
        const candidateDescriptions = candidates.slice(0, 8).map((photo, index) => ({
            index,
            id: photo.id,
            alt: photo.alt || 'No description',
            photographer: photo.photographer,
            avgColor: photo.avg_color,
            width: photo.width,
            height: photo.height,
            aspectRatio: (photo.width / photo.height).toFixed(2)
        }));

        const prompt = `
Sen profesyonel bir web tasarımcısısın. Aşağıdaki ${candidates.length} stok fotoğraf arasından en uygun olanını seç.

Kullanıcı Profili:
- Meslek: ${context.cvData.profession || 'Profesyonel'}
- Sektör: ${context.cvData.industry || 'Genel'}
- Site Stili: ${context.templateStyle || 'modern'}
- Kullanım Yeri: ${context.templateCategory} bölümü
${context.themeColors ? `- Tema: ${context.themeColors.isDarkTheme ? 'Koyu tema' : 'Açık tema'}
- Ana Renk: ${context.themeColors.primary}` : ''}

Aday Görseller:
${candidateDescriptions.map((c, i) => `
${i + 1}. ID: ${c.id}
   Alt Text: ${c.alt}
   Boyut: ${c.width}x${c.height} (Oran: ${c.aspectRatio})
   Ortalama Renk: ${c.avgColor}
`).join('')}

Seçim Kriterleri (öncelik sırasına göre):
1. Alt text'in meslek/sektör ile uyumu (en önemli)
2. Görsel boyutu ve oranı (landscape tercih)
3. Renk uyumu (avgColor ile tema uyumu)
4. Profesyonel ve modern görünüm

ÖNEMLİ: Sadece JSON formatında yanıt ver.

Yanıt formatı:
{
  "selectedIndex": 0,
  "reasoning": "Seçim gerekçesi (Türkçe, max 30 kelime)"
}
`;

        console.log(`🤖 Gemini: Selecting best photo from ${candidates.length} candidates...`);

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // JSON parse
        let cleanedText = responseText.trim();
        cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/^```\s*/, '');
        cleanedText = cleanedText.replace(/\s*```$/g, '');
        cleanedText = cleanedText.trim();

        const parsed = JSON.parse(cleanedText);

        const selectedIndex = Math.min(
            Math.max(0, parsed.selectedIndex || 0),
            candidates.length - 1
        );

        console.log(`✅ Gemini selected photo index ${selectedIndex}: "${candidates[selectedIndex].alt || 'No alt'}"`);

        return candidates[selectedIndex];

    } catch (error) {
        console.error('❌ Gemini photo selection error:', error);
        // Fallback: İlk görseli seç
        return candidates[0];
    }
}

/**
 * Template için stok fotoğraf getirir (tam akış)
 * 
 * 1. CV'ye özel arama sorguları üretir (Gemini)
 * 2. Pexels'de arar
 * 3. En uygun görseli seçer (Gemini)
 * 
 * @param templateCategory - Template kategorisi
 * @param cvData - CV verileri
 * @param themeColors - Tema renkleri (opsiyonel)
 * @param style - Site stili (opsiyonel)
 * @returns Seçilen görsel
 */
export async function getStockPhotoForTemplate(
    templateCategory: 'hero' | 'hero-creative' | 'hero-tech' | 'contact' | 'about',
    cvData: CVData,
    themeColors?: ThemeColors,
    style?: 'professional' | 'creative' | 'minimal' | 'modern'
): Promise<PhotoSelectionResult> {
    console.log(`\n📸 Stock Photo Selection for: ${templateCategory}`);

    // Context oluştur
    const context: PhotoSelectionContext = {
        cvData: {
            name: cvData.personalInfo?.name,
            profession: cvData.personalInfo?.title || cvData.summary?.split('.')[0]?.substring(0, 50),
            industry: extractIndustry(cvData),
            skills: normalizeSkills(cvData.skills),
            summary: cvData.summary
        },
        templateCategory,
        templateStyle: style || 'modern',
        themeColors: themeColors ? {
            primary: themeColors.primary,
            secondary: themeColors.secondary,
            isDarkTheme: isColorDark(themeColors.background)
        } : undefined
    };

    try {
        // 1. Gemini ile optimal arama sorguları üret
        const { queries, reasoning: queryReasoning } = await generateOptimalSearchQuery(context);

        // 2. Pexels'de ara
        const categoryConfig = STOCK_PHOTO_CATEGORIES[templateCategory];
        const allCandidates = await searchMultipleQueries(queries, {
            orientation: categoryConfig?.orientation || 'landscape',
            perPage: 5,
            minWidth: categoryConfig?.minWidth || 1280
        });

        if (allCandidates.length === 0) {
            console.warn(`⚠️ No photos found for "${templateCategory}", using fallback`);
            return {
                photo: {
                    url: getFallbackUrl(templateCategory),
                    alt: `Default ${templateCategory} background`,
                    source: 'fallback'
                },
                reasoning: 'No suitable photos found, using fallback image',
                usedQueries: queries
            };
        }

        // 3. Gemini ile en uygun görseli seç
        const selectedPhoto = await selectBestPhotoWithAI(allCandidates, context);

        return {
            photo: {
                url: selectedPhoto.src.large2x || selectedPhoto.src.large || selectedPhoto.src.original,
                alt: selectedPhoto.alt || `Professional ${templateCategory} image`,
                photographer: selectedPhoto.photographer,
                pexelsId: selectedPhoto.id,
                avgColor: selectedPhoto.avg_color,
                source: 'pexels'
            },
            reasoning: queryReasoning,
            usedQueries: queries
        };

    } catch (error) {
        console.error(`❌ Stock photo selection failed for ${templateCategory}:`, error);

        // Fallback: Default sorgu ile basit arama yap
        try {
            const fallbackQuery = suggestCategoryByProfession(context.cvData.profession || '');
            const categoryConfig = STOCK_PHOTO_CATEGORIES[fallbackQuery] || STOCK_PHOTO_CATEGORIES[templateCategory];

            if (categoryConfig) {
                const photos = await searchStockPhotos(categoryConfig.defaultQueries[0], {
                    orientation: categoryConfig.orientation,
                    perPage: 3
                });

                if (photos.length > 0) {
                    return {
                        photo: {
                            url: photos[0].src.large2x || photos[0].src.large,
                            alt: photos[0].alt || `Professional ${templateCategory} image`,
                            photographer: photos[0].photographer,
                            pexelsId: photos[0].id,
                            source: 'pexels'
                        },
                        reasoning: 'Fallback search used'
                    };
                }
            }
        } catch (fallbackError) {
            console.error('❌ Fallback search also failed:', fallbackError);
        }

        // Son çare: Statik fallback
        return {
            photo: {
                url: getFallbackUrl(templateCategory),
                alt: `Default ${templateCategory} background`,
                source: 'fallback'
            },
            reasoning: 'All searches failed, using static fallback'
        };
    }
}

// ==================== Helper Functions ====================

/**
 * Default arama sorguları oluşturur (Gemini başarısız olursa)
 */
function getDefaultQueries(context: PhotoSelectionContext): GeneratedSearchQueries {
    const categoryConfig = STOCK_PHOTO_CATEGORIES[context.templateCategory];

    if (categoryConfig) {
        return {
            queries: categoryConfig.defaultQueries,
            reasoning: 'Using default queries (AI unavailable)'
        };
    }

    // Meslek bazlı fallback
    const profession = context.cvData.profession?.toLowerCase() || '';

    let queries: string[];
    if (profession.includes('software') || profession.includes('developer')) {
        queries = ['developer workspace', 'coding environment', 'tech office'];
    } else if (profession.includes('design') || profession.includes('creative')) {
        queries = ['creative workspace', 'artistic studio', 'design office'];
    } else {
        queries = ['professional workspace', 'modern office', 'business background'];
    }

    return {
        queries,
        reasoning: 'Using profession-based default queries'
    };
}

/**
 * CV verilerinden sektör bilgisi çıkarır
 */
function extractIndustry(cvData: CVData): string | undefined {
    // Deneyimlerden sektör tahmin et
    if (cvData.experience && cvData.experience.length > 0) {
        const latestExp = cvData.experience[0];
        return latestExp.company;
    }

    // Skills'den tahmin et
    const skills = normalizeSkills(cvData.skills);
    if (skills.some(s => s.toLowerCase().includes('software') || s.toLowerCase().includes('programming'))) {
        return 'Technology';
    }
    if (skills.some(s => s.toLowerCase().includes('design') || s.toLowerCase().includes('figma'))) {
        return 'Design';
    }
    if (skills.some(s => s.toLowerCase().includes('marketing'))) {
        return 'Marketing';
    }

    return undefined;
}

/**
 * Skills array'ini normalize eder
 */
function normalizeSkills(skills: any[]): string[] {
    if (!skills || !Array.isArray(skills)) return [];

    return skills.map(skill => {
        if (typeof skill === 'string') return skill;
        if (typeof skill === 'object' && skill.name) return skill.name;
        return String(skill);
    }).filter(Boolean);
}

/**
 * Rengin koyu mu açık mı olduğunu kontrol eder
 */
function isColorDark(color: string): boolean {
    if (!color) return false;

    // Hex rengi RGB'ye çevir
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Luminance hesapla
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance < 0.5;
}
