# 🎨 Template Oluşturma Rehberi

Bu rehber, CV-to-Website projeniz için yeni component template'leri nasıl oluşturacağınızı adım adım açıklar.

---

## 📋 İçindekiler

1. [Template Yapısı](#template-yapısı)
2. [Adım Adım Template Oluşturma](#adım-adım-template-oluşturma)
3. [Dikkat Edilmesi Gerekenler](#dikkat-edilmesi-gerekenler)
4. [Placeholder Sistemi](#placeholder-sistemi)
5. [Renk Sistemi](#renk-sistemi)
6. [Best Practices](#best-practices)
7. [Örnekler](#örnekler)
8. [Test ve Doğrulama](#test-ve-doğrulama)

---

## 🏗️ Template Yapısı

Her template aşağıdaki yapıya sahip olmalıdır:

```typescript
export const templateName: ComponentTemplate = {
  id: string,              // Benzersiz ID (kebab-case)
  name: string,            // İnsan okunabilir isim
  category: string,        // Component kategorisi
  htmlTemplate: string,    // HTML yapısı
  cssTemplate: string,     // CSS stilleri
  jsTemplate?: string,     // (Opsiyonel) JavaScript kodu
  placeholders?: string[], // Kullanılan placeholder'lar
  designNotes?: string     // (Opsiyonel) Tasarım notları
};
```

### Mevcut Kategoriler

- `navigation` - Navigasyon menüleri
- `hero` - Ana başlık/karşılama bölümü
- `about` - Hakkımda bölümü
- `experience` - İş deneyimleri
- `education` - Eğitim bilgileri
- `portfolio` - Portfolyo/projeler
- `skills` - Yetenekler
- `languages` - Diller
- `contact` - İletişim formu/bilgileri
- `footer` - Alt bilgi

---

## 🚀 Adım Adım Template Oluşturma

### Adım 1: Dosyayı Belirle

Template'i ilgili kategorinin dosyasına ekleyin:

```
src/components/site-templates/
├── hero-templates.ts
├── experience-templates.ts
├── education-templates.ts
├── skills-templates.ts
├── languages-templates.ts
├── portfolio-templates.ts
├── navigation-templates.ts
├── contact-templates.ts
└── footer-templates.ts
```

### Adım 2: Template ID ve İsim Belirle

```typescript
export const heroTemplate3: ComponentTemplate = {
  id: "hero-glassmorphic-modern",  // Benzersiz, açıklayıcı, kebab-case
  name: "Glassmorphic Modern Hero", // Kullanıcı dostu isim
  category: "hero",
  // ...
};
```

**ID Naming Convention:**
- Format: `{category}-{style}-{variant}`
- Örnekler:
  - `hero-glassmorphic-modern`
  - `experience-timeline-vertical`
  - `skills-grid-animated`
  - `contact-form-minimal`

### Adım 3: HTML Template Oluştur

```typescript
htmlTemplate: `
  <section id="hero" class="hero-glass">
    <div class="hero-glass-container">
      <div class="hero-glass-content">
        <h1 class="hero-glass-name">{{NAME}}</h1>
        <p class="hero-glass-title">{{TITLE}}</p>
        <p class="hero-glass-summary">{{SUMMARY}}</p>
        <div class="hero-glass-cta">
          <a href="#contact" class="btn-glass-primary">İletişime Geç</a>
        </div>
      </div>
    </div>
  </section>
`,
```

**HTML Kuralları:**
- ✅ Semantic HTML kullanın (`<section>`, `<article>`, `<nav>`, vb.)
- ✅ Her template benzersiz class isimleri kullanmalı (çakışmayı önlemek için)
- ✅ Placeholder'ları `{{PLACEHOLDER_NAME}}` formatında kullanın
- ✅ Accessibility için ARIA attributes ekleyin
- ✅ ID'ler anchor link'ler için önemli (`id="hero"`, `id="contact"`)

### Adım 4: CSS Template Oluştur

```typescript
cssTemplate: `
  /* Google Fonts import (gerekirse) */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  
  .hero-glass {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_SECONDARY}});
    font-family: 'Inter', sans-serif;
  }
  
  .hero-glass-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .hero-glass-name {
    font-size: clamp(2rem, 5vw, 4rem); /* Responsive font size */
    color: {{COLOR_TEXT}};
    margin-bottom: 1rem;
  }
  
  /* Hover effects */
  .btn-glass-primary {
    background: {{COLOR_ACCENT}};
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    transition: transform 0.3s ease;
  }
  
  .btn-glass-primary:hover {
    transform: translateY(-2px);
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .hero-glass-container {
      padding: 1rem;
    }
  }
  
  /* Accessibility - Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`,
```

**CSS Kuralları:**
- ✅ Renk placeholder'larını kullanın (`{{COLOR_PRIMARY}}`, vb.)
- ✅ `clamp()` ile responsive tipografi kullanın
- ✅ Mobile-first yaklaşım (base styles mobile, media queries desktop)
- ✅ Hover/focus states ekleyin
- ✅ Accessibility için `prefers-reduced-motion` ekleyin
- ✅ Class isimleri template'e özel olmalı (çakışmayı önlemek için)

### Adım 5: JavaScript Template Ekle (Opsiyonel)

```typescript
jsTemplate: `
  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
  
  // Counter animation
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    let count = 0;
    const increment = target / 50;
    
    const updateCounter = () => {
      count += increment;
      if (count < target) {
        counter.textContent = Math.ceil(count);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    updateCounter();
  });
`,
```

**JavaScript Kuralları:**
- ✅ Vanilla JavaScript kullanın (framework yok)
- ✅ Modern ES6+ syntax kullanın
- ✅ Event listener'ları ekleyin
- ✅ Animasyonlar için `requestAnimationFrame` kullanın
- ✅ Error handling ekleyin
- ❌ Global scope'u kirletmeyin
- ❌ Dış kütüphane gerektirmeyin (jQuery, vb.)

### Adım 6: Placeholders Listesi

```typescript
placeholders: [
  // Kullanıcı bilgileri
  "{{NAME}}",
  "{{TITLE}}",
  "{{SUMMARY}}",
  "{{EMAIL}}",
  "{{PHONE}}",
  "{{LOCATION}}",
  "{{PROFILE_IMAGE}}",
  
  // Renk sistemi
  "{{COLOR_PRIMARY}}",
  "{{COLOR_SECONDARY}}",
  "{{COLOR_ACCENT}}",
  "{{COLOR_BACKGROUND}}",
  "{{COLOR_TEXT}}",
  "{{COLOR_TEXT_SECONDARY}}",
  
  // Dinamik içerik
  "{{EXPERIENCE_ITEMS}}",
  "{{EDUCATION_ITEMS}}",
  "{{SKILL_ITEMS}}",
  "{{PORTFOLIO_ITEMS}}",
  "{{SOCIAL_LINKS}}"
]
```

### Adım 7: Design Notes Ekle (Opsiyonel)

```typescript
designNotes: "Modern glassmorphic design with animated gradient background. Perfect for creative professionals and developers. Features typing animation, counter animations, and smooth scroll interactions."
```

### Adım 8: Template'i Export Et

```typescript
// Dosyanın sonunda
export const heroTemplates = [
  heroTemplate1, 
  heroTemplate2,
  heroTemplate3  // Yeni template'inizi ekleyin
];
```

---

## ⚠️ Dikkat Edilmesi Gerekenler

### 🔴 Kritik Hatalar

1. **CSS Class Çakışması**
   ```typescript
   // ❌ YANLIŞ - Generic class isimleri
   .container { ... }
   .button { ... }
   
   // ✅ DOĞRU - Template'e özel class isimleri
   .hero-glass-container { ... }
   .hero-glass-button { ... }
   ```

2. **Placeholder Formatı**
   ```typescript
   // ❌ YANLIŞ
   {NAME}
   $NAME$
   %NAME%
   
   // ✅ DOĞRU
   {{NAME}}
   ```

3. **Renk Değerleri**
   ```typescript
   // ❌ YANLIŞ - Hard-coded renkler
   background: #3b82f6;
   
   // ✅ DOĞRU - Placeholder kullan
   background: {{COLOR_PRIMARY}};
   ```

4. **Responsive Tasarım**
   ```typescript
   // ❌ YANLIŞ - Sabit değerler
   font-size: 48px;
   
   // ✅ DOĞRU - Responsive değerler
   font-size: clamp(2rem, 5vw, 4rem);
   ```

### 🟡 Önemli Noktalar

1. **Semantic HTML Kullanımı**
   - `<section>` bölümler için
   - `<article>` bağımsız içerik için
   - `<nav>` navigasyon için
   - `<header>`, `<footer>` uygun yerlerde

2. **Accessibility**
   - ARIA labels ekleyin
   - Alt text'ler kullanın
   - Keyboard navigation destekleyin
   - Focus states ekleyin
   - Color contrast'a dikkat edin

3. **Performance**
   - Lazy loading kullanın
   - CSS animations GPU-accelerated olmalı (`transform`, `opacity`)
   - Gereksiz reflow/repaint'ten kaçının
   - Image optimization

---

## 🎯 Placeholder Sistemi

### Kullanıcı Bilgileri

| Placeholder | Açıklama | Örnek |
|------------|----------|-------|
| `{{NAME}}` | Tam isim | "Eray Erdoğan" |
| `{{TITLE}}` | Meslek/Ünvan | "Full Stack Developer" |
| `{{SUMMARY}}` | Kısa özet | "Passionate developer..." |
| `{{EMAIL}}` | E-posta | "eray@example.com" |
| `{{PHONE}}` | Telefon | "+90 555 123 4567" |
| `{{LOCATION}}` | Konum | "İstanbul, Türkiye" |
| `{{PROFILE_IMAGE}}` | Profil resmi | `<img>` tag veya URL |

### Dinamik İçerik

| Placeholder | Açıklama | Kullanım |
|------------|----------|----------|
| `{{EXPERIENCE_ITEMS}}` | İş deneyimleri listesi | Experience template'lerinde |
| `{{EDUCATION_ITEMS}}` | Eğitim listesi | Education template'lerinde |
| `{{SKILL_ITEMS}}` | Yetenek listesi | Skills template'lerinde |
| `{{LANGUAGE_ITEMS}}` | Dil listesi | Languages template'lerinde |
| `{{PORTFOLIO_ITEMS}}` | Proje listesi | Portfolio template'lerinde |
| `{{SOCIAL_LINKS}}` | Sosyal medya linkleri | Hero, Contact, Footer'da |

### Renk Sistemi

| Placeholder | Kullanım Alanı |
|------------|----------------|
| `{{COLOR_PRIMARY}}` | Ana marka rengi, başlıklar |
| `{{COLOR_SECONDARY}}` | İkincil renk, arka planlar |
| `{{COLOR_ACCENT}}` | Vurgu rengi, butonlar, linkler |
| `{{COLOR_BACKGROUND}}` | Sayfa arka planı |
| `{{COLOR_TEXT}}` | Ana metin rengi |
| `{{COLOR_TEXT_SECONDARY}}` | İkincil metin rengi (açıklama, tarih, vb.) |

---

## 🎨 Renk Sistemi

### Renk Kullanım Örnekleri

```css
/* Ana başlık */
.hero-title {
  color: {{COLOR_PRIMARY}};
}

/* Gradient arka plan */
.hero-section {
  background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_SECONDARY}});
}

/* Buton */
.btn-primary {
  background: {{COLOR_ACCENT}};
  color: white;
}

.btn-primary:hover {
  background: {{COLOR_PRIMARY}};
}

/* Metin */
.description {
  color: {{COLOR_TEXT}};
}

.meta-info {
  color: {{COLOR_TEXT_SECONDARY}};
}

/* Kartlar */
.card {
  background: {{COLOR_BACKGROUND}};
  border: 1px solid {{COLOR_PRIMARY}}20; /* 20 = opacity */
}
```

### Renk Kombinasyonları

```css
/* Glassmorphism */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Neumorphism */
.neuro-card {
  background: {{COLOR_BACKGROUND}};
  box-shadow: 
    8px 8px 16px rgba(0, 0, 0, 0.1),
    -8px -8px 16px rgba(255, 255, 255, 0.1);
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_ACCENT}});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## ✨ Best Practices

