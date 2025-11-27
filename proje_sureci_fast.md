# 🚀 Kişisel Web Sitesi MVP - Hızlı Geliştirme Süreci

## 📋 Proje Özeti

**Hedef:** 2 ay içinde çalışan bir MVP (Minimum Viable Product) oluşturmak
**Strateji:** En temel özelliklere odaklanarak hızlı bir şekilde kullanıcılara ulaşmak ve geri bildirim toplamak

## 🎯 MVP Kapsamı (Sadece Bunlar!)

### ✅ Yapılacaklar
1. **Sadece web uygulaması** - Mobil app daha sonra
2. **PDF CV yükleme** - Sadece PDF formatı
3. **LinkedIn/GitHub link girişi** - Kullanıcı manuel olarak linklerini ekler
4. **Gemini ile site oluşturma** - AI ile otomatik HTML/CSS/JS üretimi
5. **Preview + 1 revize hakkı** - Kullanıcı sonucu görebilir ve 1 kez değişiklik isteyebilir
6. **Cloudflare R2 + Cloudflare Pages deployment** - Tek tuşla yayınlama, MVP'de subdomain (kullaniciadi.personalweb.info)
7. **Sadece ücretsiz plan** - Ödeme sistemi yok

### ❌ Şimdilik Yapılmayacaklar
- ❌ Mobil uygulama
- ❌ Blog sistemi
- ❌ Portfolio galeri
- ❌ Custom domain (isimsoyisim.com) - MVP'de subdomain kullan (ahmet.yourdomain.com)
- ❌ Ödeme sistemi
- ❌ Sınırsız revize
- ❌ DOCX/PNG CV formatları
- ❌ LinkedIn/GitHub otomatik veri çekme

---

## 📅 8 Haftalık Geliştirme Planı

### **Hafta 1: Temel Kurulum ve Planlama**

#### Gün 1-2: Proje Başlangıç
- [x] Git repository oluştur (GitHub/GitLab)
- [x] Basit bir proje dokümantasyonu yaz
  - Kullanıcı akışı (user flow)
  - Ekran tasarımları (basit çizimler yeterli)
  - Veritabanı tabloları
- [x] Geliştirme ortamını hazırla
  - VSCode kurulumu
  - Node.js ve npm kurulumu

#### Gün 3-5: Teknoloji Stack Kurulumu
- [x] **Next.js projesi oluştur**
  ```bash
  npx create-next-app@latest personal-site-builder --typescript
  cd personal-site-builder
  ```
- [x] **Temel kütüphaneleri kur**
  ```bash
  npm install @prisma/client prisma
  npm install @google/generative-ai
  npm install react-hook-form zod
  npm install @uploadthing/react
  npm install tailwindcss
  ```
- [x] **Supabase hesabı aç** (ücretsiz PostgreSQL database)
- [x] **Google AI Studio'dan Gemini API key al**
- [x] **Environment variables dosyası oluştur** (.env)
  ```
  DATABASE_URL='postgresql://...'
  DIRECT_URL='postgresql://...'
  GEMINI_API_KEY='AIzaSy...'
  NEXTAUTH_SECRET='...'
  NEXTAUTH_URL='http://localhost:3000'
  VERCEL_TOKEN=''
  # Cloudflare Account
  CLOUDFLARE_ACCOUNT_ID="..."
  CLOUDFLARE_ZONE_ID="..." # Ana domain'in zone ID'si
  CLOUDFLARE_API_TOKEN="..."
  # R2 Storage
  R2_ACCESS_KEY_ID="..."
  R2_SECRET_ACCESS_KEY="..."
  R2_BUCKET_NAME="user-sites"
  R2_PUBLIC_URL="https://pub-...r2.dev"
  R2_PUBLIC_DOMAIN="pub-...r2.dev"
  # Domain
  NEXT_PUBLIC_BASE_DOMAIN="personalweb.info"
  ```

