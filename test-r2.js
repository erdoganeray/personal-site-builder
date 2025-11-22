require('dotenv').config({ path: '.env' });
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function testUpload() {
  try {
    console.log("🚀 R2'ye test dosyası yükleniyor...");
    
    const result = await r2Client.send(
      new PutObjectCommand({
        Bucket: "user-sites",
        Key: "test/index.html",
        Body: '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Test</title></head><body><h1>Test basarili!</h1><p>R2 bucket calisiyor 🎉</p></body></html>',
        ContentType: "text/html; charset=utf-8",
      })
    );
    
    console.log("✅ R2 upload başarılı!", result);
    console.log(`\n📍 Test URL: ${process.env.R2_PUBLIC_URL}/test/index.html`);
    console.log(`📍 Veya: https://pub-<bucket-id>.r2.dev/test/index.html`);
    console.log("\n🌐 Tarayıcıda yukarıdaki URL'yi açarak test edin!");
  } catch (error) {
    console.error("❌ Hata:", error.message);
    console.error("\n🔍 Kontrol edin:");
    console.error("  - .env.local dosyasında tüm değişkenler doğru mu?");
    console.error("  - CLOUDFLARE_ACCOUNT_ID doğru mu?");
    console.error("  - R2_ACCESS_KEY_ID ve R2_SECRET_ACCESS_KEY doğru mu?");
    console.error("  - R2 bucket adı 'user-sites' mi?");
  }
}

testUpload();