### 1. Modern Tasarım Teknikleri

#### Glassmorphism
```css
.glass-element {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

#### Smooth Animations
```css
.animated-element {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.animated-element:hover {
  transform: translateY(-5px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Responsive Typography
```css
.heading {
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.2;
}

.body-text {
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.6;
}
```

### 2. Accessibility

```html
<!-- Semantic HTML -->
<section aria-labelledby="about-heading">
  <h2 id="about-heading">About Me</h2>
  <!-- content -->
</section>

<!-- Skip to content -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Focus indicators -->
<style>
  :focus-visible {
    outline: 3px solid {{COLOR_ACCENT}};
    outline-offset: 2px;
  }
</style>

<!-- Reduced motion -->
<style>
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>
```

### 3. Performance

```html
<!-- Lazy loading -->
<img src="{{IMAGE_URL}}" alt="{{ALT_TEXT}}" loading="lazy" decoding="async">

<!-- Preload critical assets -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
```

```css
/* CSS containment */
.card {
  contain: layout style paint;
}

/* GPU acceleration */
.animated {
  transform: translateZ(0);
  will-change: transform;
}
```

### 4. Responsive Design

```css
/* Mobile-first approach */
.container {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 640px) {
  .container {
    padding: 2rem;
  }
}

/* Laptop */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}

/* Desktop */
@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

---

## 📚 Örnekler

### Örnek 1: Modern Card-Based Experience Template

```typescript
export const experienceTemplate3: ComponentTemplate = {
  id: "experience-cards-modern",
  name: "Modern Card Experience",
  category: "experience",
  htmlTemplate: `
    <section id="experience" class="exp-cards-section">
      <div class="exp-cards-container">
        <h2 class="exp-cards-heading">Work Experience</h2>
        <div class="exp-cards-grid">
          {{EXPERIENCE_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .exp-cards-section {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
    }
    
    .exp-cards-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .exp-cards-heading {
      font-size: clamp(2rem, 4vw, 3rem);
      color: {{COLOR_PRIMARY}};
      margin-bottom: 3rem;
      text-align: center;
    }
    
    .exp-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .exp-card {
      padding: 2rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .exp-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }
    
    .exp-card-company {
      font-size: 1.5rem;
      font-weight: 700;
      color: {{COLOR_PRIMARY}};
      margin-bottom: 0.5rem;
    }
    
    .exp-card-title {
      font-size: 1.25rem;
      color: {{COLOR_TEXT}};
      margin-bottom: 0.5rem;
    }
    
    .exp-card-date {
      font-size: 0.875rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 1rem;
    }
    
    .exp-card-description {
      color: {{COLOR_TEXT}};
      line-height: 1.6;
    }
    
    @media (max-width: 768px) {
      .exp-cards-section {
        padding: 3rem 1rem;
      }
    }
  `,
  placeholders: [
    "{{EXPERIENCE_ITEMS}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_TEXT_SECONDARY}}"
  ],
  designNotes: "Clean card-based layout with hover effects. Works well for all professions."
};
```

### Örnek 2: Animated Skills Grid

```typescript
export const skillsTemplate3: ComponentTemplate = {
  id: "skills-grid-animated",
  name: "Animated Skills Grid",
  category: "skills",
  htmlTemplate: `
    <section id="skills" class="skills-grid-section">
      <div class="skills-grid-container">
        <h2 class="skills-grid-heading">My Skills</h2>
        <div class="skills-grid">
          {{SKILL_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .skills-grid-section {
      padding: 5rem 2rem;
      background: linear-gradient(135deg, {{COLOR_BACKGROUND}}, {{COLOR_SECONDARY}}10);
    }
    
    .skills-grid-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .skills-grid-heading {
      font-size: clamp(2rem, 4vw, 3rem);
      color: {{COLOR_PRIMARY}};
      margin-bottom: 3rem;
      text-align: center;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1.5rem;
    }
    
    .skill-item {
      padding: 2rem 1rem;
      background: white;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.6s ease forwards;
    }
    
    .skill-item:nth-child(1) { animation-delay: 0.1s; }
    .skill-item:nth-child(2) { animation-delay: 0.2s; }
    .skill-item:nth-child(3) { animation-delay: 0.3s; }
    .skill-item:nth-child(4) { animation-delay: 0.4s; }
    .skill-item:nth-child(5) { animation-delay: 0.5s; }
    .skill-item:nth-child(6) { animation-delay: 0.6s; }
    
    .skill-item:hover {
      transform: translateY(-8px) scale(1.05);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      background: {{COLOR_PRIMARY}};
      color: white;
    }
    
    .skill-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .skill-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
    }
    
    .skill-item:hover .skill-name {
      color: white;
    }
    
    .skill-level {
      margin-top: 1rem;
      height: 4px;
      background: {{COLOR_BACKGROUND}};
      border-radius: 2px;
      overflow: hidden;
    }
    
    .skill-level-fill {
      height: 100%;
      background: {{COLOR_ACCENT}};
      transition: width 1s ease;
    }
    
    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @media (max-width: 768px) {
      .skills-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 1rem;
      }
    }
  `,
  jsTemplate: `
    // Animate skill levels on scroll
    const skillLevels = document.querySelectorAll('.skill-level-fill');
    
    const observerOptions = {
      threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const level = entry.target.getAttribute('data-level');
          entry.target.style.width = level + '%';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    skillLevels.forEach(level => observer.observe(level));
  `,
  placeholders: [
    "{{SKILL_ITEMS}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_SECONDARY}}",
    "{{COLOR_ACCENT}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_TEXT}}"
  ],
  designNotes: "Animated grid with staggered fade-in and interactive hover effects. Includes skill level progress bars."
};
```

---

## 🧪 Test ve Doğrulama

### Test Checklist

- [ ] **Görsel Test**
  - [ ] Tüm renkler doğru placeholder'ları kullanıyor
  - [ ] Responsive tasarım tüm ekran boyutlarında çalışıyor
  - [ ] Hover/focus states düzgün çalışıyor
  - [ ] Animasyonlar smooth ve performanslı

- [ ] **Kod Kalitesi**
  - [ ] Class isimleri benzersiz ve açıklayıcı
  - [ ] CSS çakışması yok
  - [ ] Placeholder'lar doğru formatta
  - [ ] JavaScript hatasız çalışıyor

- [ ] **Accessibility**
  - [ ] Semantic HTML kullanılmış
  - [ ] ARIA labels eklenmiş
  - [ ] Keyboard navigation çalışıyor
  - [ ] Color contrast yeterli (WCAG AA)
  - [ ] Reduced motion destekleniyor

- [ ] **Performance**
  - [ ] Gereksiz reflow/repaint yok
  - [ ] Animasyonlar GPU-accelerated
  - [ ] Image lazy loading var
  - [ ] CSS optimize edilmiş

- [ ] **Browser Uyumluluğu**
  - [ ] Chrome/Edge
  - [ ] Firefox
  - [ ] Safari
  - [ ] Mobile browsers

### Test Komutları

```bash
# Development server'ı başlat
npm run dev

# Build test
npm run build

# Lint check
npm run lint
```

### 🧪 Local Template Testing (Önerilen)

Gemini API token'larını harcamadan template'lerinizi test etmek için local test sistemini kullanın:

#### 1. Test Verisini Hazırlayın

```bash
# İlgili kategorinin test verisini düzenleyin
code test/data/hero-data.json
```

Test verisi formatı:
```json
{
  "userData": {
    "NAME": "Test İsim",
    "TITLE": "Test Ünvan",
    "SUMMARY": "Test özet...",
    // ... diğer placeholder'lar
  },
  "colors": {
    "COLOR_PRIMARY": "#3b82f6",
    "COLOR_SECONDARY": "#8b5cf6",
    // ... diğer renkler
  }
}
```

#### 2. Test Script'ini Çalıştırın

```bash
# Hero templates için
npm run test:hero

# Experience templates için  
npm run test:experience

# Skills templates için
npm run test:skills
```

#### 3. Preview'ı Açın

Test script otomatik olarak HTML preview oluşturur:
```bash
# Windows'ta otomatik açılır
# Manuel açmak için:
start test/output/hero-preview.html
```

#### 4. Tarayıcıda İnceleme

Preview'da görecekleriniz:
- ✅ Tüm template'ler alt alta
- ✅ Gerçek verilerle render edilmiş
- ✅ Navigasyon menüsü ile kolay gezinme
- ✅ Template metadata (ID, isim, notlar)

#### 5. İterasyon

1. Template'de değişiklik yapın
2. Test script'ini tekrar çalıştırın
3. Tarayıcıyı yenileyin (F5)
4. Değişiklikleri görün

> **💡 İpucu**: Bu yöntem Gemini API kullanmadığı için sınırsız test yapabilirsiniz!

Detaylı bilgi için: `test/README.md`

### Manuel Test Adımları (Production Test)

1. **Template'i ekleyin** ilgili dosyaya
2. **Export edin** template array'ine
3. **Dev server'ı başlatın** (`npm run dev`)
4. **Yeni bir site oluşturun** ve template'inizi seçin
5. **Preview'da test edin**:
   - Farklı ekran boyutları
   - Farklı renk kombinasyonları
   - Farklı içerik uzunlukları
6. **Publish edin** ve canlı sitede test edin

---

## 🎯 Hızlı Başlangıç Şablonu

Yeni bir template oluşturmak için bu şablonu kullanabilirsiniz:

```typescript
export const [category]Template[number]: ComponentTemplate = {
  id: "[category]-[style]-[variant]",
  name: "[Human Readable Name]",
  category: "[category]",
  
  htmlTemplate: `
    <section id="[category]" class="[category]-[style]-section">
      <div class="[category]-[style]-container">
        <h2 class="[category]-[style]-heading">Section Title</h2>
        <!-- Your HTML structure here -->
      </div>
    </section>
  `,
  
  cssTemplate: `
    .[category]-[style]-section {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
    }
    
    .[category]-[style]-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .[category]-[style]-heading {
      font-size: clamp(2rem, 4vw, 3rem);
      color: {{COLOR_PRIMARY}};
      margin-bottom: 3rem;
      text-align: center;
    }
    
    /* Your styles here */
    
    /* Responsive */
    @media (max-width: 768px) {
      .[category]-[style]-section {
        padding: 3rem 1rem;
      }
    }
    
    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  `,
  
  jsTemplate: `
    // Optional JavaScript here
  `,
  
  placeholders: [
    "{{COLOR_PRIMARY}}",
    "{{COLOR_SECONDARY}}",
    "{{COLOR_ACCENT}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_TEXT_SECONDARY}}"
  ],
  
  designNotes: "Brief description of the design and when to use it."
};
```

---

## 📝 Özet

### Template Oluşturma Adımları

1. ✅ Kategoriyi belirle
2. ✅ Benzersiz ID ve isim ver
3. ✅ HTML yapısını oluştur (semantic, accessible)
4. ✅ CSS stillerini yaz (responsive, modern)
5. ✅ JavaScript ekle (gerekirse)
6. ✅ Placeholder'ları listele
7. ✅ Design notes ekle
8. ✅ Template'i export et
9. ✅ Test et (görsel, kod, accessibility, performance)
10. ✅ Dokümante et

### Unutmayın

- 🎨 **Modern tasarım** kullanın (glassmorphism, smooth animations)
- ♿ **Accessibility** öncelikli olmalı
- 📱 **Mobile-first** yaklaşım
- 🎯 **Placeholder sistemi**ne sadık kalın
- 🚀 **Performance** optimize edin
- 🧪 **Test edin** her şeyi

---

## 🆘 Yardım ve Kaynaklar

### Tasarım İlhamı

- [Dribbble](https://dribbble.com) - Modern web tasarımları
- [Awwwards](https://awwwards.com) - Ödüllü web siteleri
- [Behance](https://behance.net) - Portfolyo örnekleri

### CSS Kaynakları

- [CSS Tricks](https://css-tricks.com) - CSS teknikleri
- [Modern CSS Solutions](https://moderncss.dev) - Modern CSS yaklaşımları
- [Glassmorphism Generator](https://glassmorphism.com) - Glass effect oluşturucu

### Accessibility

- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Erişilebilirlik standartları
- [A11y Project](https://www.a11yproject.com) - Accessibility checklist

### Animasyonlar

- [Animista](https://animista.net) - CSS animasyon kütüphanesi
- [Cubic Bezier](https://cubic-bezier.com) - Easing function oluşturucu

---

**Başarılar! 🚀** Sorularınız olursa çekinmeden sorun.
