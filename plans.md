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


# MVP'de Olmasına Gerek Var Mı?
- npm run build deki lint hatalarını ignore ettik, düzeltilmesi gerek.
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

# Feedback
- Dashboard>Bilgilerim>Diller de dil seviyesi (ana dil, akıcı vb.) seçme kısmında ui hatası var.
- Dil bilgisi çekilirken Native mi Fluent mi bilgisi yanlış çekiliyor.

## Beta Testi Sonrası Güncellenecekler
- Vercel Hobby plan limitleri nedeniyle (max 2 cron job) tüm temizlik işlemleri `/api/cron/cleanup-all` altında tek bir job olarak birleştirildi.
- Düzenleme hakkı limiti özelliğini kaldır