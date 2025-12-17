# Domain Fikirleri
- profilly.me
- profilly.io

# Paid Plans Options

## Free Plan (MVP)
- static site oluşturma
- haftalık/aylık belirli token/sayıda düzenleme hakkı
- belirli recreate hakkı
- subdomain
- dosya yükleme limiti (profil fotoğrafı, portfolio)
- 5 version history
- 7 gün domain rezervasyonu
- Otomatik version temizliği için cron job (30/90 gün sonra)
- one page tasarım
- portfolio da sadece fotoğraf
- belki belirli mb storage

## Paid Plan 
- react, vue ya da next.js gibi daha komplike teknolojiler ile web sitesi oluşturma
- haftalık/aylık more belirli token/sayıda düzenleme hakkı
- more belirli recreate hakkı
- custom domain connection
- more dosya yükleme limiti (profil fotoğrafı, portfolio, blog images)
- blog page and blog editor
- more versiion history
- more domain rezervasyonu
- Otomatik version temizliği için cron job (30/90 gün sonra)
- multiple pages tasarım
- portfolioda video
- belki more belirli mb storage

# Geliştime Planı

## SEO İyileştirmeleri
- landing page
- free plan
- paid plan

## Güvenlik İyileştirmeleri

- API key'leri `.env` dosyasında (GitHub'a commit edilmemiş)
- Production environment variables Vercel'de ayarlı
- Şifre hash'leme çalışıyor (bcrypt/argon2)
- SQL injection koruması var (Prisma otomatik yapıyor)
- Özellikle bilgilerimdeki text alanlarına eklenen textlerin içine zararlı scriptler eklenebilir, bunların önüne geçmek gerek

### Rate Limiting
- Rate limiting middleware oluştur
  - IP bazlı rate limiting
  - Kullanıcı bazlı rate limiting
  - Redis veya in-memory cache kullan (örn: Upstash Redis)
- Kritik endpoint'lere rate limiting ekle
  - Login: 5 deneme/15 dakika
  - Şifre güncelleme: 3 deneme/saat
  - E-posta güncelleme: 5 deneme/gün
  - Hesap silme: 1 deneme/gün
  - Site oluşturma/revize: Plan bazlı limitler
  - API endpoint'leri: 100 istek/dakika (genel)

### CSRF ve XSS Koruması
- CSRF token kontrolü (NextAuth otomatik yapıyor mu kontrol et)
- XSS koruması için input sanitization
  - DOMPurify veya benzeri kütüphane kullan
  - Kullanıcı input'larını HTML render etmeden önce temizle
  - Content Security Policy (CSP) header'ları ekle

### Audit Logging Sistemi
- Kritik işlemleri logla
  - Şifre değişikliği
  - E-posta değişikliği
  - Hesap silme
  - Login/logout işlemleri
  - Başarısız login denemeleri
  - Site publish/unpublish işlemleri
- Log model'i oluştur (opsiyonel)
  - userId, action, timestamp, ipAddress, userAgent
- Log görüntüleme sayfası (admin için)
- Log retention policy (30/90 gün sonra otomatik temizlik)

### Hesap Güvenliği
- Hesap silme için ek doğrulama
  - "DELETE" yazısını yazdırma onayı
  - Mevcut şifre girişi zorunlu (✅ yapıldı)
  - E-posta onay kodu (opsiyonel)
- İki faktörlü kimlik doğrulama (2FA) - gelecek için
  - TOTP (Time-based OTP) implementasyonu
  - QR kod oluşturma
  - Backup kodları
- Şüpheli aktivite tespiti
  - Farklı IP'den login uyarısı
  - Çok sayıda başarısız login denemesi
  - Hesap kilitleme mekanizması

### API Güvenliği
- API key rotation sistemi
- Environment variable'ların güvenli yönetimi
- Sensitive data'nın loglanmaması
- Error message'larda detay vermeme (production'da)
- HTTPS zorunluluğu
- Secure headers (Helmet.js)
  - X-Frame-Options
  - X-Content-Type-Options
  - Strict-Transport-Security

### Veri Güvenliği
- Hassas verilerin şifrelenmesi (at-rest encryption)
- Database backup stratejisi
- GDPR uyumluluğu
  - Veri dışa aktarma özelliği
  - Veri silme hakkı (right to be forgotten)
  - Kullanıcı onayları (consent management)

### Edge Case
- çok büyük pdf
- bozuk pdf
- gemini hata verirse?
- cloudflare r2 bozuksa?

