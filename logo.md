# 🎨 Marka Görselleri ve Logo Gereksinimleri

Bu dokümantasyon, personal-site-builder projesi için gerekli olan tüm görsel varlıkları ve boyutlarını içerir.

## 📐 Logo Boyutları

### Ana Logo
- **Full Logo (yatay)**: 2000x600px (PNG, SVG)
- **Square Logo**: 1000x1000px (sosyal medya için)
- **Favicon**: 512x512px, 192x192px, 32x32px, 16x16px
- **App Icon**: 180x180px (Apple Touch Icon)

### Logo Varyasyonları
- Açık tema için (koyu logo)
- Koyu tema için (açık logo)
- Monokrom versiyon
- Icon-only versiyon (sadece simge, yazısız)

## 🎨 Web Sitesi Görselleri

### Landing Page
- **Hero Image/Illustration**: 1920x1080px
- **Feature Icons**: 256x256px (her özellik için)
- **Screenshot/Mockup**: 1440x900px (ürün ekran görüntüleri)
- **Before/After Örnekleri**: 1200x800px

### Dashboard
- **Empty State Illustrations**: 400x300px (henüz CV yüklenmediğinde)
- **Success/Error Illustrations**: 300x300px
- **Loading Animations**: 200x200px (Lottie/GIF)

## 📱 Sosyal Medya

### Open Graph (Link Paylaşım)
- **OG Image**: 1200x630px (Facebook, LinkedIn, Twitter)
- **Twitter Card**: 1200x675px

### Profil Görselleri
- **Twitter/X Header**: 1500x500px
- **Facebook Cover**: 820x312px
- **LinkedIn Cover**: 1584x396px
- **Profile Picture**: 400x400px (tüm platformlar için)

### İçerik Görselleri
- **Instagram Post**: 1080x1080px
- **Instagram Story**: 1080x1920px
- **LinkedIn Post**: 1200x627px

## 📧 E-posta ve Dokümantasyon

- **Email Header**: 600x200px
- **Email Icons**: 64x64px
- **Tutorial/Help Images**: 800x600px

## 🎯 Özel Sayfalar

### Marketing
- **Pricing Table Icons**: 128x128px
- **Testimonial Avatars**: 200x200px (placeholder)
- **Partner Logos**: 200x80px
- **Trust Badges**: 150x150px

### Blog
- **Featured Image**: 1200x630px
- **Thumbnail**: 600x400px

## 💡 Önerilen Görsel İçerikleri

### İkonografi
- CV yükleme ikonu
- AI/robot simgesi (site oluşturma)
- Önizleme/göz ikonu
- Yayınlama/roket ikonu
- Revize/kalem ikonu
- Cloudflare logosu (eğer partnership varsa)

### Illustrasyonlar
- Kullanıcı CV yüklerken
- AI site oluştururken (animasyon)
- Site yayınlanma başarı ekranı
- Error states (404, 500)
- Boş dashboard durumu

### Animasyonlar (Lottie)
- Loading spinner (site oluşturma)
- Success checkmark
- Upload progress
- Deploy progress

## 🛠️ Tasarım Araçları Önerileri

### Logo ve Branding
- **Logo Tasarım**: Figma, Adobe Illustrator
- **Favicon Generator**: RealFaviconGenerator.net, Favicon.io

