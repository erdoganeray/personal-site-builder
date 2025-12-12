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

## Genel İyileştirmeler
- dosya yükleme aşamalarına ekstra kontroller eklenmeli. cv, profil fotoğrafı ve portfolio görselleri; her dashboard yenilendiğinde (kullanıcı giriş yaparsa, bilgilerimde bir şey kaydedilirse vb.) dosya yükleme kontrolleri tekrar kontrol edilmeli. cv, profil fotoğrafı, portfolio görselleri kaldırıldığı/silindiği aşamalarda mutlaka cloudflareden de silinmeli.
- tüm dosya yüklemelerine boyut sınır getirilmeli.
- kullanıcının cloudflare da harcadağı mb boyutu bilgisi supabase'de saklanmalı. bu kontrolü her dosya yükleme ve silme aşamasında kontrol edilmeli (cv yükleme silme, site publish etme unpublish, profil foto yükleme kaldırma, portfolio fotoğrafı yükleme kaldırma)
- componentlerin sırasını drag and drop ile belirleyebilir
- preview/publish sync olduğunda warning çıkıyor, warning içeriği düzgün şekilde gösterilmeli
- Loading state kontrolleri arttırılmalı
- cv yükleme aşaması, ai ile siteniz oluşturuluyor aşaması, revize edilme aşamaları.. dashboarda örneğin cv analiz edilirken başka bir dashboard sayfasına gidip tekrar bilgilerim e girince cv analiz ediliyor aşaması kayboluyor ve yine cv yüklenme ekranı görünüyor anlık olarak, arkadaki analiz işlemi bitince yine olması gerektiği sayfayı yeniliyor.

## Revise
- Bilgilerime pp yükledin, site oluştururken Profil fotoğrafı olmayan hero oluştu, hero yu güncellediğinde pp doğru şekilde siteye entegre olmuyor.
- revize hakkı dolunca revize isteyince uygun geri bildirimi veriyor ama next.js issue döndürüyor. döndürmesin.
- Component kaldırma, component ekleme konusu üzerine çalışılmalı. Örneğin portfolio fotosu yokken site oluşturulunca portfolio fotoğrafı eklenince uyarı olmalı: "editöre gidin ve portfolio oluşturun".
- Editördeki revizede tüm site yapay zekaya yazdırılıyor, bu hem işlemin çok uzun sürmesine hem de template sisteminin getirdiği standartlaşma kuralını bozuyor. 
- Siteyi oluşturdun, editörden revize yaptın, bilgilerimden bir bilgiyi değiştirdin ve kaydettin, revize ile oluşturulmuş yeni site tasarımı korunmuyor. Bunun yerine ilk başta kendi oluşturduğu tasarıma geri dönüyor.
- revise işleminde içerik değişimi yapılmamalı. herhangi içerik değişimi isteğinde kullanıcı bilgilerim e yönlendirilmeli.

## Aboneliklerim
- dashboard aboneliklerim sayfası aktif hale getirilmeli

## Subdomain - Custom Domain
- Subdomain çakışması kontrolü eklenmeli
- dashboard>domain sayfası işlevli hale getirilmeli

## Rollback
- hem preview hem de publish için rollback sistemi ve ui tasarımı

## Icon, Font, Color Palette
- site oluşturma aşamasına hazır icon, font desteği ekle
- gemini api color sistemi bazen renklerin birbiri ile karışmasına sebep oluyor. color palette sistemi ekle