## Yayınlamadan Önce Son Yapılacaklar
- bazı templateler çok basit, daha modernleştir
- template havuzunu biraz daha geliştir
- landing sitenin tüm makyajını güncelle
- yeniden yayınla ui nın tasarımını unutma

### Landing Page
- sss eklenecek
- night/day
- multi languages
- showcase

## Versel Deploydan Sonra Yapılacaklar

### Vercel Cron Job
- landing page i vercel e deploy ettikten sonra yapılacak

#### Subdomain Rezervasyon Temizliği
- /api/cron/cleanup-reservations/route.ts endpoint'i oluştur (süresi dolmuş subdomain rezervasyonlarını temizler)
- vercel.json dosyasına cron job ekle (her 6 saatte bir çalışacak şekilde)
- CRON_SECRET environment variable'ı Vercel'e ekle (güvenlik için)
- Deploy sonrası Vercel Dashboard'dan manuel test et

#### Soft Delete Fotoğraf Temizliği (Rollback Sistemi)
- /api/cron/cleanup-deleted-assets/route.ts endpoint'i oluştur (30 günden eski soft-deleted fotoğrafları temizler)
- vercel.json dosyasına cron job ekle (her gece saat 02:00'de çalışacak şekilde: "0 2 * * *")
- CRON_SECRET environment variable'ı kullan (aynı secret her iki cron job için kullanılabilir)
- DeletedAsset tablosundan 30 günden eski kayıtları bul ve ilgili R2 dosyalarını sil
- Deploy sonrası Vercel Dashboard'dan manuel test et

### E posta güncelleme
- şu anda resend api üzerinden çalışıyor
- info@personalweb.info maili entegre edilecek
- contact componet formdaki mail de info@personalweb.info olarak güncellenecek
- Resend test domain'i (onboarding@resend.dev) sadece kayıtlı e-posta adresine (erayerdogan3551@gmail.com) gönderim yapabilir; production'da personaweb.info domain'i eklendikten sonra tüm e-postalara gönderim yapılabilecek.

# MVP'de Olmasına Gerek Var Mı?
- sadece cv web page değil. ürün/iş tanıtı sitesi de üretilebilir.
- Şifremi unuttum
- E postamı unuttum
- SMS onayı
- 2 adımlı doğrulama
- Chatte hafıza özelliği yok
- word/linkedin profile cv upload
- day/night mode for users
- multi languages desteği
- blog page and blog editor. blog images upload
- google analytics
- multi pages desteği
- kullanıcılar editor de tek bir görseli ya da bir metni revize edebilir. her component içinde component e özel revise olabilir.
- metin üretimlerinde yapay zeka tone'u olabilir
- tek prompt ile site generation yerine sohbete dayalı daha fazla bilgi alınabilecek bir yöntem (özellikle landing page'ten hemen ulaşılabilecek ve giriş ya da kayıt yapmaya teşvik edecek bir yöntem)
- user, template leri kendi seçebilir
- custom css
- component marketplace
- Fotoğraflı cv'lerde cv parse edilirken fotoğraf profil fotoğrafı olarak çekilebilir (word vs gibi eklentilerden sonra handle edilmeli)
- drag and drop ile sıralama değiştirilecek
- görsel crop/resize
- video support
- AI-generated metadata from images
- **Rollback Edge Case:** Kullanıcı 1 portfolio fotoyu kaldırdı → foto fallback'e düştü (DeletedAsset) → 30 gün geçti ve foto R2'den kalıcı silindi → kullanıcı "Geri Dön" dediğinde ne olacak?
  - **Problem:** Rollback işlemi publishedCvContent'i geri yükler ama foto artık R2'de yok → kırık foto linkleri (404)
  - **Çözüm Seçenekleri:**
    1. Rollback sırasında R2'de dosya kontrolü yap, eksik dosya varsa uyar ve rollback'i engelle/onay iste
    2. Partial rollback: Mevcut dosyaları geri yükle, eksik olanları publishedCvContent'ten çıkar
    3. DeletedAsset kayıtlarını asla silme (sadece R2'den sil), rollback sırasında "dosya artık mevcut değil" uyarısı ver
    4. Tombstone pattern: Silinen dosyalar için kalıcı kayıt tut
  - **Önerilen:** Seçenek 1 + 3 kombinasyonu (DeletedAsset kayıtlarını sakla + rollback sırasında dosya kontrolü)