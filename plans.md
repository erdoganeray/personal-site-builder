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
- blog images upload
- billing/domain/settings bölümleri aktif hale getirilmeli

## Editor Content Page
- hem preview hem de publish için rollback ui tasarımı
- sayfa yenilenince chat mesajları kayboluyor. kaybolmasın.

## AI-Less Component Template Sistemi
- cvContent içerikleri NULL olabilir. Örneğin bir kullanıcının cv'sinin eğitim bölümünde GPA bilgisi varken, bir kullanıcının GPA bilgisi olmayabilir. cvContent, belirli bir standartta olmak zorunda olduğu için cv'de olmayan ya da çıkarılamayan bilgiler NULL olmalı.
- template önizleme sistemi
- kullanıcıların custom css ekleyebilmesi
- template marketplace
- hazır icon'lar güncellenecek
- portfolio olarak sadece resim ekleniyor, başlık/açıklama/link de eklenebilir olmalı.
- user, template leri kendi seçebilir
- componentlerin sırasını drag and drop ile belirleyebilir
- preview/publish sync olduğunda warning çıkıyor, warning içeriği düzgün şekilde gösterilmeli

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
- portfolio da sadece fotoğraf

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
- portfolioda video

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
- dosya yüklemeleri için maksimum boyut kuralı ekle
- preview da portfolio sadece fotoğrafları gösteriyordu. tasarımı değiştir dediğimde efekt ekledi, fotoğrafın üstüne gelince başlık ve içerik gözüküyor. fakat başlık ve içerikleri dil modeli kendi eklemiş. böyle bir başlık ya da içerik kullanıcı tarafından eklenmemiş.
- revize hakkı dolunca revize isteyince uygun geri bildirimi veriyor ama next.js issue döndürüyor. döndürmesin.
- editor de chat ile deneyim bölümünü kaldırdığımda bilgilerimde deneyimler görünüyor.

# Güvenlik
- API key'leri `.env` dosyasında (GitHub'a commit edilmemiş)
- Production environment variables Vercel'de ayarlı
- Şifre hash'leme çalışıyor (bcrypt/argon2)
- SQL injection koruması var (Prisma otomatik yapıyor)

# Domain Fikirleri
- profilly.me
- profilly.io