#### Gün 6-7: Veritabanı Kurulumu
- [x] **Prisma schema tasarla**
  ```prisma
  model User {
    id        String   @id @default(cuid())
    email     String   @unique
    password  String
    name      String?
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    username  String?  @unique
    sites     Site[]
  }

  model Site {
    id            String    @id @default(cuid())
    userId        String
    title         String    @default("My Personal Website")
    cvUrl         String?
    cvTextData    String?
    linkedinUrl   String?
    githubUrl     String?
    htmlContent   String?
    cssContent    String?
    jsContent     String?
    status        String    @default("draft")
    revisionCount Int       @default(0)
    maxRevisions  Int       @default(1)
    createdAt     DateTime  @default(now())
    updatedAt     DateTime  @updatedAt
    publishedAt   DateTime?
    cloudflareUrl String?
    subdomain     String?   @unique
    user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

    @@index([userId])
  }
  ```
- [x] **Prisma migration çalıştır**
  ```bash
  npx prisma migrate dev --name init
  ```

---

### **Hafta 2: Kullanıcı Girişi (Authentication)**

#### Gün 8-10: Auth Sistemi
- [x] **NextAuth.js kurulumu**
  ```bash
  npm install next-auth
  ```
- [x] **Login/Register sayfaları oluştur**
  - `/app/login/page.tsx` - Giriş sayfası
  - `/app/register/page.tsx` - Kayıt sayfası
- [x] **API route'ları oluştur**
  - `/app/api/auth/[...nextauth]/route.ts` - NextAuth handler
- [x] **Basit bir dashboard sayfası** oluştur
  - `/app/dashboard/page.tsx` - Kullanıcı paneli

#### Gün 11-14: Auth Testleri
- [x] Kayıt ol akışını test et
- [x] Giriş yap akışını test et
- [x] Çıkış yap akışını test et
- [x] Dashboard'a authentication kontrolü ekle

---

### **Hafta 3: CV Yükleme Sistemi**

#### Gün 15-17: Dosya Yükleme
- [x] **UploadThing kurulumu** (ücretsiz dosya yükleme servisi)
- [x] **CV yükleme formu oluştur**
  - Dashboard'da "CV Yükle" butonu
  - PDF dosyası seçme
  - Yükleme progress bar'ı
- [x] **API endpoint: PDF'i işle**
  - `/app/api/cv/upload/route.ts`
  - PDF'i UploadThing'e yükle
  - URL'i veritabanına kaydet

#### Gün 18-21: PDF İçerik Çıkarma
- [x] **Gemini ile PDF parsing**
  - Gemini API'nin multimodal özelliğini kullan (PDF upload desteği)
  - PDF dosyasını doğrudan Gemini'ye gönder
  - Gemini'den yapılandırılmış JSON çıktısı al
- [x] **CV'den yapılandırılmış veri çıkar**
  ```typescript
  // lib/gemini-pdf-parser.ts
  import { GoogleGenerativeAI } from "@google/generative-ai";
  
  export async function parseCVFromPDF(pdfBuffer: Buffer) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
    Bu PDF dosyasındaki CV/özgeçmiş bilgilerini analiz et ve aşağıdaki 
    JSON formatında yapılandırılmış olarak döndür:
    
    {
      "personalInfo": {
        "name": "Ad Soyad",
        "email": "email@example.com",
        "phone": "telefon",
        "location": "şehir, ülke",
        "title": "meslek/unvan"
      },
      "summary": "kısa özet/bio",
      "experience": [
        {
          "company": "şirket adı",
          "position": "pozisyon",
          "duration": "tarih aralığı",
          "description": "açıklama"
        }
      ],
      "education": [
        {
          "school": "okul adı",
          "degree": "derece",
          "field": "bölüm",
          "year": "yıl"
        }
      ],
      "skills": ["skill1", "skill2", ...],
      "languages": ["dil1", "dil2", ...]
    }
    
    Sadece JSON döndür, başka açıklama ekleme.
    `;
    
    const result = await model.generateContent([
      {
        inlineData: {
          data: pdfBuffer.toString('base64'),
          mimeType: 'application/pdf'
        }
      },
      prompt
    ]);
    
    return JSON.parse(result.response.text());
  }
  ```
- [x] **Çıkarılan veriyi JSON olarak sakla**
  - API endpoint'te Gemini'den gelen veriyi veritabanına kaydet
  - Hata durumunda kullanıcıya anlamlı mesaj göster

---

### **Hafta 4: AI Site Üretimi (HTML/CSS/JS - En Önemli Kısım!)**

#### Gün 22-25: Gemini Entegrasyonu
- [x] **Gemini API client oluştur**
  ```typescript
  // lib/gemini.ts
  import { GoogleGenerativeAI } from "@google/generative-ai";
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  
  export async function generateWebsite(cvData: any) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
    Sen bir web tasarımcısısın. Aşağıdaki CV bilgilerini kullanarak 
    modern, profesyonel bir kişisel web sitesi oluştur.
    
    CV Bilgileri:
    ${JSON.stringify(cvData, null, 2)}
    
    Lütfen şunları oluştur:
    1. Tam HTML kodu (responsive, modern)
    2. Tailwind CSS ile stillendirilmiş
    3. Sadece tek sayfa (single page)
    4. Bölümler: Header, About, Experience, Education, Skills, Contact
    
    Çıktı formatı:
    {
      "html": "<!DOCTYPE html>...",
      "explanation": "Tasarım kararlarının açıklaması"
    }
    `;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
  ```