### Görseller ve İllüstrasyonlar
- **Illustrasyonlar**: 
  - Undraw.co (ücretsiz, özelleştirilebilir)
  - Storyset.com (ücretsiz, Freepik'ten)
  - Blush.design (ücretsiz + premium)
- **İkonlar**: 
  - Lucide Icons
  - Heroicons
  - Font Awesome
  - Iconify
- **Mockup'lar**: 
  - Figma
  - Mockuuups.studio
  - Smartmockups

### Animasyonlar
- **Lottie Animasyonlar**: LottieFiles.com
- **GIF/Video**: Adobe After Effects, Figma Motion

## 📦 Dosya Formatları

### Web İçin
- **PNG**: Transparency gerektiğinde (logo, ikonlar)
- **WebP**: Optimize edilmiş görseller (daha küçük boyut)
- **SVG**: Scalable görseller (logo, ikonlar, illustrasyonlar)
- **ICO**: Favicon için

### Print İçin
- **PDF**: Yüksek çözünürlük
- **EPS**: Vector format

### Animasyon
- **Lottie JSON**: Web animasyonları (hafif, scalable)
- **GIF**: Fallback animasyonlar (daha büyük boyut)

## 🗂️ Önerilen Klasör Yapısı

```
public/
├── logo/
│   ├── full-logo-light.svg
│   ├── full-logo-dark.svg
│   ├── icon-only.svg
│   ├── logo-square.png
│   └── monochrome.svg
├── favicon/
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   └── android-chrome-512x512.png
├── og/
│   ├── og-image.png
│   └── twitter-card.png
├── icons/
│   ├── cv-upload.svg
│   ├── ai-generate.svg
│   ├── preview.svg
│   ├── publish.svg
│   └── revise.svg
├── illustrations/
│   ├── hero.svg
│   ├── empty-state.svg
│   ├── success.svg
│   └── error.svg
└── animations/
    ├── loading.json
    ├── success.json
    └── deploy.json
```

## 🎯 MVP için Öncelikli Görseller

İlk aşamada sadece bunlara odaklanın:

### Kritik (Hemen Gerekli)
1. ✅ **Logo** (3 varyasyon: full-light, full-dark, icon-only)
2. ✅ **Favicon** (512x512px, 32x32px, 16x16px)
3. ✅ **OG Image** (1200x630px) - Sosyal medya paylaşımları için

### Önemli (İlk Hafta)
4. ⭐ **Feature Icons** (4-5 adet: upload, generate, preview, publish)
5. ⭐ **Loading Animation** (Lottie JSON)
6. ⭐ **Empty State Illustration** (dashboard için)

### Sonra Eklenebilir
7. Hero illustration
8. Success/Error illustrations
9. Sosyal medya cover görselleri
10. Marketing materials

## 🎨 Renk Paleti Önerileri

Logo ve marka tasarımı için renk paletinizi belirleyin:

### Örnek Paletler (AI/Tech Temalı)

**Paket 1: Modern Profesyonel**
- Primary: #3B82F6 (Blue)
- Secondary: #8B5CF6 (Purple)
- Accent: #10B981 (Green)
- Background: #F9FAFB (Light Gray)
- Text: #1F2937 (Dark Gray)

**Paket 2: Warm & Creative**
- Primary: #F59E0B (Orange)
- Secondary: #EC4899 (Pink)
- Accent: #6366F1 (Indigo)
- Background: #FFFBEB (Warm White)
- Text: #292524 (Brown-Gray)

**Paket 3: Minimal & Clean**
- Primary: #0EA5E9 (Sky Blue)
- Secondary: #64748B (Slate)
- Accent: #14B8A6 (Teal)
- Background: #FFFFFF (White)
- Text: #0F172A (Almost Black)

## 📝 Logo Tasarım Briefingi

Logo tasarımcısına vermeniz gereken bilgiler:

- **Proje Adı**: Personal Site Builder (veya seçeceğiniz isim)
- **Slogan**: "AI ile Dakikalar İçinde Kişisel Web Siteniz"
- **Hedef Kitle**: Profesyoneller, freelancerlar, iş arayanlar
- **Marka Kişiliği**: Modern, teknolojik, güvenilir, basit, kullanıcı dostu
- **Stil**: Minimal, geometrik, clean
- **İkonografi**: AI, web, belge/CV, hızlılık temalı
- **Çıkarılabilir İkon**: Evet (square version için)
- **Renk**: 2-3 renk (vibrant ama profesyonel)

## ✅ Kontrol Listesi

Launch öncesi tüm görsellerin hazır olduğundan emin olun:

### Logo & Branding
- [ ] Full logo (light mode)
- [ ] Full logo (dark mode)
- [ ] Icon-only logo
- [ ] Favicon set (tüm boyutlar)
- [ ] Apple touch icon

### Web Assets
- [ ] OG image
- [ ] Feature icons (minimum 4)
- [ ] Loading animation
- [ ] Empty state illustration

### Optional (Nice to Have)
- [ ] Hero illustration
- [ ] Success illustration
- [ ] Error illustration
- [ ] Email header
- [ ] Social media covers

---

**Not**: Başlangıç için sadece logo, favicon ve OG image'a odaklanın. Diğer görseller geliştirme sürecinde eklenebilir. İllüstrasyonlar için Undraw.co gibi ücretsiz kaynakları kullanabilirsiniz.
