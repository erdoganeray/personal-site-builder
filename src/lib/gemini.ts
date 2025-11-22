import { GoogleGenerativeAI } from "@google/generative-ai";
import { CVData } from "./gemini-pdf-parser";

export interface GeneratedWebsite {
  html: string;
  title: string;
  description: string;
}

export interface WebsiteGenerationInput {
  cvData: CVData;
  linkedinUrl?: string;
  githubUrl?: string;
}

/**
 * Gemini API kullanarak CV verilerinden modern bir kişisel web sitesi oluşturur
 * @param input CV verileri ve opsiyonel sosyal medya linkleri
 * @returns Üretilen HTML, başlık ve açıklama
 */
export async function generateWebsite(
  input: WebsiteGenerationInput
): Promise<GeneratedWebsite> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const { cvData, linkedinUrl, githubUrl } = input;

    // CV verilerini düzenli bir şekilde formatla
    const cvSummary = `
İsim: ${cvData.personalInfo.name}
Email: ${cvData.personalInfo.email || "Belirtilmemiş"}
Telefon: ${cvData.personalInfo.phone || "Belirtilmemiş"}
Konum: ${cvData.personalInfo.location || "Belirtilmemiş"}
Ünvan: ${cvData.personalInfo.title || "Belirtilmemiş"}

Özet: ${cvData.summary || "Belirtilmemiş"}

İş Deneyimleri:
${cvData.experience.map((exp, idx) => `
${idx + 1}. ${exp.company} - ${exp.position}
   Süre: ${exp.duration}
   Açıklama: ${exp.description}
`).join('\n')}

Eğitim:
${cvData.education.map((edu, idx) => `
${idx + 1}. ${edu.school}
   Derece: ${edu.degree}
   Bölüm: ${edu.field}
   Yıl: ${edu.year}
`).join('\n')}

Yetenekler: ${cvData.skills.join(", ")}
Diller: ${cvData.languages.join(", ")}
`;

    const socialLinks = [];
    if (linkedinUrl) socialLinks.push(`LinkedIn: ${linkedinUrl}`);
    if (githubUrl) socialLinks.push(`GitHub: ${githubUrl}`);

    const prompt = `
Sen profesyonel bir web tasarımcısısın. Aşağıdaki CV bilgilerini kullanarak 
modern, tek sayfalık (single-page) bir kişisel web sitesi oluştur.

CV Bilgileri:
${cvSummary}

${socialLinks.length > 0 ? `Sosyal Medya Linkleri:\n${socialLinks.join('\n')}` : ''}

Gereksinimler:
1. Modern ve profesyonel görünüm
2. Responsive (mobil uyumlu) tasarım
3. Tailwind CSS kullan (CDN üzerinden dahil et)
4. Temiz, okunabilir tipografi
5. Profesyonel renk paleti (koyu veya açık tema, CV'ye uygun olanı seç)
6. Smooth scroll animasyonları
7. Font Awesome veya benzer ikon kütüphanesi kullan (CDN)

Bölümler (sırayla):
- Hero Section (isim, ünvan, kısa tanıtım, profil fotoğrafı placeholder'ı)
- Hakkımda (summary kısmı)
- İş Deneyimi (timeline formatında)
- Eğitim
- Yetenekler (skill cards veya progress bars)
- İletişim (email, telefon, sosyal medya linkleri)

Teknik Detaylar:
- Tamamen self-contained HTML (tek dosya)
- Tüm CDN linklerini ekle (Tailwind, Font Awesome)
- Meta tags ekle (SEO için)
- Favicon placeholder ekle
- Smooth scroll için JavaScript kodu ekle
- Responsive navigation menu (mobil için hamburger menu)

Önemli Kurallar:
- Tam HTML kodu üret, eksik bırakma
- Gerçek, çalışan kod yaz (placeholder değil)
- CV'deki TÜM bilgileri kullan
- Modern web standartlarına uy
- Accessibility (a11y) özelliklerine dikkat et

Çıktı formatı JSON olsun:
{
  "html": "<!DOCTYPE html>...tam HTML kodu...",
  "title": "Kişinin adı - Kişisel Web Sitesi",
  "description": "Kişinin unvanı ve kısa özeti (max 160 karakter)"
}

SADECE JSON formatında döndür, başka açıklama ekleme.
JSON'dan önce veya sonra hiçbir metin olmasın.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Gemini'nin döndürdüğü JSON'ı parse et
    let parsedResponse: GeneratedWebsite;
    
    try {
      // JSON bloğunu temizle (markdown kod bloğu varsa)
      let cleanedText = responseText.trim();
      
      // ```json veya ``` ile başlıyorsa temizle
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '');
      }
      
      parsedResponse = JSON.parse(cleanedText);
      
      // Gerekli alanların varlığını kontrol et
      if (!parsedResponse.html || !parsedResponse.title) {
        throw new Error("Generated response is missing required fields");
      }
      
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", responseText);
      throw new Error(
        `Failed to parse AI response. The AI might have returned invalid JSON. Error: ${
          parseError instanceof Error ? parseError.message : String(parseError)
        }`
      );
    }

    return parsedResponse;
    
  } catch (error) {
    console.error("Error generating website with Gemini:", error);
    
    if (error instanceof Error) {
      throw new Error(`Website generation failed: ${error.message}`);
    }
    
    throw new Error("Website generation failed due to an unknown error");
  }
}

/**
 * Mevcut bir HTML'i kullanıcı isteğine göre revize eder
 * @param currentHtml Mevcut HTML kodu
 * @param userRequest Kullanıcının revize isteği
 * @returns Revize edilmiş HTML ve yapılan değişikliklerin açıklaması
 */
export async function reviseWebsite(
  currentHtml: string,
  userRequest: string
): Promise<{ html: string; changes: string }> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Sen profesyonel bir web tasarımcısısın. Aşağıdaki HTML kodunu kullanıcının isteğine göre revize et.

Mevcut HTML:
${currentHtml}

Kullanıcının İsteği:
"${userRequest}"

Gereksinimler:
- Kullanıcının isteğini en iyi şekilde karşıla
- Responsive ve modern tasarımı koru
- Tailwind CSS kullanmaya devam et
- Tüm mevcut içeriği koru (bilgi kaybı olmasın)
- Sadece istenen değişiklikleri yap
- Kod kalitesini ve okunabilirliği koru

Çıktı formatı JSON:
{
  "html": "<!DOCTYPE html>...revize edilmiş tam HTML kodu...",
  "changes": "Yapılan değişikliklerin kısa açıklaması (Türkçe, 2-3 cümle)"
}

SADECE JSON formatında döndür, başka açıklama ekleme.
JSON'dan önce veya sonra hiçbir metin olmasın.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      let cleanedText = responseText.trim();
      
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '');
      }
      
      const parsedResponse = JSON.parse(cleanedText);
      
      if (!parsedResponse.html || !parsedResponse.changes) {
        throw new Error("Revised response is missing required fields");
      }
      
      return parsedResponse;
      
    } catch (parseError) {
      console.error("Failed to parse Gemini revision response:", responseText);
      throw new Error(
        `Failed to parse AI revision response. Error: ${
          parseError instanceof Error ? parseError.message : String(parseError)
        }`
      );
    }
    
  } catch (error) {
    console.error("Error revising website with Gemini:", error);
    
    if (error instanceof Error) {
      throw new Error(`Website revision failed: ${error.message}`);
    }
    
    throw new Error("Website revision failed due to an unknown error");
  }
}