#### Gün 26-28: Site Üretim Endpoint'i
- [x] **API route oluştur**
  - `/app/api/site/generate/route.ts`
  - CV verisini al
  - Gemini'ye gönder
  - HTML/CSS'i parse et
  - Veritabanına kaydet
  - Preview URL döndür

---

### **Hafta 5: Preview ve Revize Sistemi**

#### Gün 29-31: Preview Sayfası
- [x] **Preview sayfası oluştur**
  - `/app/preview/[siteId]/page.tsx`
  - Oluşturulan HTML'i iframe içinde göster
  - "Beğendim, Yayınla" butonu
  - "Revize İste" butonu (1 kez kullanılabilir)

#### Gün 32-35: Revize Sistemi
- [x] **Revize formu**
  - Kullanıcı ne değiştirmek istediğini yazabilir
  - "Daha renkli olsun", "Fotoğrafım daha büyük olsun" gibi
- [x] **Revize API endpoint'i**
  - `/app/api/site/revise/route.ts`
  - Mevcut HTML'i al
  - Kullanıcı isteğini Gemini'ye gönder
  - Gemini'den revize edilmiş HTML'i al
  - Veritabanını güncelle
  - Revize sayacını artır (max 1)
- [x] **"Yayınla" butonunu dashboard ve preview'a ekle**
  - Dashboard: Yayınla butonu + durum göstergesi
  - Preview: Yayınla butonu + başarı mesajları

---

### **Hafta 6: Cloudflare Pages + R2 Deployment Entegrasyonu**

#### Gün 36-38: Cloudflare Kurulumu
- [x] **Cloudflare hesabı ve API token**
  - https://dash.cloudflare.com/profile/api-tokens adresinden token al
  - R2 için Access Key/Secret oluştur
  - `.env` dosyasına ekle
- [x] **AWS SDK kurulumu** (R2 S3-compatible)
  ```bash
  npm install @aws-sdk/client-s3
  ```
