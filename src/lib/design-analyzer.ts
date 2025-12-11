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

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

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
Portfolio Fotoğrafları: ${cvData.portfolio?.length || 0} adet
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
3. hero-minimal-text: Minimal, büyük tipografi odaklı, profil fotoğrafı yok, typing effect animasyonu
4. hero-animated-gradient: Animasyonlu gradient background, glassmorphism efekti, floating particles

EXPERIENCE SECTION:
1. experience-timeline: Zaman çizelgesi şeklinde dikey düzen, sol tarafta çizgi ve noktalar
2. experience-cards: Kart grid düzeni, modern ve tıklanabilir görünüm, hover efektleri
3. experience-accordion: Açılır/kapanır (collapsible) liste, space-efficient, tek seferde bir deneyim açık
4. experience-minimal: Minimal liste düzeni, typography odaklı, sade ve temiz görünüm
5. experience-horizontal-timeline: Yatay akan timeline, scroll ile gezinme, modern ve dinamik
6. experience-tabs: Tab bazlı navigasyon, şirket adına göre organize, kompakt görünüm

EDUCATION SECTION:
1. education-timeline: Zaman çizelgesi şeklinde eğitim gösterimi, emoji ikonlu, sol tarafta dikey çizgi
   - 3+ eğitim varsa tercih et
   - Kronolojik sıralama önemliyse (Akademisyenler, araştırmacılar, öğretmenler)
   - Eğitim geçmişi zengin olan profiller için ideal
2. education-cards: Kart grid düzeni, modern ve tıklanabilir görünüm, hover efektleri
   - 2-4 eğitim varsa tercih et
   - Görsel vurgu önemliyse (Tasarımcılar, yaratıcı roller, pazarlamacılar)
   - Modern ve dinamik bir görünüm isteniyorsa
3. education-modern: Modern gradient tasarım, header düzeni, hover efektli, pill badge tarih
   - 1-3 eğitim varsa tercih et
   - Minimal ve profesyonel görünüm isteniyorsa (Yöneticiler, danışmanlar, C-level)
   - Premium ve şık bir tasarım tercih ediliyorsa
4. education-accordion: Accordion/katlanabilir tasarım, tıklanabilir başlıklar, detaylı içerik
   - 4+ eğitim varsa tercih et
   - Detaylı eğitim bilgisi varsa (field alanı dolu)
   - Kompakt görünüm isteniyorsa (Çok sayıda eğitim olan profiller)
5. education-horizontal-timeline: Yatay kaydırmalı timeline, scroll-snap, staggered animasyonlar
   - 3-5 eğitim varsa tercih et
   - Görsel showcase isteniyorsa (Portfolyo ağırlıklı profiller)
   - İnteraktif ve dinamik bir deneyim isteniyorsa
6. education-tabs: Tab/sekme tasarım, tıklanabilir başlıklar, katlanabilir içerik
   - 3-6 eğitim varsa tercih et
   - Organize ve düzenli görünüm isteniyorsa
   - Detaylı bilgi gösterimi gerekiyorsa

PORTFOLIO SECTION (OPTIONAL - sadece portfolio fotoğrafları varsa ekle):
1. portfolio-grid: Grid düzeninde portfolio, hover efekti, lightbox ile büyütme
2. portfolio-masonry: Masonry (pinterest tarzı) düzen, asimetrik görünüm, lightbox
3. portfolio-carousel: Carousel/slider düzeni, otomatik geçiş, ok tuşları, lightbox

SKILLS SECTION:
1. skills-progress-bars: İlerleme çubukları ile yetenek gösterimi
2. skills-card-grid: Kart grid düzeni, ikon ve isimle yetenek gösterimi

LANGUAGES SECTION (OPTIONAL - sadece diller varsa ekle):
1. languages-progress-bars: İlerleme çubukları ile dil seviyesi gösterimi
2. languages-card-grid: Kart grid düzeni, ikon ve dil seviyesi
3. languages-minimalist: Minimal liste düzeni, dil ve seviye

CONTACT SECTION:
1. contact-modern-form: Modern iletişim formu ve bilgi kartları, iki kolonlu düzen
2. contact-minimal-centered: Minimal merkezi tasarım, iletişim bilgileri kartları
3. contact-split-info: Split layout, sol taraf gradient bilgi, sağ taraf form

FOOTER SECTION:
1. footer-modern-centered: Modern merkezi düzen, grid yapısı, sosyal medya linkleri ve bağlantılar
2. footer-minimal-simple: Minimal ve sade tasarım, merkezi hizalı, temel bilgiler ve sosyal medya
3. footer-split-columns: Kolon bazlı profesyonel tasarım, detaylı bilgi ve linkler, gradient arka plan

Görevin:
1. CV'ye ve kullanıcı isteğine en uygun tema renklerini belirle (hex kodları)
2. Yukarıdaki template'lerden hangilerinin kullanılacağına karar ver
3. Her kategoriden (navigation, hero, experience, education, skills, contact, footer) bir template seç
4. Genel stil anlayışını belirle (modern/minimal/creative/professional)

Renk Seçimi Kriterleri:
- Kişinin mesleğine uygun (örn: teknoloji için mavi/mor, tasarım için canlı renkler)
- Profesyonel ve okunabilir
- Kontrast oranları yeterli
- Kullanıcının özel isteklerini dikkate al

Component Seçimi Kriterleri:
- Navigation: Sayfanın genel stiline uygun (minimal site için minimal nav, creative site için sidebar)
- Hero: Mesleğe ve CV stiline göre seç:
  * hero-modern-centered: Profesyonel/kurumsal roller (Business Analyst, Project Manager, Consultant)
  * hero-split-screen: Yaratıcı/tasarımcı roller (Designer, Photographer, Creative Director)
  * hero-minimal-text: Developer/Engineer/Writer roller (Software Engineer, Data Scientist, Content Writer) - text odaklı
  * hero-animated-gradient: Modern/tech/creative roller (UI/UX Designer, Frontend Developer, Digital Marketer) - görsel odaklı
- Experience: CV'deki iş deneyimi sayısına göre
- Education: CV'deki eğitim bilgisi sayısına göre (varsa mutlaka ekle)
- Portfolio: SADECE portfolio fotoğrafları varsa ekle (${cvData.portfolio?.length || 0} adet var). Education ve Skills arasına yerleştir. Yoksa hiç ekleme!
- Skills: Yetenek sayısına ve görsel tercihine göre
- Languages: SADECE dil bilgisi varsa ekle (${cvData.languages?.length || 0} adet var). Skills'den sonra, Contact'tan önce yerleştir. Yoksa hiç ekleme!
- Contact: Site stiline uygun (modern site için form, minimal site için minimal-centered)
- Footer: Her zaman ekle, site stiline uygun template seç
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
    // Portfolio burada (eğer fotoğraf varsa) - { "category": "portfolio", "templateId": "portfolio-grid" }
    { "category": "skills", "templateId": "skills-card-grid" },
    // Languages burada (eğer dil bilgisi varsa) - { "category": "languages", "templateId": "languages-card-grid" }
    { "category": "contact", "templateId": "contact-modern-form" },
    { "category": "footer", "templateId": "footer-modern-centered" }
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
        `Failed to parse AI design analysis. Error: ${parseError instanceof Error ? parseError.message : String(parseError)
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
