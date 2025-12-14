# Ideas

## Project Features for Users
- day/night mode (optional olmalı, chat özelliğini bekle)
- multi languages (optional olmalı, chat özelliğini bekle)
- blog page and blog editor
- google analytics
- seo özelleştirmeleri
- hiç görsel alanlar düşünmedik, template görseller kullanılabilir. kullanıcı kendi görsellerini ekleyebilir.
- color palette ui. kullanıcı hazır color palette seçebilir, kendi color palette ini oluşturabilir.
- multiple pages'da page akışı için ai desteği
- ai ile metin, görsel üretimi
- ai metin üretimleri de tone belirleme
- tek prompt yerine birkaç soru ile fikir alma
- dashboard'dan domain satın alma
- her component'i kendi içinde ui ile editleme
- sadece cv web page değil, ürün/iş/business tanıtımı da olabilir.
- user, template leri kendi seçebilir
- custom css
- component marketplace
- Fotoğraflı cv'lerde cv parse edilirken fotoğraf profil fotoğrafı olarak çekilebilir (word vs gibi eklentilerden sonra handle edilmeli)

## Landing Page
- sss eklenecek
- night/day
- multi languages
- showcase

## User Page
- word/linkedin profile cv upload
- blog images upload
- billing/domain/settings bölümleri aktif hale getirilmeli

## Editor Content Page
- editor sayfasındaki preview da sitem de olmayan hatalar görülüyor. navigation menunun hero componentinin üstünde kalmasından kaynaklı profil fotoğrafının bir kısmı görülmüyor.

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

# Hata Yönetimi
- unpublish durumunda bazı kritik problemler:
    - version history yok,
    - rollback yapılamıyor, son publish siteye geri dönüş yok,
    - subdomain null olunca, başkası aynı subdomain'İ alabilir
- ui/ux iyileştirmeleri
    - Loading state'leri ekle (spinner'lar)
    - Error handling iyileştir (hata mesajları)
    - Responsive tasarımı kontrol et (mobil uyumlu mu?)
- Kullanıcı arayüzünü güzelleştir
    - Tailwind CSS ile modern görünüm
    - İkonlar ekle (Lucide React)
    - Animasyonlar (Framer Motion - optional)
- Edge Case
    - çok büyük pdf
    - bozuk pdf
    - gemini hata verirse?
    - cloudflare r2 bozuksa?

# Test

## Navigation

## Hero

## Experience

## Education
- okul logosu bulunabilir internette?

## Portfolio
- cv'den otomatik parse
- drag and drop ile sıralama değiştirilecek
- farklı boyutlarda görsellere uygunluk
- görsel crop/resize
- video support
- AI-generated metadata from images

## Skills

## Languages

## Contact
- **Email Sender Domain (Future Enhancement):** Şu an `onboarding@resend.dev` test domain'i kullanılıyor. İleride profesyonel görünüm için custom domain eklenebilir:
  - Resend Dashboard → Add Domain
  - DNS kayıtları ekle (TXT, CNAME records)
  - Verify domain
  - Kodda `from: 'contact@yourdomain.com'` olarak güncelle


# Güvenlik
- API key'leri `.env` dosyasında (GitHub'a commit edilmemiş)
- Production environment variables Vercel'de ayarlı
- Şifre hash'leme çalışıyor (bcrypt/argon2)
- SQL injection koruması var (Prisma otomatik yapıyor)
- Özellikle bilgilerimdeki text alanlarına eklenen textlerin içine zararlı scriptler eklenebilir, bunların önüne geçmek gerek

# Domain Fikirleri
- profilly.me
- profilly.io

# Geliştime Planı

## Rollback
- hem preview hem de publish için rollback sistemi ve ui tasarımı
- version history (aboneliklerimdeki tablodaki değerleri de işlevsel hale getir)
- domain rezevasyonu (aboneliklerimdeki tablodaki değerleri de işlevsel hale getir)

## Icon, Font, Color Palette, Stock Image
- site oluşturma aşamasına hazır icon, font desteği ekle
- gemini api color sistemi bazen renklerin birbiri ile karışmasına sebep oluyor. color palette sistemi ekle
- icon, font, color palette, stock image revise si doğru çalışmalı
- site oluşturulunca tarayıcı tab inde görünen isim logo ne olacak?

## UI/UX Güncellemeleri
- landing sitenin tüm makyajını güncelle
- yeniden yayınla ui nın tasarımını unutma

### Toast Notification Sistemi
- `react-hot-toast` veya `sonner` kütüphanesini yükle
- Tüm `alert()` çağrılarını modern toast notification'lara çevir
- Başarı, hata, uyarı ve bilgi mesajları için farklı stiller ve ikonlar
- Toast position ve duration ayarları (örn: top-right, 3 saniye)
- Dismiss butonu ve auto-dismiss özelliği

### Form Validasyon İyileştirmeleri
- Gerçek zamanlı validasyon feedback'i (onChange/onBlur)
- Input field'ların altında inline hata mesajları
- Şifre gücü göstergesi (password strength meter)
  - Zayıf/Orta/Güçlü gösterimi
  - Renk kodlaması (kırmızı/sarı/yeşil)
  - Şifre gereksinimleri checklist'i
- E-posta format validasyonu (regex)
- Required field'lar için görsel işaretler (*)
- Form submit öncesi tüm validasyonların kontrolü

### Loading State Animasyonları
- Skeleton loader'lar (Settings, MyInfo, Subscriptions, vb.)
- Smooth transition'lar (fade-in, slide-in)
- Button loading state'leri (spinner + disabled)
- Disabled state'lerde opacity efekti
- Progress indicator'lar (örn: dosya yükleme için)
- Lazy loading için placeholder'lar

### Genel UI İyileştirmeleri
- Tutarlı spacing ve padding kullanımı
- Responsive breakpoint'leri optimize et (mobile-first)
- Hover efektleri ve micro-interactions
- Focus state'leri (accessibility için)
- Empty state'ler için güzel placeholder'lar
- Confirmation modal'ları (kritik işlemler için)
- Tooltip'ler (bilgilendirici açıklamalar için)

## Performans İyileştirmeleri
- Kaydet butonunda muhtemelen çok fazla işlem oluyor ve ortalama 15 saniye sürüyor. Oldukça uzun bir süre.
- Loading state geliştirmeleri

## SEO İyileştirmeleri
- landing page
- free plan
- paid plan

## Güvenlik İyileştirmeleri

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
- Şifremi unuttum
- E postamı unuttum
- SMS onayı
- 2 adımlı doğrulama
- Chatte hafıza özelliği yok