- [x] **Deployment fonksiyonu oluştur**
  ```typescript
  // lib/cloudflare-deploy.ts
  import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

  const r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  export async function deployToCloudflare(
    username: string,
    siteId: string, 
    htmlContent: string
  ) {
    // 1. R2 bucket'a yükle
    const key = `sites/${siteId}/index.html`;
    
    await r2Client.send(
      new PutObjectCommand({
        Bucket: "user-sites",
        Key: key,
        Body: htmlContent,
        ContentType: "text/html",
        CacheControl: "public, max-age=3600",
      })
    );

    // 2. Otomatik subdomain oluştur (Cloudflare DNS API)
    const subdomain = `${username}.yourdomain.com`;
    
    await fetch(`https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/dns_records`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'CNAME',
        name: username, // ahmet-yilmaz
        content: 'your-r2-public-url.r2.dev',
        proxied: true, // Cloudflare CDN + SSL
        ttl: 1, // Otomatik
      }),
    });
    
    return {
      url: `https://${subdomain}`,
      subdomain: subdomain,
    };
  }
  ```

#### Gün 39-42: Yayınlama Sistemi
- [x] **"Yayınla" butonu endpoint'i**
  - `/app/api/site/publish/route.ts`
  - Site HTML'ini al
  - Cloudflare R2'ye deploy et
  - Otomatik subdomain oluştur (username.yourdomain.com)
  - URL'i veritabanına kaydet
  - Site status'ünü "published" yap
- [x] **Başarı sayfası**
  - "Siteniz yayında!" mesajı
  - Canlı subdomain URL'i göster (https://ahmet-yilmaz.yourdomain.com)
  - "Siteniz 30 saniye içinde aktif olacak" (DNS yayılma)
- [ ] **Subdomain kullanıcı adı kontrolü**
  - Kullanıcı adı benzersiz mi kontrol et
  - URL-safe format (tire ile ayır, özel karakter yok)
  - Örnek: "Ahmet Yılmaz" → "ahmet-yilmaz"

---

### **Hafta 7: Link Entegrasyonu ve İyileştirmeler**

#### Gün 43-45: LinkedIn/GitHub Link İşleme
- [x] **Link ekleme formu**
  - Dashboard'da "Linklerini Ekle" bölümü
  - LinkedIn URL input
  - GitHub URL input
- [x] **Link verilerini Gemini prompt'una ekle**
  ```typescript
  const prompt = `
  CV Bilgileri: ${cvData}
  LinkedIn: ${linkedinUrl}
  GitHub: ${githubUrl}
  
  LinkedIn profilini "Bağlantılar" bölümüne ekle.
  GitHub profilini "Projeler" bölümüne ekle.
  `;
  ```

#### Gün 46-49: UI/UX İyileştirmeleri
- [ ] Loading state'leri ekle (spinner'lar)
- [ ] Error handling iyileştir (hata mesajları)
- [ ] Responsive tasarımı kontrol et (mobil uyumlu mu?)
- [ ] Kullanıcı arayüzünü güzelleştir
  - Tailwind CSS ile modern görünüm
  - İkonlar ekle (Lucide React)
  - Animasyonlar (Framer Motion - optional)

---

### **Hafta 8: Test ve Launch**

#### Gün 50-53: Kapsamlı Test
- [ ] **Manuel testler**
  - [ ] Yeni kullanıcı kaydı
  - [ ] CV yükleme (farklı PDF'ler dene)
  - [ ] Site oluşturma (Gemini çalışıyor mu?)
  - [ ] Preview görüntüleme
  - [ ] Revize isteği (1 kez)
  - [ ] Cloudflare'e yayınlama
  - [ ] Canlı siteyi ziyaret et (.pages.dev domain)
- [ ] **Edge case'ler**
  - Çok büyük PDF
  - Bozuk PDF
  - Gemini hata verirse ne olur?
  - Cloudflare R2 upload başarısız olursa?

#### Gün 54-56: Production Hazırlığı
- [ ] **Environment variables kontrol**
  - Production Supabase database
  - Production Gemini API key (kotalar yeterli mi?)
  - Production Cloudflare API token, Zone ID ve R2 credentials
- [ ] **Cloudflare R2 bucket oluştur**
  - Bucket adı: "user-sites"
  - Public access ayarları
  - R2 custom domain bağla (sites.yourdomain.com gibi)
- [ ] **Cloudflare DNS wildcard ayarı**
  - Wildcard CNAME: *.yourdomain.com → R2 bucket URL
  - Wildcard SSL sertifikası (Cloudflare otomatik)
  - Test et: ahmet.yourdomain.com erişilebilir mi?
- [ ] **Ana uygulamayı deploy et** (Vercel/Netlify/Railway)
  ```bash
  # Vercel kullanıyorsan
  npm install -g vercel
  vercel --prod
  ```
- [ ] **Domain bağla** (ana uygulama için)
  - Ana site: app.yourdomain.com veya personalwebbuilder.com
  - Kullanıcı siteleri: *.yourdomain.com (wildcard)

#### Gün 57-60: Soft Launch
- [ ] **Beta kullanıcılar davet et**
  - 5-10 arkadaşına gönder
  - Geri bildirim topla
- [ ] **Bug'ları düzelt**
- [ ] **İlk gerçek kullanıcıları bekle!**

---

## 🛠 Teknoloji Stack (Kesin Liste)

### Frontend
- **Next.js 14+** - React framework (App Router)
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Hızlı stil
- **React Hook Form** - Form yönetimi
- **Zod** - Validasyon

### Backend
- **Next.js API Routes** - Backend API
- **Prisma** - Database ORM
- **Supabase** - PostgreSQL database (ücretsiz)
- **Cloudflare R2** - Dosya storage (PDF ve oluşturulan siteler)

### AI & Deployment
- **Google Gemini 2.5 Flash** - AI site üretimi (HTML/CSS/JS)
- **Cloudflare R2** - Static site hosting ve file storage
- **Cloudflare DNS** - Otomatik subdomain yönetimi
- **AWS SDK v3** - R2 (S3-compatible) entegrasyonu

### Authentication
- **NextAuth.js** - Kullanıcı girişi

---

## 📊 Veritabanı Şeması (Final)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  username  String?  @unique // URL-safe username (subdomain için)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  sites     Site[]
}

model Site {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // CV Data
  title         String    @default("My Personal Website")
  cvUrl         String?
  cvTextData    String?
  
  // External Links
  linkedinUrl   String?
  githubUrl     String?
  
  // Generated Content
  htmlContent   String?
  cssContent    String?
  jsContent     String?   // JavaScript içeriği eklendi
  
  // Deployment
  status        String    @default("draft") // draft, generating, published
  subdomain     String?   @unique // kullaniciadi.personalweb.info
  cloudflareUrl String?   // Tam URL: https://kullaniciadi.personalweb.info
  
  // Revision Control
  revisionCount Int       @default(0)
  maxRevisions  Int       @default(1)
  
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  publishedAt   DateTime?
  
  @@index([userId])
}
```

