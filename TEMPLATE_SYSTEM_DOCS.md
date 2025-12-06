# Template Tabanlı Site Oluşturma Sistemi - Dokümantasyon

## Genel Bakış

Bu sistem, CV bilgilerinden otomatik olarak modern, responsive kişisel web siteleri oluşturan template tabanlı bir yaklaşım kullanır.

## Akış

1. **CV Yükleme**: Kullanıcı CV'sini yükler
2. **CV Parse**: Gemini API CV'yi analiz eder ve yapılandırılmış veri oluşturur
3. **Prompt Girişi**: Kullanıcı site için özel isteklerini girer (opsiyonel)
4. **Tasarım Analizi**: Gemini API, CV ve prompt'u analiz ederek:
   - Tema renklerini belirler
   - Hangi component'lerin kullanılacağına karar verir
   - Her component için hangi template'in uygun olduğunu seçer
5. **Template Doldurma**: Seçilen template'lerdeki placeholder'lar CV içeriği ve renklerle doldurulur
6. **Site Oluşturma**: HTML/CSS/JS dosyaları oluşturulur ve veritabanına kaydedilir

## Klasör Yapısı

```
src/
├── types/
│   └── templates.ts          # Template tip tanımları
├── components/
│   └── site-templates/
│       ├── index.ts          # Template kayıt sistemi
│       ├── hero-templates.ts
│       ├── experience-templates.ts
│       └── skills-templates.ts
├── lib/
│   ├── design-analyzer.ts    # Gemini ile tasarım analizi
│   └── template-engine.ts    # Template placeholder sistemi
└── app/api/site/generate/
    └── route.ts              # Site oluşturma endpoint'i
```

## Template Yapısı

Her template şunları içerir:
- **id**: Benzersiz tanımlayıcı
- **name**: İnsan okunabilir isim
- **category**: Component kategorisi (hero, experience, skills, vb.)
- **htmlTemplate**: HTML şablonu (placeholder'lar ile)
- **cssTemplate**: CSS şablonu (placeholder'lar ile)
- **jsTemplate**: JavaScript şablonu (opsiyonel)
- **placeholders**: Kullanılan placeholder'ların listesi

### Placeholder Formatı

- `{{NAME}}` - Kişinin adı
- `{{TITLE}}` - Ünvan
- `{{COLOR_PRIMARY}}` - Birincil renk
- `{{EXPERIENCE_ITEMS}}` - Dinamik deneyim listesi
- vb.

## Mevcut Template'ler

### Hero Section
1. **hero-modern-centered**: Modern, merkezi düzen
2. **hero-split-screen**: İki kolonlu split-screen düzen

### Experience Section
1. **experience-timeline**: Zaman çizelgesi formatı
2. **experience-cards**: Kart grid düzeni

### Skills Section
1. **skills-progress-bars**: İlerleme çubukları
2. **skills-card-grid**: Kart grid düzeni

### Contact Section
1. **contact-modern-form**: Modern iletişim formu ve bilgi kartları, iki kolonlu düzen
2. **contact-minimal-centered**: Minimal merkezi tasarım, iletişim bilgileri kartları
3. **contact-split-info**: Split layout, sol taraf gradient bilgi, sağ taraf form

## Yeni Template Ekleme

1. İlgili kategori dosyasını açın (örn: `hero-templates.ts`)
2. Yeni template objesi oluşturun:

```typescript
export const heroTemplate3: ComponentTemplate = {
  id: "hero-unique-id",
  name: "Template Adı",
  category: "hero",
  htmlTemplate: `...`,
  cssTemplate: `...`,
  placeholders: ["{{NAME}}", "{{COLOR_PRIMARY}}", ...]
};
```

3. Template'i export listesine ekleyin:

```typescript
export const heroTemplates = [heroTemplate1, heroTemplate2, heroTemplate3];
```

4. Template'i `index.ts` dosyasına import edin ve `allTemplates` array'ine ekleyin:

```typescript
import { heroTemplates } from "./hero-templates";
// ...
export const allTemplates: ComponentTemplate[] = [
  ...heroTemplates,
  // ...
];
```

5. `design-analyzer.ts` dosyasına yeni template'i ekleyin:
   - Template listesine ve açıklamasına ekleyin
   - Örnek JSON çıktısına ekleyin (gerekirse)

6. Gerekirse `template-engine.ts` içinde:
   - Yeni `generate{Category}Items()` fonksiyonu ekleyin
   - Yeni `get{Category}Replacements()` fonksiyonu ekleyin
   - `getReplacementsForComponent()` switch case'ine yeni kategori ekleyin

## API Kullanımı

### Site Oluşturma

```
POST /api/site/generate
{
  "siteId": "site-id",
  "customPrompt": "Modern ve minimalist bir tasarım istiyorum" // opsiyonel
}
```

Response:
```json
{
  "success": true,
  "message": "Website generated successfully using template system",
  "site": {
    "id": "...",
    "title": "...",
    "status": "previewed",
    "previewUrl": "/preview/..."
  },
  "designPlan": {
    "themeColors": { ... },
    "selectedComponents": [ ... ],
    "layout": "single-page",
    "style": "modern"
  }
}
```

## Database Schema

Site tablosuna eklenen yeni alan:
- **designPlan** (Json?): Seçilen template'ler ve tema renkleri

## Gelecek Geliştirmeler

- [ ] About, Education, Contact, Footer template'leri
- [ ] Daha fazla template çeşidi
- [ ] Kullanıcının manuel template seçimi
- [ ] Template önizleme sistemi
- [ ] Custom CSS ekleme özelliği
- [ ] Template marketplace
