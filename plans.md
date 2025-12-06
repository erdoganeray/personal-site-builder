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

## User Page
- word/linkedin profile cv upload
- profile photo upload
- portfolio upload
- blog images upload
- billing/domain/settings activation

## Editor Content Page
- tüm revize işlemleri burada olmalı
- sitenin yayınlanma halinden sonra değişiklik olduysa uyarı çıkmalı
- gemini chat i olabilir
- burada preview gösterilecek, kullanıcı isterse en son yine bu ekrandan publish edebilecek. burayı kodlarken database deki previewContent, publishContent i nasıl işlemen gerektiğinden emin ol. yani değişiklik hemen publish e yansımamalı, mutlaka kullanıcı onayı gelmeli
- hem preview hem de publish için rollback ui tasarımı

## "Yayınlanmamış Değişiklikler Mevcut hatası"
- kaldırılacak (belki sadece publish zamanı bir değişiklik olursa gösterilir)

## AI-Less Component Template Sistemi
- previewContent, publishContent içeriklerini projeden kaldıracağız.
- bilgilerim'deki tüm bilgiler cvContent json olarak saklansın.
- cvContent içeriğine profil fotoğrafı (link), portfolio fotoğrafları (link, açıklama), facebook linki, twitter linki, instagram linki alanları ekle.
- cvContent içerikleri NULL olabilir. Örneğin bir kullanıcının cv'sinin eğitim bölümünde GPA bilgisi varken, bir kullanıcının GPA bilgisi olmayabilir. cvContent, belirli bir standartta olmak zorunda olduğu için cv'de olmayan ya da çıkarılamayan bilgiler NULL olmalı.
- bilgilerim sayfasında profil fotoğrafı yükleme alanı, portfoloio fotoğrafları yükleme alanı, facebook, twitter, instagram linki ekleme alanı ekle.
- bilgilerim'deki herhangi bir güncelleme anlık olarak cvContent'te sync olmalı.
- ilk site oluşturma ve info change'ler cvContent üzerinden preview'a yansımalı.
- belirli template componentler olacak. (hero, about/summary, experience, education, skills, portfolio, contact, languages). Bu component'ların her biri için belirli tarz ve stillere hitap eden çeşitli farklı tasarımlar olacak.
- kullanıcının girdiği prompt'tan uygun tema renkleri, hangi componentlerin kullanılacağı (örneğin bir kişinin portfolio component i olmak zorunda değil), kullanılacak componentleri hangi template'leri kullanılacağı bilgileri output edilir.
- ilgili template içerikleri ile gemini api'dan çıkan tasarım kararları ve cvContent içeriği birleştirilir. böylece web page ortaya çıkmış olur.
- ayrıca, bilgilerim'de bir değişiklik kaydedildiğinde, cvContent değişecek. preview sayfa cvContent'ten yansıtıldığı için, bilgilerim de yapılan herhangi bir info change direkt olarak preview'a yansımış olacak. sabit template'ler ile çalıştığımız için de ui hatası olmayacak.
- template önizleme sistemi
- kullanıcıların custom css ekleyebilmesi
- template marketplace

# Paid Plans Options

## Free Plan (MVP)
- static site oluşturma
- haftalı/aylık belirli token/sayıda düzenleme hakkı
- subdomain
- dosya yükleme limiti (profil fotoğrafı, portfolio)
- 5 version history
- 7 gün domain rezervasyonu
- Otomatik version temizliği için cron job (30/90 gün sonra)

## Paid Plan 
- react, vue ya da next.js gibi daha komplike teknolojiler ile web sitesi oluşturma
- haftalık/aylık more belirli token/sayıda düzenleme hakkı
- custom domain connection
- more dosya yükleme limiti (profil fotoğrafı, portfolio, blog images)
- blog page and blog editor
- more versiion history
- more domain rezervasyonu
- Otomatik version temizliği için cron job (30/90 gün sonra)

# Error Handling
- ai ile siteniz oluşturuluyor animation eklenecek
- ai ile siteniz oluşturuluyor sırasında dasboard menüde başka bir yere gidip "Sitem" e girince ai ile siteniz oluşturuluyor animation ı gidiyor ama arkada süreç işliyor, kısaca ui hatası var
- unpublish durumunda bazı kritik problemler:
    - version history yok,
    - rollback yapılamıyor, son publish siteye geri dönüş yok,
    - subdomain null olunca, başkası aynı subdomain'İ alabilir