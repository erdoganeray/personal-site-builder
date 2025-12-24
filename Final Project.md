# TECHNICAL DESIGN DOCUMENT: AGENT-DRIVEN WEB CONSTRUCTION PLATFORM (ADWCP)

**Sürüm:** 2.4 (Revize: Atomic Design & Component Variants) 
**Mimari Yaklaşım:** Invisible Modularity & Generative UX 
**Temel Prensip:** "User as Director, AI as Developer" (Kullanıcı Yönetmen, AI Geliştirici)

## 1. YÖNETİCİ ÖZETİ (EXECUTIVE SUMMARY)

Mevcut web sitesi oluşturucuları (Wix, WordPress), kullanıcıdan tasarım ve teknik entegrasyon kararları almasını bekleyerek yüksek bilişsel yük (cognitive load) yaratmaktadır. Öte yandan, tamamen AI tabanlı araçlar ise birbirinin kopyası ve düzenlemesi zor çıktılar üretmektedir.

ADWCP, küçük işletmeler (KOBİ) ve kişisel markalar (Freelancer/Portfolyo) için **"Hibrit"** bir çözüm sunar. Altyapıda **"Template-First" (Önce Şablon)** stratejisi ile yüksek kaliteli Next.js şablonları kullanılırken; ön yüzde **"Agentic Workflow"** ile bu şablonlar kullanıcının verisiyle (Content Injection) akıllıca doldurulur. Hizmet sektörü için randevu/form altyapısı sunarken, yaratıcı profesyoneller için görsel odaklı portfolyo araçları sağlar.

## 2. KULLANICI AKIŞI VE DENEYİM TASARIMI (UX FLOW)

Sistem, "Minimum Efor" kuralına sadık kalarak 4 aşamalı bir yaşam döngüsü sunar:

### 2.1. Faz 1: The "Brief" (Akıllı Veri Toplama & Doğrulama)

*   **Arayüz:** Minimalist giriş (Chat UI), ancak gerektiğinde "Form UI" bileşenleri ile zenginleşebilen hibrit yapı.
*   **Clarification Loop (Netleştirme Döngüsü):** Kullanıcı "Bana site yap" gibi eksik bir veriyle gelirse, sistem körü körüne tahmin yürütmez. Eksik parçaları (Sektör, Hedef Kitle, İletişim Bilgisi) tamamlamak için dinamik sorular sorar. (Örn: "Sizi daha iyi tanımam için LinkedIn profilinizi veya Instagram adresinizi paylaşabilir misiniz?")
*   **Research Agent & Confidence Score:** Dış kaynak taraması (Scraping) sırasında bulunan veriler bir "Güven Skoru" ile etiketlenir.
    *   *Yüksek Güven (>%90):* Otomatik doldurur.
    *   *Düşük Güven (<%90):* Kullanıcıya "Sizi LinkedIn'de buldum, bu profil size mi ait?" diye teyit ettirir (Verification Step). Asla emin olmadığı veriyle işlem yapmaz.
*   **Data Review (Son Kontrol):** "Proposal" aşamasına geçmeden önce, sistem anladığı her şeyi (Ad, Meslek, Veriler) özet bir kartta sunar ve kullanıcıdan "Onay" alır. Yanlış veri girişi burada engellenir.

### 2.2. Faz 2: The "Proposal" (Akıllı Şablon Seçimi)

*   **Arayüz:** Yan yana (A/B) karşılaştırmalı sunum.
*   **Süreç:** Orchestrator, toplanan verilere ve sektöre (Örn: Creative/Portfolio veya Business/Service) en uygun 2 **"Smart Template"**'i seçer.
*   **Kullanıcı Eylemi:** Tek tıkla seçim yapar.

### 2.3. Faz 3: The "Director Mode" (Hybrid UI - Revizyon)

Sohbetin esnekliği ile görsel kontrollerin hızını birleştirir.

*   **Chat (Makro Değişiklikler):** Büyük ve yapısal değişiklikler için kullanılır. (Örn: "Buraya bir zaman tüneli ekleyelim.")
*   **Direct Controls (Mikro Değişiklikler):** İnce ayarlar için AI beklenmez (Görsel değiştirme, Renk seçimi).

### 2.4. Faz 4: Publishing & Cockpit (Yayınlama & Yönetim)

Kullanıcının platforma bağlı kalmasını (Retention) sağlayan iki katmanlı yönetim yapısıdır.

1.  **Deployment (Yayınlama):**
    *   **Subdomain (Ücretsiz):** `ahmet-tasarim.adwcp.site`.
    *   **Unified Billing & Domain Reselling:** Kullanıcı platform üzerinden domain satın alabilir. Ödeme tek faturada toplanır, DNS ayarları otomatik yapılır, ancak domainin **yasal sahibi (Registrant)** kullanıcıdır ve istediği zaman transfer edebilir. (Reseller API).
2.  **The Cockpit (Admin Dashboard):**
    *   **Unified Inbox:** İletişim formları ve teklif talepleri.
    *   **Smart CRM:** Site etkileşimlerinden otomatik beslenen müşteri/proje veritabanı.
    *   **Analytics:** Trafik ve proje görüntülenme verileri.

## 3. TEKNİK MİMARİ VE SİSTEM BİLEŞENLERİ (INVISIBLE LOGIC)

Sistem, sıfırdan kod üretmek yerine, önceden hazırlanmış yüksek kaliteli bileşenleri (Nodes) yapılandırır.

### 3.1. Core Engine: The Orchestrator (Şablon Yöneticisi)

Sistemin beynidir. LLM‘in görevi kod yazmak değil, **JSON Konfigürasyonu** üretmektir.