---

## 🎨 Kullanıcı Akışı (User Flow)

### 1️⃣ Kayıt & Giriş
```
[Landing Page] → [Sign Up] → [Login] → [Dashboard]
```

### 2️⃣ Site Oluşturma
```
[Dashboard]
    ↓
[CV Yükle (PDF)]
    ↓
[Linkler Ekle (LinkedIn/GitHub)] - opsiyonel
    ↓
[Oluştur Butonu]
    ↓
[Loading... (30-60 saniye)]
    ↓
[Preview Sayfası]
```

### 3️⃣ Revize (Opsiyonel)
```
[Preview Sayfası]
    ↓
[Revize İste Butonu]
    ↓
[Revize Formu: "Ne değişsin?"]
    ↓
[Loading... (30 saniye)]
    ↓
[Yeni Preview]
```

### 4️⃣ Yayınlama
```
[Preview Sayfası]
    ↓
[Beğendim, Yayınla]
    ↓
[Subdomain otomatik oluşturulur: username.personalweb.info]
    ↓
[Cloudflare R2'ye Deploy Ediliyor...]
    ↓
[HTML/CSS/JS dosyaları R2'ye yükleniyor]
    ↓
[Otomatik: Cloudflare DNS kaydı oluşturuluyor]
    ↓
[Otomatik: SSL sertifikası aktif (Cloudflare)]
    ↓
[Başarı! Siteniz: https://username.personalweb.info]
```

---

## 💡 Gemini Prompt Örnekleri

