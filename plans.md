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

## Yayınlamadan Önce Son Yapılacaklar
- bazı templateler çok basit, daha modernleştir
- template havuzunu biraz daha geliştir
- landing sitenin tüm makyajını güncelle
- yeniden yayınla ui nın tasarımını unutma
- landing page için seo geliştirmesi

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