# Ideas

## Project Features for Users
- contact
- day/night mode
- multi languages
- blog page and blog editor
- google analytics
- seo özelleştirmeleri

## Landing Page
- sss eklenecek
- night/day
- multi languages
- showcase

## User Page
- word/linkedin profile cv upload
- profile photo upload
- portfolio upload
- blog images upload
- billing/domain/settings bölümleri aktif hale getirilmeli

## Editor Content Page
- tüm revize işlemleri burada olmalı
- sitenin yayınlanma halinden sonra değişiklik olduysa uyarı çıkmalı
- gemini chat i olabilir
- burada preview gösterilecek, kullanıcı isterse en son yine bu ekrandan publish edebilecek. burayı kodlarken database deki cvContent, publishContent i nasıl işlemen gerektiğinden emin ol. yani değişiklik hemen publish e yansımamalı, mutlaka kullanıcı onayı gelmeli
- hem preview hem de publish için rollback ui tasarımı

## AI-Less Component Template Sistemi
- cvContent içeriğine profil fotoğrafı (link), portfolio fotoğrafları (link, açıklama), facebook linki, twitter linki, instagram linki alanları ekle.
- cvContent içerikleri NULL olabilir. Örneğin bir kullanıcının cv'sinin eğitim bölümünde GPA bilgisi varken, bir kullanıcının GPA bilgisi olmayabilir. cvContent, belirli bir standartta olmak zorunda olduğu için cv'de olmayan ya da çıkarılamayan bilgiler NULL olmalı.
- bilgilerim sayfasında profil fotoğrafı yükleme alanı, portfoloio fotoğrafları yükleme alanı, facebook, twitter, instagram linki ekleme alanı ekle.
- template önizleme sistemi
- kullanıcıların custom css ekleyebilmesi
- template marketplace

# Paid Plans Options

## Free Plan (MVP)
- static site oluşturma
- haftalık/aylık belirli token/sayıda düzenleme hakkı
- subdomain
- dosya yükleme limiti (profil fotoğrafı, portfolio)
- 5 version history
- 7 gün domain rezervasyonu
- Otomatik version temizliği için cron job (30/90 gün sonra)
- one page tasarım

## Paid Plan 
- react, vue ya da next.js gibi daha komplike teknolojiler ile web sitesi oluşturma
- haftalık/aylık more belirli token/sayıda düzenleme hakkı
- custom domain connection
- more dosya yükleme limiti (profil fotoğrafı, portfolio, blog images)
- blog page and blog editor
- more versiion history
- more domain rezervasyonu
- Otomatik version temizliği için cron job (30/90 gün sonra)
- multiple pages tasarım

# Hata Yönetimi
- ai ile siteniz oluşturuluyor animation eklenecek
- ai ile siteniz oluşturuluyor sırasında dasboard menüde başka bir yere gidip "Sitem" e girince ai ile siteniz oluşturuluyor animation ı gidiyor ama arkada süreç işliyor, kısaca ui hatası var
- unpublish durumunda bazı kritik problemler:
    - version history yok,
    - rollback yapılamıyor, son publish siteye geri dönüş yok,
    - subdomain null olunca, başkası aynı subdomain'İ alabilir
- bilgilerim sayfasındaki herhangi bir içerik NULL olduğunda bu doğru şekilde handle edilmiyor.
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
- yeni cv eklendiğinde cloudflare'dan silinmeli, kişinin tek cv'si olmalı

# Güvenlik
- API key'leri `.env` dosyasında (GitHub'a commit edilmemiş)
- Production environment variables Vercel'de ayarlı
- Şifre hash'leme çalışıyor (bcrypt/argon2)
- SQL injection koruması var (Prisma otomatik yapıyor)

# Domain Fikirleri
- profilly.me
- profilly.io