# 🌐 Subdomain System - Complete Guide

> **Status:** ✅ Implemented & Ready for Deployment  
> **Last Updated:** December 7, 2025

Bu dokümantasyon, subdomain sisteminin kurulumu, deployment'ı ve teknik detaylarını içerir.

---

## 📋 İçindekiler

1. [Sistem Özeti](#sistem-özeti)
2. [Mimari](#mimari)
3. [Hızlı Başlangıç](#hızlı-başlangıç)
4. [Detaylı Deployment](#detaylı-deployment)
5. [Teknik Detaylar](#teknik-detaylar)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Sistem Özeti

PersonalWeb subdomain sistemi, kullanıcıların `https://kullaniciadi.personalweb.info` formatında kişisel web sitelerine sahip olmalarını sağlar.

### Temel Özellikler

- ✅ **Wildcard Subdomain Routing** - Cloudflare Worker ile dinamik routing
- ✅ **KV Store Integration** - Hızlı subdomain → site mapping
- ✅ **R2 Content Delivery** - HTML/CSS/JS dosyaları R2'de
- ✅ **Otomatik URL Slug** - Türkçe karakter desteği ile URL-safe dönüşüm
- ✅ **Publish/Unpublish API** - Otomatik KV sync

### URL Formatı

**Önce:**
```
https://pub-bf529b02842d4bcf8be2282dc9efb2a6.r2.dev/users/{userId}/site/{siteId}/index.html
```

**Şimdi:**
```
https://eray-erdogan.personalweb.info
```

---

## 🏗️ Mimari

```
User Request
     ↓
https://eray.personalweb.info
     ↓
Cloudflare DNS (*.personalweb.info)
     ↓
Cloudflare Worker (subdomain-router)
     ↓
1. Extract subdomain: "eray"
2. KV Lookup: eray → {userId, siteId}
3. R2 Fetch: users/{userId}/site/{siteId}/index.html
     ↓
Return HTML/CSS/JS
     ↓
User sees website
```

### Bileşenler

1. **Cloudflare Worker** (`workers/subdomain-router/`)
   - Wildcard routing
   - KV lookup
   - R2 content fetch
   - Response headers & caching

2. **KV Store** (`SITE_MAPPINGS`)
   - Subdomain → {userId, siteId} mapping
   - Global edge distribution
   - Eventually consistent (60s)

3. **R2 Bucket** (`user-sites`)
   - HTML/CSS/JS files
   - Path: `users/{userId}/site/{siteId}/`
   - Public access via Worker

4. **Next.js API** (`/api/site/publish`, `/api/site/unpublish`)
   - Site deployment
   - KV mapping management
   - Database updates

---

## ⚡ Hızlı Başlangıç

### Prerequisites

- ✅ Cloudflare hesabı
- ✅ Domain (personalweb.info) Cloudflare'e eklenmeli
- ✅ Wildcard DNS kaydı (`*.personalweb.info`)
- ✅ Worker route tanımlanmalı (`*.personalweb.info/*`)

### 5 Dakikada Deploy

```powershell
# 1. Wrangler CLI kur
npm install -g wrangler

# 2. Cloudflare login
wrangler login

# 3. Workers dizinine git
cd workers/subdomain-router

# 4. KV namespace oluştur
wrangler kv:namespace create "SITE_MAPPINGS"
# ÖNEMLİ: Çıktıdaki ID'yi kopyala!

# 5. wrangler.toml'deki YOUR_KV_ID'yi değiştir
# Manuel olarak düzenle: id = "abc123def456"

# 6. Deploy et
wrangler deploy

# 7. .env dosyasına ekle
# CLOUDFLARE_KV_NAMESPACE_ID="abc123def456"

# 8. Test et
cd ../..
npm run dev
# Dashboard'dan site publish et ve test et
```

---

## 🚀 Detaylı Deployment

### 1. Ortam Hazırlığı

#### Wrangler CLI Kurulumu
```powershell
npm install -g wrangler
wrangler --version
```

#### Cloudflare Authentication
```powershell
wrangler login
```
Browser'da açılan sayfadan Cloudflare hesabına giriş yap.

### 2. KV Namespace Oluşturma

```powershell
cd workers/subdomain-router
wrangler kv:namespace create "SITE_MAPPINGS"
```

**Örnek çıktı:**
```
🌀 Creating namespace with title "personalweb-subdomain-router-SITE_MAPPINGS"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "SITE_MAPPINGS", id = "abc123def456ghi789jkl" }
```

### 3. wrangler.toml Güncelleme

`workers/subdomain-router/wrangler.toml` dosyasını aç:

```toml
[[kv_namespaces]]
binding = "SITE_MAPPINGS"
id = "abc123def456ghi789jkl"  # Yukarıda aldığın gerçek ID
```

### 4. Worker Deployment

```powershell
wrangler deploy
```

**Başarılı çıktı:**
```
✨ Built successfully!
🌎 Uploading...
📡 Deployed personalweb-subdomain-router
   https://personalweb-subdomain-router.your-account.workers.dev
🌐 Route: *.personalweb.info/*
```

### 5. Environment Variables

Ana `.env` dosyasına ekle:

```bash
# Mevcut variables
CLOUDFLARE_ACCOUNT_ID=7697ae48d8bf487483876bcb6b5c7cf5
CLOUDFLARE_ZONE_ID=ae26f8907278598768de5af0db3c7de3
CLOUDFLARE_API_TOKEN=LQf3lNp49fFr79uyboJESVH2kFHyVhbN-crdGM0h
NEXT_PUBLIC_BASE_DOMAIN=personalweb.info
R2_BUCKET_NAME=user-sites

# Yeni ekle
CLOUDFLARE_KV_NAMESPACE_ID=abc123def456ghi789jkl
```

### 6. Test & Verification

#### A. Worker Logs
```powershell
cd workers/subdomain-router
wrangler tail
```

#### B. KV Store Test
```powershell
# Test mapping ekle
wrangler kv:key put --binding=SITE_MAPPINGS "test" '{"userId":"test123","siteId":"site456"}'

# Kontrol et
wrangler kv:key get --binding=SITE_MAPPINGS "test"
```

#### C. Next.js Application Test
```powershell
cd ../..
npm run dev
```

1. `http://localhost:3000` → Login
2. Dashboard → Site oluştur
3. Publish butonuna tıkla
4. URL'yi kontrol et: `https://kullaniciadi.personalweb.info`

---

## 🔧 Teknik Detaylar

### Worker Implementation

**Dosya:** `workers/subdomain-router/index.ts`

```typescript
// Subdomain extraction
const hostname = new URL(request.url).hostname;
const subdomain = hostname.split('.')[0];

// KV lookup
const mapping = await env.SITE_MAPPINGS.get(subdomain, 'json');
if (!mapping) return new Response('Site not found', { status: 404 });

// R2 fetch
const path = `users/${mapping.userId}/site/${mapping.siteId}/index.html`;
const object = await env.USER_SITES.get(path);
```

### KV Store Format

```json
{
  "eray-erdogan": {
    "userId": "clxxx",
    "siteId": "clyyy"
  }
}
```

### URL Slug Generation

```typescript
// src/lib/cloudflare-deploy.ts
function createUsernameSlug(username: string): string {
  return username
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

**Örnekler:**
- "Eray Erdoğan" → "eray-erdogan"
- "John Doe" → "john-doe"
- "test@email.com" → "test"

### API Flow

#### Publish API (`/api/site/publish`)
```typescript
1. Validate user & site
2. Create username slug
3. Deploy to R2 (HTML, CSS, JS)
4. Update KV: subdomain → {userId, siteId}
5. Update database: cloudflareUrl
6. Return success
```

#### Unpublish API (`/api/site/unpublish`)
```typescript
1. Delete from R2
2. Delete from KV
3. Update database: status = "previewed"
4. Return success
```

### Response Headers

```
Content-Type: text/html; charset=utf-8
Cache-Control: public, max-age=3600
Access-Control-Allow-Origin: *
X-Powered-By: Cloudflare Workers + R2
```

### File Structure

```
workers/subdomain-router/
├── index.ts          # Worker kodu (108 satır)
├── wrangler.toml     # Worker config
├── package.json      # Dependencies
├── tsconfig.json     # TypeScript config
└── README.md         # Teknik dokümantasyon
```

---

## 🐛 Troubleshooting

### Problem: "Worker not found"

**Çözüm:**
```powershell
cd workers/subdomain-router
wrangler deploy
```

### Problem: "KV binding not found"

**Çözüm:**
- `wrangler.toml` dosyasındaki KV ID'yi kontrol et
- Doğru ID olduğundan emin ol
- `wrangler deploy` komutunu tekrar çalıştır

### Problem: "Site not found" (404)

**Debug:**
```powershell
# KV mapping kontrol
wrangler kv:key list --binding=SITE_MAPPINGS
wrangler kv:key get --binding=SITE_MAPPINGS "subdomain"

# Worker logs
wrangler tail

# R2 kontrol (Cloudflare Dashboard)
# → R2 → user-sites → users/{userId}/site/{siteId}/
```

### Problem: CORS Hatası

**Kontrol:**
- Worker'daki CORS header'ları kontrol et
- Browser console'da detaylı hata mesajını oku
- `Access-Control-Allow-Origin: *` header'ı var mı?

### Problem: DNS Yayılmadı

**Çözüm:**
- İlk deploy'dan sonra 5-10 dakika bekle
- DNS propagation kontrolü: `nslookup test.personalweb.info`

### Problem: KV Güncellemesi Görünmüyor

**Açıklama:**
- KV store eventually consistent (60 saniye gecikme olabilir)
- Cache: Worker response'ları 1 saat cache'lenir

---

## 📊 Monitoring & Debugging

### Worker Logs
```powershell
cd workers/subdomain-router
wrangler tail
```

### KV Store İşlemleri
```powershell
# Tüm key'leri listele
wrangler kv:key list --binding=SITE_MAPPINGS

# Belirli key'i oku
wrangler kv:key get --binding=SITE_MAPPINGS "subdomain"

# Key sil
wrangler kv:key delete --binding=SITE_MAPPINGS "subdomain"

# Key ekle/güncelle
wrangler kv:key put --binding=SITE_MAPPINGS "subdomain" '{"userId":"xxx","siteId":"yyy"}'
```

### R2 Bucket Kontrolü
- Cloudflare Dashboard → R2 → user-sites
- Path: `users/{userId}/site/{siteId}/`
- Dosyalar: `index.html`, `styles.css`, `script.js`

### Worker İstatistikleri
- Cloudflare Dashboard → Workers & Pages
- personalweb-subdomain-router → Metrics
- Request count, errors, CPU time

### Local Testing
```powershell
cd workers/subdomain-router
wrangler dev
```

---

## 📚 Faydalı Komutlar

```powershell
# Worker status
wrangler status

# Worker sil
wrangler delete

# KV namespace sil
wrangler kv:namespace delete --binding=SITE_MAPPINGS

# Worker'ı local test
wrangler dev

# Production logs
wrangler tail

# Route listele
wrangler routes list
```

---

## ⚠️ Bilinen Sınırlamalar

1. **KV Consistency**
   - Eventually consistent store
   - Güncellemeler 60 saniye içinde yayılır

2. **DNS Propagation**
   - İlk deploy 5-10 dakika sürebilir
   - Global propagation için 24 saat

3. **Cache**
   - Worker response'ları 1 saat cache'lenir
   - Güncelleme gecikmesi olabilir

4. **Subdomain Collision**
   - Unpublish sonrası subdomain null oluyor
   - Başkası aynı subdomain'i alabilir (şimdilik)

---

## 🎯 Deployment Checklist

### Ön Hazırlık
- [x] DNS wildcard kaydı yapıldı
- [x] Worker route tanımlandı (`*.personalweb.info/*`)
- [x] R2 bucket oluşturuldu (`user-sites`)
- [x] Kod yazıldı ve commit edildi

### Deploy Adımları
- [ ] Wrangler CLI kuruldu
- [ ] Cloudflare login yapıldı
- [ ] KV namespace oluşturuldu
- [ ] `wrangler.toml` güncellendi (KV ID)
- [ ] Worker deploy edildi
- [ ] `.env` dosyasına `CLOUDFLARE_KV_NAMESPACE_ID` eklendi

### Test
- [ ] Worker çalışıyor
- [ ] KV store oluşturuldu
- [ ] Publish API çalışıyor
- [ ] KV mapping oluşuyor
- [ ] Subdomain URL açılıyor
- [ ] HTML/CSS/JS doğru yükleniyor
- [ ] Unpublish çalışıyor

---

## 🎊 Başarı Kriterleri

Sistem başarılı sayılır eğer:

1. ✅ Worker başarıyla deploy edildi
2. ✅ KV namespace oluşturuldu
3. ✅ Publish API KV mapping oluşturuyor
4. ✅ Unpublish API KV mapping siliyor
5. ✅ `https://kullaniciadi.personalweb.info` formatında siteler açılıyor
6. ✅ HTML/CSS/JS doğru yükleniyor
7. ✅ Hata logları temiz

---

## 🚀 Next Steps (Future Improvements)

### 1. Custom Domain Support
- Kullanıcılar kendi domain'lerini bağlayabilsin
- CNAME verification sistemi
- SSL sertifika yönetimi

### 2. Subdomain Reservation
- Unpublish sonrası 30 gün rezerve tut
- Collision prevention
- Premium subdomain sistemi

### 3. Analytics
- Worker üzerinden ziyaretçi sayısı
- Sayfa görüntüleme istatistikleri
- Real-time analytics dashboard

### 4. CDN Cache Purge
- Publish/unpublish sonrası otomatik cache temizleme
- Cloudflare API entegrasyonu
- Selective purge

### 5. A/B Testing
- Farklı versiyonları test et
- Worker-level routing
- Analytics integration

---

## 📖 Referanslar

### Dosyalar
- `workers/subdomain-router/index.ts` - Worker implementation
- `workers/subdomain-router/wrangler.toml` - Worker config
- `src/lib/cloudflare-deploy.ts` - KV management functions
- `src/app/api/site/publish/route.ts` - Publish API
- `src/app/api/site/unpublish/route.ts` - Unpublish API

### External Links
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare KV Docs](https://developers.cloudflare.com/kv/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

---

## 💡 Tips & Best Practices

1. **KV Key Naming**
   - Use lowercase slugs
   - URL-safe characters only
   - Meaningful names

2. **R2 Path Structure**
   - Keep consistent: `users/{userId}/site/{siteId}/`
   - Use IDs, not usernames
   - Version folders if needed

3. **Error Handling**
   - Always check KV lookup result
   - Handle R2 fetch errors gracefully
   - Log errors for debugging

4. **Performance**
   - KV is fast, use it liberally
   - Cache responses appropriately
   - Minimize R2 requests

5. **Security**
   - Validate subdomain format
   - Sanitize user inputs
   - Use proper CORS headers

---

## 📞 Support

### Logları Kontrol Et
```powershell
wrangler tail
```

### KV Store Debug
```powershell
wrangler kv:key list --binding=SITE_MAPPINGS
```

### R2 Debug
- Cloudflare Dashboard → R2 → user-sites

### Worker Metrics
- Cloudflare Dashboard → Workers & Pages → Metrics

---

## ✅ Özet

Subdomain sistemi şunları sağlar:

- ✅ **Kolay URL'ler**: `https://kullaniciadi.personalweb.info`
- ✅ **Hızlı Routing**: Cloudflare Edge Network
- ✅ **Otomatik Sync**: Publish/unpublish ile KV güncellemesi
- ✅ **Türkçe Destek**: URL-safe slug dönüşümü
- ✅ **Scalable**: Global edge distribution

**Deploy için:**
```powershell
cd workers/subdomain-router
wrangler login
wrangler kv:namespace create "SITE_MAPPINGS"
# KV ID'yi wrangler.toml'e yaz
wrangler deploy
```

Başarılar! 🚀

---

**Son Güncelleme:** December 7, 2025  
**Status:** ✅ Implemented & Ready for Deployment
