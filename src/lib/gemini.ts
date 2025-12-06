import { GoogleGenerativeAI } from "@google/generative-ai";
import { CVData } from "./gemini-pdf-parser";

export interface GeneratedWebsite {
  html: string;
  css: string;
  js: string;
  title: string;
  description: string;
}

export interface WebsiteGenerationInput {
  cvData: CVData;
  linkedinUrl?: string;
  githubUrl?: string;
  customPrompt?: string;
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

    const { cvData, linkedinUrl, githubUrl, customPrompt } = input;

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

${customPrompt ? `\nÖZEL TASARIM İSTEKLERİ:\n${customPrompt}\n\nYukarıdaki özel tasarım isteklerini DikkatLE uygula ve sitenin tasarımını bu isteklere göre şekillendir.\n` : ''}

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
- HTML, CSS ve JavaScript'i AYRI AYRI dosyalar olarak üret
- HTML: Sadece yapı ve içerik, inline style veya script KULLANMA
- CSS: Tüm stil kuralları ayrı dosyada, Tailwind CDN kullanma (kendi CSS yaz)
- JavaScript: Tüm interaktif özellikler ayrı dosyada
- Meta tags ekle (SEO için)
- Favicon placeholder ekle
- Responsive navigation menu (mobil için hamburger menu)

HTML Dosyasında:
- <link rel="stylesheet" href="styles.css"> ile CSS'i dahil et
- <script src="script.js"></script> ile JS'i dahil et
- Inline style veya script kullanma

CSS Dosyasında:
- Modern, profesyonel stil kuralları
- Responsive tasarım (media queries)
- Smooth transitions ve animations
- Temiz, organize edilmiş CSS

JavaScript Dosyasında:
- Smooth scroll
- Hamburger menu toggle
- Scroll animasyonları
- Diğer interaktif özellikler

Önemli Kurallar:
- Tam kod üret, eksik bırakma
- Gerçek, çalışan kod yaz (placeholder değil)
- CV'deki TÜM bilgileri kullan
- Modern web standartlarına uy
- Accessibility (a11y) özelliklerine dikkat et

Çıktı formatı JSON olsun:
{
  "html": "<!DOCTYPE html>...tam HTML kodu (sadece yapı, stil ve script yok)...",
  "css": "/* Tüm CSS kodları */",
  "js": "// Tüm JavaScript kodları",
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
      
      // ```json veya ``` ile başlıyorsa temizle (regex ile daha güvenli)
      cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/^```\s*/, '');
      cleanedText = cleanedText.replace(/\s*```$/g, '');
      cleanedText = cleanedText.trim();
      
      parsedResponse = JSON.parse(cleanedText);
      
      // Gerekli alanların varlığını kontrol et
      if (!parsedResponse.html || !parsedResponse.css || !parsedResponse.js) {
        throw new Error("Generated response is missing required fields (html, css, or js)");
      }
      
      // title yoksa HTML'den çıkar veya default kullan
      if (!parsedResponse.title) {
        const titleMatch = parsedResponse.html.match(/<title>(.*?)<\/title>/i);
        parsedResponse.title = titleMatch ? titleMatch[1] : "Personal Website";
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
 * Mevcut bir site'i kullanıcı isteğine göre revize eder
 * @param currentHtml Mevcut HTML kodu
 * @param currentCss Mevcut CSS kodu
 * @param currentJs Mevcut JS kodu
 * @param userRequest Kullanıcının revize isteği
 * @returns Revize edilmiş HTML, CSS, JS ve yapılan değişikliklerin açıklaması
 */
export async function reviseWebsite(
  currentHtml: string,
  currentCss: string,
  currentJs: string,
  userRequest: string
): Promise<{ html: string; css: string; js: string; changes: string }> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Sen profesyonel bir web tasarımcısısın. Aşağıdaki HTML, CSS ve JavaScript kodlarını kullanıcının isteğine göre revize et.

Mevcut HTML:
${currentHtml}

Mevcut CSS:
${currentCss}

Mevcut JavaScript:
${currentJs}

Kullanıcının İsteği:
"${userRequest}"

Gereksinimler:
- Kullanıcının isteğini en iyi şekilde karşıla
- Responsive ve modern tasarımı koru
- HTML, CSS ve JS'i AYRI AYRI dosyalar olarak döndür
- Tüm mevcut içeriği koru (bilgi kaybı olmasın)
- Sadece istenen değişiklikleri yap
- Kod kalitesini ve okunabilirliği koru

ÖNEMLİ: JSON içinde newline karakterlerini \\n olarak, tırnak işaretlerini \\" olarak, backslash'leri \\\\ olarak escape et.

Çıktı formatı (GEÇERLİ JSON):
{
  "html": "<!DOCTYPE html>...",
  "css": "/* CSS */",
  "js": "// JS",
  "changes": "Yapılan değişikliklerin Türkçe açıklaması (2-3 cümle)"
}

SADECE JSON formatında döndür, başka açıklama ekleme.
JSON'dan önce veya sonra hiçbir metin olmasın.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      // JSON bloğunu temizle (regex ile daha güvenli)
      let cleanedText = responseText.trim();
      
      cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/^```\s*/, '');
      cleanedText = cleanedText.replace(/\s*```$/g, '');
      cleanedText = cleanedText.trim();
      
      // JSON5 veya relaxed JSON parsing kullanarak escape sorunlarını çöz
      let parsed;
      try {
        parsed = JSON.parse(cleanedText);
      } catch (strictParseError) {
        console.warn("Strict JSON parse failed, trying manual extraction...");
        
        // Manuel olarak html, css, js ve changes'i ayıkla
        const htmlMatch = cleanedText.match(/"html"\s*:\s*"((?:[^"\\]|\\.)*)"/s);
        const cssMatch = cleanedText.match(/"css"\s*:\s*"((?:[^"\\]|\\.)*)"/s);
        const jsMatch = cleanedText.match(/"js"\s*:\s*"((?:[^"\\]|\\.)*)"/s);
        const changesMatch = cleanedText.match(/"changes"\s*:\s*"([^"]*)"/);
        
        if (!htmlMatch || !cssMatch || !jsMatch || !changesMatch) {
          // Son çare: Gemini'yi tekrar çağır ama sadece changes'i iste
          console.error("Could not extract content from malformed JSON");
          throw strictParseError;
        }
        
        parsed = {
          html: htmlMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\'),
          css: cssMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\'),
          js: jsMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\'),
          changes: changesMatch[1]
        };
      }
      
      if (!parsed.html || !parsed.css || !parsed.js || !parsed.changes) {
        throw new Error("Revised response is missing required fields (html, css, js, or changes)");
      }
      
      return {
        html: parsed.html,
        css: parsed.css,
        js: parsed.js,
        changes: parsed.changes
      };
      
    } catch (parseError) {
      console.error("Failed to parse Gemini revision response:", responseText.substring(0, 500) + "...");
      
      // Kullanıcıya daha anlamlı hata mesajı
      throw new Error(
        "Revize işlemi sırasında bir sorun oluştu. Lütfen talebinizi daha basit kelimelerle tekrar deneyin."
      );
    }
    
  } catch (error) {
    console.error("Error revising website with Gemini:", error);
    
    if (error instanceof Error && error.message.includes("Revize işlemi sırasında")) {
      throw error; // Kullanıcı dostu mesajı olduğu gibi ilet
    }
    
    // Diğer hatalar için genel mesaj
    throw new Error("Revize işlemi tamamlanamadı. Lütfen daha basit bir değişiklik talebi ile tekrar deneyin.");
  }
}
