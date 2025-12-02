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
* *ŞU ANKİ SİSTEM:* preview edilince htmlContent/cssContent/jsContent güncellenir, status güncellenir, previewContent güncellenir; publish edildiğinde status güncellenir, publishContent = previewContent olur. bilgilerim kaydet olduğunda status incelenir; published ise publishContent ile karşılaştırılır, previewed ise previewContent ile karşılaştırılır.

- preview durumunda bilgilerimde değişiklik varsa -> "bilgilerimdeki değişiklikleri kaldır" ya da "previewcontent i güncelle"
- publish durumda bilgilerimde değişiklik varsa ->

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
- her revizede güncel bilgiler çekilmeli fakat bu geminida context i çok doldurur, buna bir çözüm bulman lazım.
    - sadece bilgilerim'de değişiklik varsa revize hakkından düşmeden, çünkü bu durumda llm kullanmak şart olmayabilir?
- unpublish durumunda bazı kritik problemler:
    - version history yok,
    - rollback yapılamıyor, son publish siteye geri dönüş yok,
    - subdomain null olunca, başkası aynı subdomain'İ alabilir
# Karalama
- Şimdi, şu mantığı iyi oturtmalıyız:

preview durumu bizim playgorund umuz, kullanıcı tüm değişikliklerini yapıp rahatça gözlem yapabilir olmalı. daha sonra geliştireceğimiz editor kısmı da zaten burası ile ilgili olacak.

publish kısmı ise, kullanıcının preview'da görüp onay verdiğinde bir buton ile yayınladığı kısım.

örneğin şöyle bir senaryo da olabilir: kişi preview eder, bazı değişiklikler yapar, publish eder, sitesi publish'len preview (editor üzerinden)da değişiklik yapmaya devam eder, publish sitesi unpublish edilmeden güncellenir.

şöyle bir senaryo da olmalı: kişi preview eder, beğenir publish eder, sonra yapması gereken bir değişiklik fark eder ve bu durumda sitenin publish kalmamasını ister, siteyi unpublish eder, status publish'ten preview a düşer, kişi preview durumunda güncellemelerini yapar, sonra aynı subdomain/domain üzerinden tekrar publish eder. bu senaryodaki en kritik nokta işe şu: kişi cv'sini yükledi, ilk defa preview etti, preview site içeriği: a,b,c olsun. sonra kullanıcı bunu beğendi ve siteyi a,b,c şekliyle publish etti. site publish durumdayken preview ını a,b,d olarak güncelledi. sonra şu anki publish sitesini (a,b,c idi) unpublish etti. status bu durumda preview e geri döndüğünde preview (a,b,c olmamalı; a,b,d olarak kalmalı aynı zamanda rollback ihtimaline karşı unpublish edilmiş a,b,c sitesi kalmalı)

not: mvp'de rollback için en son versiyona dönüş olsun. birden önceki versiyonları daha sonra ele alırız.

tüm bu süreci. özellikle database sürecini planla