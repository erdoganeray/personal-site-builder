import { CVData } from "./gemini-pdf-parser";
import { ThemeColors, SelectedComponent, SiteGenerationPlan } from "@/types/templates";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gemini API'ye CV bilgilerini ve prompt'u göndererek
 * hangi component'lerin kullanılacağını ve tema renklerini belirler
 */
export async function analyzeSiteDesign(
  cvData: CVData,
  customPrompt?: string
): Promise<SiteGenerationPlan> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // CV verilerini formatla
    const cvSummary = `
İsim: ${cvData.personalInfo.name}
Email: ${cvData.personalInfo.email || "Belirtilmemiş"}
Telefon: ${cvData.personalInfo.phone || "Belirtilmemiş"}
Konum: ${cvData.personalInfo.location || "Belirtilmemiş"}
Ünvan: ${cvData.personalInfo.title || "Belirtilmemiş"}

Özet: ${cvData.summary || "Belirtilmemiş"}

İş Deneyimleri: ${cvData.experience.length} adet
Eğitim: ${cvData.education.length} adet
Yetenekler: ${cvData.skills.join(", ")}
Diller: ${cvData.languages.join(", ")}
`;

    const prompt = `
Sen profesyonel bir web tasarım danışmanısın. Aşağıdaki CV bilgilerini ve kullanıcı isteklerini analiz ederek, 
kişisel web sitesi için en uygun tasarım planını oluştur.

CV Bilgileri:
${cvSummary}

${customPrompt ? `\nKullanıcının Özel İstekleri:\n${customPrompt}\n` : ''}

Mevcut Component Template'ler:

NAVIGATION MENU:
1. nav-classic-horizontal: Klasik yatay navigasyon, mobilde hamburger menü
2. nav-minimal-centered: Minimal tasarım, logo ortada, linkler iki yanda
3. nav-sidebar-modern: Sol tarafta sabit sidebar, gradient arka plan, iconlu
4. nav-floating-dot: Sağda floating dot navigasyon, minimal

HERO SECTION:
1. hero-modern-centered: Modern, merkezi düzen, profil fotoğrafı üstte, CTA butonları
2. hero-split-screen: İki kolonlu düzen, sol taraf içerik, sağ taraf görsel

EXPERIENCE SECTION:
1. experience-timeline: Zaman çizelgesi şeklinde dikey düzen
2. experience-cards: Kart grid düzeni, modern ve tıklanabilir görünüm

EDUCATION SECTION:
1. education-timeline: Zaman çizelgesi şeklinde eğitim gösterimi, emoji ikonlu
2. education-cards: Kart grid düzeni, modern ve tıklanabilir görünüm
3. education-modern: Modern gradient tasarım, header düzeni, hover efektli

SKILLS SECTION:
1. skills-progress-bars: İlerleme çubukları ile yetenek gösterimi
2. skills-card-grid: Kart grid düzeni, ikon ve isimle yetenek gösterimi

CONTACT SECTION:
1. contact-modern-form: Modern iletişim formu ve bilgi kartları, iki kolonlu düzen
2. contact-minimal-centered: Minimal merkezi tasarım, iletişim bilgileri kartları
3. contact-split-info: Split layout, sol taraf gradient bilgi, sağ taraf form

Görevin:
1. CV'ye ve kullanıcı isteğine en uygun tema renklerini belirle (hex kodları)
2. Yukarıdaki template'lerden hangilerinin kullanılacağına karar ver
3. Her kategoriden (navigation, hero, experience, skills, contact) bir template seç
4. Genel stil anlayışını belirle (modern/minimal/creative/professional)

Renk Seçimi Kriterleri:
- Kişinin mesleğine uygun (örn: teknoloji için mavi/mor, tasarım için canlı renkler)
- Profesyonel ve okunabilir
- Kontrast oranları yeterli
- Kullanıcının özel isteklerini dikkate al

Component Seçimi Kriterleri:
- Navigation: Sayfanın genel stiline uygun (minimal site için minimal nav, creative site için sidebar)
- Hero: Kişinin deneyim seviyesi (çok deneyimli için timeline, az için cards)
- Experience: CV'deki iş deneyimi sayısına göre
- Education: CV'deki eğitim bilgisi sayısına göre (varsa mutlaka ekle)
- Skills: Yetenek sayısına ve görsel tercihine göre
- Contact: Site stiline uygun (modern site için form, minimal site için minimal-centered)
- Mesleğe uygunluk
- Kullanıcının özel isteklerini dikkate al

Çıktı formatı JSON olsun:
{
  "themeColors": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex",
    "text": "#hex",
    "textSecondary": "#hex"
  },
  "selectedComponents": [
    { "category": "navigation", "templateId": "nav-classic-horizontal" },
    { "category": "hero", "templateId": "hero-modern-centered" },
    { "category": "experience", "templateId": "experience-timeline" },
    { "category": "education", "templateId": "education-timeline" },
    { "category": "skills", "templateId": "skills-card-grid" },
    { "category": "contact", "templateId": "contact-modern-form" }
  ],
  "layout": "single-page",
  "style": "modern",
  "reasoning": "Seçimlerinizin kısa açıklaması (2-3 cümle, Türkçe)"
}

ÖNEMLİ: SADECE JSON formatında döndür, başka açıklama ekleme.
JSON'dan önce veya sonra hiçbir metin olmasın.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      // JSON bloğunu temizle
      let cleanedText = responseText.trim();
      cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/^```\s*/, '');
      cleanedText = cleanedText.replace(/\s*```$/g, '');
      cleanedText = cleanedText.trim();
      
      const parsed = JSON.parse(cleanedText);
      
      // Validasyon
      if (!parsed.themeColors || !parsed.selectedComponents) {
        throw new Error("Missing required fields in design plan");
      }

      return {
        themeColors: parsed.themeColors,
        selectedComponents: parsed.selectedComponents,
        layout: parsed.layout || 'single-page',
        style: parsed.style || 'modern'
      };
      
    } catch (parseError) {
      console.error("Failed to parse Gemini design analysis:", responseText);
      throw new Error(
        `Failed to parse AI design analysis. Error: ${
          parseError instanceof Error ? parseError.message : String(parseError)
        }`
      );
    }
    
  } catch (error) {
    console.error("Error analyzing site design:", error);
    
    if (error instanceof Error) {
      throw new Error(`Design analysis failed: ${error.message}`);
    }
    
    throw new Error("Design analysis failed due to an unknown error");
  }
}