### Temel Site Üretimi Prompt'u
```
Sen profesyonel bir web tasarımcısısın. Aşağıdaki CV bilgilerini kullanarak 
modern, tek sayfalık (single-page) bir kişisel web sitesi oluştur.

CV Bilgileri:
- İsim: {name}
- Email: {email}
- Telefon: {phone}
- Özet: {summary}
- İş Deneyimleri: {experiences}
- Eğitim: {education}
- Yetenekler: {skills}

Ek Bilgiler:
- LinkedIn: {linkedinUrl}
- GitHub: {githubUrl}

Gereksinimler:
1. Modern ve profesyonel görünüm
2. Responsive (mobil uyumlu) tasarım
3. Temiz CSS kullan (Tailwind CDN kullanma, kendi CSS yaz)
4. Temiz, okunabilir tipografi
5. Profesyonel renk paleti (koyu veya açık tema, CV'ye uygun olanı seç)
6. Smooth scroll animasyonları
7. Font Awesome ikon kütüphanesi kullan (CDN)

Bölümler (sırayla):
- Hero Section (isim, ünvan, kısa tanıtım, profil fotoğrafı placeholder)
- Hakkımda (summary kısmı)
- İş Deneyimi (timeline formatında)
- Eğitim
- Yetenekler (skill cards veya progress bars)
- İletişim (email, telefon, LinkedIn, GitHub)

Teknik Detaylar:
- HTML, CSS ve JavaScript'i AYRI AYRI dosyalar olarak üret
- HTML: Sadece yapı ve içerik, inline style veya script KULLANMA
- CSS: Tüm stil kuralları ayrı dosyada (kendi CSS kodun)
- JavaScript: Tüm interaktif özellikler ayrı dosyada
- Meta tags ekle (SEO için)
- Responsive navigation menu (mobil için hamburger menu)

Çıktı formatı JSON olsun:
{
  "html": "<!DOCTYPE html>...tam HTML kodu (sadece yapı)...",
  "css": "/* Tüm CSS kodları */",
  "js": "// Tüm JavaScript kodları",
  "title": "Kişinin adı - Kişisel Web Sitesi",
  "description": "Kişinin unvanı ve kısa özeti (max 160 karakter)"
}

SADECE JSON formatında döndür, başka açıklama ekleme.
```

### Revize Prompt'u
```
Sen profesyonel bir web tasarımcısısın. Aşağıdaki HTML, CSS ve JavaScript kodlarını 
kullanıcının isteğine göre revize et.

Mevcut HTML:
{currentHtml}

Mevcut CSS:
{currentCss}

Mevcut JavaScript:
{currentJs}

Kullanıcının İsteği:
"{userRequest}"

Gereksinimler:
- Kullanıcının isteğini en iyi şekilde karşıla
- Responsive ve modern tasarımı koru
- HTML, CSS ve JS'i AYRI AYRI dosyalar olarak döndür
- Tüm mevcut içeriği koru (bilgi kaybı olmasın)
- Sadece istenen değişiklikleri yap
- Kod kalitesini ve okunabilirliği koru

Çıktı formatı JSON olsun:
{
  "html": "<!DOCTYPE html>...tam HTML kodu...",
  "css": "/* Tam CSS kodu */",
  "js": "// Tam JavaScript kodu",
  "changes": "Yapılan değişikliklerin Türkçe açıklaması (2-3 cümle)"
}

SADECE JSON formatında döndür, başka açıklama ekleme.
```

---

## 🚨 Olası Sorunlar ve Çözümler

### Sorun 1: Gemini API Çok Yavaş
**Çözüm:**
- Timeout süresi ayarla (60 saniye)
- Kullanıcıya "Site oluşturuluyor, lütfen bekleyin" mesajı göster
- Loading animasyonu ekle

### Sorun 2: PDF Parse Edilemiyor
**Çözüm:**
- Kullanıcıya "PDF okunamadı, başka bir dosya deneyin" hatası ver
- Alternatif: Manuel bilgi girişi formu sun

### Sorun 3: Gemini Hatalı HTML Üretiyor
**Çözüm:**
- Prompt'u iyileştir, daha spesifik ol
- JSON çıktısı alamazsan, regex ile HTML'i parse et
- Fallback: Basit bir template kullan

### Sorun 4: Cloudflare R2 Upload Başarısız
**Çözüm:**
- Hata mesajını logla (S3 error kodları)
- Kullanıcıya "Yayınlama başarısız, tekrar deneyin" mesajı göster
- Retry mekanizması ekle (max 3 deneme)
- R2 bucket izinlerini kontrol et

### Sorun 5: Kullanıcı Revize Sayısını Aşmak İstiyor
**Çözüm:**
- "Revize hakkınız doldu. Yeni bir site oluşturabilirsiniz" mesajı
- İleride: Ücretli plan reklamı