*   **Translator:** Doğal dili (Prompt) -> JSON Config'e dönüştürür.
*   **Content Injector:** Toplanan verileri şablonun ilgili alanlarına enjekte eder.
*   **Style Mixer (YENİ):** Kullanıcının sektörüne göre modül varyasyonlarını karıştırır (Örn: Hero_v2 + Gallery_v1).

### 3.2. Component Library (Smart Templates & Nodes)

Her modül, "Design System" kurallarına uyar ve **en az 3 farklı görsel varyasyona (Variant)** sahiptir.

| Kategori | Modül Adı | İşlevi | Varyasyonlar (Örnek) |
| :--- | :--- | :--- | :--- |
| **Structure** | NodeHero | Ana Vitrin | v1: Center, v2: Split, v3: Video BG |
| **Structure** | NodeNav , NodeFooter | İskelet | v1: Minimal, v2: MegaMenu, v3: Sidebar |
| **Content** | NodeGallery | Görsel Alanları | v1: Masonry, v2: Grid, v3: Carousel |
| **Content** | NodeAbout , NodeServices | Metin Blokları | v1: List, v2: Cards, v3: ZigZag |
| **Portfolio** | NodeTimeline | Deneyim Akışı | v1: Vertical, v2: Horizontal |
| **Portfolio** | NodeTechStack | Araçlar | v1: Marquee, v2: Grid |
| **Portfolio** | NodeBeforeAfter | Karşılaştırma | v1: Slider, v2: Fade |
| **Portfolio** | NodeProjectDetail | Vaka Analizi | v1: Case Study, v2: Full Visual |
| **Blog** | NodeBlogList | CMS | v1: Classic, v2: Card Grid |
| **Conversion** | NodeBooking | Randevu | v1: Embedded, v2: Modal |
| **Conversion** | NodeForm , NodePricing | Formlar | v1: Simple, v2: Multi-step |
| **Utility** | NodeMultiLang , NodeAnalytics | Araçlar | - |
| **Admin UI** | WidgetCRM , WidgetInbox | Dashboard | - |

### 3.3. The Node Contract (Modül Sözleşmesi - JSON Şeması)

Modüllerin birbirine hatasız bağlanmasını sağlayan standart yapı.

```json
{
  "node_id": "hero_01",
  "type": "structure_hero",
  "variant": "v2_split_screen",
  "config": {
    "image_position": "right",
    "theme_override": null
  },
  "content": {
    "title": "...",
    "cta_text": "..."
  }
}
```

### 3.10. CRM Architecture (Müşteri İlişkileri Mimarisi)

CRM modülü, manuel veri girişini ortadan kaldırmak üzerine kuruludur ("Zero-Entry").

*   **Data Aggregation:** Form ve randevu talepleri otomatik olarak `Contacts` tablosuna işlenir.
*   **AI Enrichment:** Gelen mesajlar NLP ile analiz edilir, etiketlenir (Örn: "Freelance İş", "Tam Zamanlı Teklif").

### 3.11. Theming Engine (Tema Motoru - YENİ)

"Bütün siteler aynı görünüyor" sorununu çözen katmandır.

*   **Design Tokens:** Renkler, fontlar, boşluklar ve köşe yuvarlaklıkları `globals.css` içinde CSS değişkenleri olarak tutulur.
*   **Themes (Presetler):** Sistemde önceden tanımlı tema paketleri bulunur.
    *   *Clinic:* Blue/White, Sans-serif, Sharp.
    *   *Artisan:* Earth/Beige, Serif, Rounded.
    *   *Tech:* Dark/Neon, Mono, Sharp.
*   **Bukalemun Prensibi:** `NodeBooking` modülü kendi rengine sahip değildir. `var(--primary-color)` kullanır. Böylece tema değişince o da değişir.

### 3.12. Security & Abuse Prevention (Güvenlik ve Kötüye Kullanım Önleme)

SaaS projelerinde kritik olan "Reputation" ve "Cost" risklerini yöneten katmandır.

*   **Sandbox Domain Stratejisi:** Ücretsiz siteler (Subdomains) ana ticari domainden (`adwcp.site`) izole edilmiş ikincil bir domainde (`adwcp-users.com`) barındırılır. Olası bir banlanma durumunda ana sistem etkilenmez.
*   **AI Content Moderation:** Yayınlanmadan önce içerik GPT tarafından taranır. "Phishing" şüphesi (Banka, Login, Şifre vb.) veya yasadışı içerik tespit edilirse site yayına alınmaz, incelemeye düşer.
*   **Spam & Cost Control:** Bot saldırılarını önlemek için Cloudflare Turnstile (Smart Captcha) ve IP bazlı Rate Limiting uygulanır.
*   **Legal:** Kullanıcı sözleşmeleri (ToS) yasal sorumluluğu kullanıcıya yıksa da, teknik önlemler (Sandbox) önceliklidir.

## 4. TEKNOLOJİ YIĞINI (TECH STACK ÖNERİSİ)

*   **Frontend:** Next.js (App Router) + Framer Motion.
*   **UI Components:** Tailwind CSS + Shadcn/UI (Base) + Custom Variants.
*   **Backend / API:** Python (FastAPI).
*   **AI Orchestration:** GPT-4o (Orchestrator).
*   **Database:** Supabase (PostgreSQL + Vector).
*   **Domain API:** Namecheap API.
*   **Infrastructure:** Vercel.

## 6. GELİŞTİRME YOL HARİTASI (MVP)

1.  **Faz 1 (Design System & Templates):**
    *   Tema motorunun (Theming Engine) kurulması.
    *   Temel modüllerin 3'er varyasyonunun kodlanması.
2.  **Faz 2 (Injection Logic):** Orchestrator.
3.  **Faz 3 (Hybrid UI):** Preview.
4.  **Faz 4 (Platform):** Dashboard, CRM ve Domain.
