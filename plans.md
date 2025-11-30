# Ideas

## Editor Content
- tüm revize işlemleri burada olmalı
- sitenin yayınlanma halinden sonra değişiklik olduysa uyarı çıkmalı
- gemini chat i olabilir

## "Yayınlanmamış Değişiklikler Mevcut hatası"
- Sign Up > Upload CV > Data Extraction > Change > *NO_ERROR*
- Upload CV > Preview > Change > *ERROR*
- Upload CV > Preview > Delete CV > *NO_ERROR*
- Upload CV > Preview > Change > *ERROR* > Publish > User Approval > Yes > Publish without Changes
- Upload CV > Preview > Change > *ERROR* > Publish > User Approval > No > Dont Publish
- Upload CV > Preview > Publish > *NO_ERROR*
- Upload CV > Preview > Publish > Delete Publish > *NO_ERROR*
- Upload CV > Preview > Publish > Change > *ERROR* & *No change on publishing*
- Upload CV > Preview > Publish > Change > *ERROR* > Delete Publish > still *ERROR* > Reload Preview > *NO_ERROR*

* cv eklendiğinde ve her bilgilerim değişiklik kaydet olduğunda skills vb. içerikler güncellenir
* status bilgisinde (DRAFT,PUBLISHED,ARCHIVED,DELETED,PENDING) bilgisi tutuluyor. PREVIEWED bilgisi de tutulur. createdAt, updatedAt, publishedAt ?????
* preview ilk olduğunda -> htmlContent, cssContent, jsContent içerikleri değişir, status da değişecek
* published ilk olduğunda -> status değişir, publishContent te de içerik olsa
* preview edildiğinde previewContent (bu sanırım gemini.ts'deki cvData oluyor teknik olarak) değişir (skills vb. içeriklerin toplamı)
* publish edildiğinde publishContent değişir (direkt previewContent olur)
* preview dan sonra bilgilerim değişirse, değişiklik status ve previewContent ile analiz edilir
* özetle: preview edilince htmlContent/cssContent/jsContent güncellenir, status güncellenir, previewContent güncellenir; publish edildiğinde status güncellenir, publishContent = previewContent olur. bilgilerim kaydet olduğunda status incelenir; published ise publishContent ile karşılaştırılır, previewed ise previewContent ile karşılaştırılır.

# Paid Plans Options

## Free Plan (MVP)
- static site oluşturma
- belirli token/sayıda düzenleme hakkı
- subdomain
- dosya yükleme limiti (profil fotoğrafı, portfolio)

## Paid Plan 
- react, vue ya da next.js gibi daha komplike teknolojiler ile web sitesi oluşturma
- more belirli token/sayıda düzenleme hakkı
- domain connection
- more dosya yükleme limiti (profil fotoğrafı, portfolio, blog images)
- blog page and blog editor

# Site Features
- contact
- day/night mode
- multi languages
- blog page and blog editor
- google analytics

# Error Handling
- ai ile siteniz oluşturuluyor animation eklenecek
- ai ile siteniz oluşturuluyor sırasında dasboard menüde başka bir yere gidip "Sitem" e girince ai ile siteniz oluşturuluyor animation ı gidiyor ama arkada süreç işliyor, kısaca ui hatası var
- her revizede güncel bilgiler çekilmeli fakat bu geminida context i çok doldurur, buna bir çözüm bulman lazım.
- sadece bilgilerim'de değişiklik varsa revize hakkından düşmeden, çünkü bu durumda llm kullanmak şart olmayabilir?