---

## 📈 Launch Sonrası İlk Ayda Yapılacaklar

### Hafta 9-10: Kullanıcı Geri Bildirimi
- [ ] Google Analytics ekle (kullanıcı davranışlarını izle)
- [ ] Feedback formu ekle
- [ ] İlk 10 kullanıcıyla birebir görüşme yap

### Hafta 11-12: Hızlı İyileştirmeler
- [ ] En çok talep edilen özelliği ekle
  - Muhtemelen: Fotoğraf yükleme
  - Veya: Daha fazla revize hakkı
- [ ] Bug'ları düzelt
- [ ] Performance optimizasyonu (sayfa yükleme hızı)

---

## 🎯 Başarı Metrikleri (KPI)

### Teknik Metrikler
- ✅ Kayıt → Site oluşturma: %80+ tamamlama oranı
- ✅ Site oluşturma süresi: <60 saniye
- ✅ Deployment başarı oranı: %95+
- ✅ Sayfa yükleme hızı: <3 saniye

### Kullanıcı Metrikleri
- 🎯 İlk 30 gün: 50 kayıtlı kullanıcı
- 🎯 İlk 30 gün: 20 yayınlanmış site
- 🎯 Kullanıcı memnuniyeti: 4/5 yıldız

---

## 🔥 Motivasyon ve İpuçları

### ✅ Yapılması Gerekenler
1. **Her gün kod yaz** - Sadece 2 saat bile olsa
2. **Perfeksiyonist olma** - Çalışan kod > Mükemmel kod
3. **Küçük adımlar at** - Her gün bir checkbox işaretle
4. **Erken test et** - Her özelliği hemen dene
5. **Dokümante et** - Kod yorumları yaz, README güncelle

### ❌ Yapılmaması Gerekenler
1. **Feature creep** - Yeni özellik ekleme, MVP'ye odaklan
2. **Over-engineering** - Basit çözümler tercih et
3. **Paralel feature geliştirme** - Bir şeyi bitir, sonra diğerine geç
4. **Uzun plan yapma** - 1 haftalık planları takip et
5. **Tek başına sıkışıp kalma** - ChatGPT, Stack Overflow, arkadaşlardan yardım al

---

## 📞 Yardım ve Kaynaklar

