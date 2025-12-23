# Domain Fikirleri
- profilly.me
- profilly.io

# Paid Plans Options

## Free Plan (MVP)
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
- nav a icon eklenince dashboard sitemde ve editorde nav ui hatası oldu
- gemini hatalarını handle et, kullanıcıya böyle gösterilmesin
"[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent: [404 Not Found] models/gemini-3-flash is not found for API version v1beta, or is not supported for generateContent. Call ListModels to see the list of available models and their supported methods."
" [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent: [429 Too Many Requests] You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/usage?tab=rate-limit. * Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-2.5-flash Please retry in 59.32993857s. [{"@type":"type.googleapis.com/google.rpc.Help","links":[{"description":"Learn more about Gemini API quotas","url":"https://ai.google.dev/gemini-api/docs/rate-limits"}]},{"@type":"type.googleapis.com/google.rpc.QuotaFailure","violations":[{"quotaMetric":"generativelanguage.googleapis.com/generate_content_free_tier_requests","quotaId":"GenerateRequestsPerDayPerProjectPerModel-FreeTier","quotaDimensions":{"model":"gemini-2.5-flash","location":"global"},"quotaValue":"20"}]},{"@type":"type.googleapis.com/google.rpc.RetryInfo","retryDelay":"59s"}]"
- üretilen sitelerde sürekli aynı template leri görüyorum. muhtemelen sürekli aynı cv yi kullanmamdan kaynaklı. gemi promptlarını elden geçir.
- site oluşturdun, yayınladın, yayındayken öz izleme sil dedin, site yayınlamada "Subdomain'iniz henüz rezerve edilmedi. Site yayınlamadan önce subdomain'iniz korunmayacaktır." uyarısı çıkıyor? çıkmaması gerek. bir de bu durumda normalde unpublish olmalı ama node list dediğimde hala yayınlı site gözüküyor.
- npm run build de bazı hatalar çıkıyor onlarla ilgilen.

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

#### Anonim Session Temizliği
- /api/cron/cleanup-anonymous-sessions/route.ts endpoint'i oluştur
- Kayıt/giriş yapılmamış (isAnonymous=true) anonim session'ları belirli bir süreden sonra (örn: 7 gün) sil
- İlgili Site kayıtlarını ve R2'deki CV dosyalarını da temizle
- vercel.json dosyasına cron job ekle

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