### Takıldığında Sorulacak Sorular
1. **Next.js soruları** → [Next.js Discord](https://discord.gg/nextjs)
2. **Prisma soruları** → [Prisma Discord](https://discord.gg/prisma)
3. **Gemini API soruları** → [Google AI Forum](https://discuss.ai.google.dev/)
4. **Genel kod soruları** → ChatGPT, Claude, Stack Overflow

### Faydalı Videolar (YouTube)
- "Build a Full-Stack App with Next.js 14"
- "Prisma Crash Course"
- "Google Gemini API Tutorial"
- "Deploy to Vercel in 5 Minutes"

### Faydalı Makaleler
- [Next.js Official Tutorial](https://nextjs.org/learn)
- [Prisma Quickstart](https://www.prisma.io/docs/getting-started)
- [Gemini API Quickstart](https://ai.google.dev/gemini-api/docs/quickstart)

---

## ✅ Son Checklist (Launch Öncesi)

Canlıya almadan önce bu listeyi kontrol et:

### Güvenlik
- [ ] API key'leri `.env.local` dosyasında (GitHub'a commit edilmemiş)
- [ ] Production environment variables Vercel'de ayarlı
- [ ] Şifre hash'leme çalışıyor (bcrypt/argon2)
- [ ] SQL injection koruması var (Prisma otomatik yapıyor)

### Fonksiyonellik
- [ ] Yeni kullanıcı kaydı çalışıyor
- [ ] Login çalışıyor
- [ ] CV yükleme çalışıyor
- [ ] Site oluşturma çalışıyor
- [ ] Preview çalışıyor
- [ ] Revize çalışıyor
- [ ] Yayınlama çalışıyor
- [ ] Canlı site erişilebilir

### Kullanıcı Deneyimi
- [ ] Loading state'leri var
- [ ] Hata mesajları anlaşılır
- [ ] Mobil responsive
- [ ] Butonlar tıklanabilir (hover effect'ler var)
- [ ] Formlar validasyon yapıyor

### Performance
- [ ] Sayfa yükleme <3 saniye
- [ ] Site oluşturma <60 saniye
- [ ] Database sorguları optimize
- [ ] Gereksiz console.log'lar temizlenmiş

---

## 🎉 Launch Günü!

### Sabah (09:00)
- [ ] Son testleri yap
- [ ] Ana uygulama production deployment'ı kontrol et
- [ ] Cloudflare R2 bucket erişilebilirliğini test et
- [ ] Database backup al

### Öğlen (12:00)
- [ ] İlk 5 arkadaşına link gönder
- [ ] Twitter/LinkedIn'de duyuru yap
- [ ] r/webdev, r/SideProject'e post at

### Akşam (18:00)
- [ ] İlk kullanıcı geri bildirimlerini oku
- [ ] Acil bug'ları düzelt
- [ ] Kullanıcı sayısını kontrol et

### Gece (22:00)
- [ ] Günün istatistiklerini yaz
- [ ] Yarın için plan yap
- [ ] 🎉 **Kutlama yap! İlk ürünün canlıda!**

---

## 🚀 Sonraki Adımlar (Post-MVP)

MVP başarılıysa (20+ yayınlanmış site, pozitif feedback):

### Ay 2-3: İlk İyileştirmeler
1. **Fotoğraf yükleme** - Profil fotoğrafı
2. **Template seçimi** - 3-4 hazır tasarım
3. **Daha fazla revize** - 3 revize hakkı
4. **SEO optimizasyonu** - Meta tags, sitemap
5. **Analytics dashboard** - Ziyaretçi istatistikleri

### Ay 3-4: Monetization
1. **Stripe entegrasyonu**
2. **Ücretli plan** ($5-10/ay)
  - Sınırsız revize
  - **Custom domain desteği** (isimsoyisim.com)
    - Kullanıcı kendi domain'ini bağlayabilir
    - Uygulama içinde rehber göster
    - DNS doğrulama sistemi
    - Otomatik SSL (Cloudflare)
  - Analytics ve istatistikler
  - Priority support
  - Daha fazla storage
  - Fotoğraf ve medya yükleme
3. **Free plan limitler**
  - Sadece 1 site
  - Subdomain (ahmet.yourdomain.com)
  - 1 revize hakkı
  - Temel özellikler

### Ay 4-6: Genişleme
1. **Blog sistemi** - Markdown editor
2. **Portfolio galeri** - Proje görselleri
3. **LinkedIn/GitHub scraping** - Otomatik veri çekme
4. **Mobil uygulama** - React Native

---

## 💪 Motivasyon Sözleri

> "Perfect is the enemy of good." - İlk versiyonu çıkar, sonra iyileştir.

> "Done is better than perfect." - Bitmiş kod > Mükemmel plan

> "Start before you're ready." - Hazır olmanı bekleme, başla!

**Şimdi git ve harika bir şey yarat! 🚀**

---

**Not:** Bu doküman senin kişisel rehberin. Her tamamladığın checkbox gurur duyacağın bir adım. Her hafta sonunda ilerlemeyi değerlendir ve gerekirse planı güncelle. En önemlisi: **Vazgeçme!** İlk 2 ay zor olacak ama sonunda çalışan bir ürünün olacak. 

**Başarılar! 💪🔥**

##### Sonrası İçin Kişisel Notlar
- mvp'de subdomain, post mvp'de custom domain (kullanıcı domain satın alıp dns bağlar)
- kullanıcı cv'yi word, sunum, linkedin hesabı linki olarak ekleyebilir. ya da dosya yüklemeden form doldurmak isteyebilir.
- bazı kullanıcılar web sayfasında blog sistemi olmasını isteyebilir.
- kullanıcılar kendi sitelerinin trafiğini görmek isteyebilir.
- kullanıcılar sitelerinde çoklu dil desteği eklemek isteyebilir.
- kullanıcılar light/dark seçeneği isteyebilir.
- profilly.io domain i güzel ve uygun fiyatlı (cloudflare in kendisinde de var)