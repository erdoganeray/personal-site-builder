// node clear-r2-bucket.js

require('dotenv').config({ path: '.env' });
const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require("@aws-sdk/client-s3");

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function clearBucket() {
  try {
    console.log("🗑️  user-sites bucket'ındaki tüm dosyalar listeleniyor...");
    
    let continuationToken = undefined;
    let totalDeleted = 0;
    
    do {
      // Bucket'taki tüm dosyaları listele
      const listCommand = new ListObjectsV2Command({
        Bucket: "user-sites",
        ContinuationToken: continuationToken,
      });
      
      const listResult = await r2Client.send(listCommand);
      
      if (!listResult.Contents || listResult.Contents.length === 0) {
        console.log("✅ Bucket zaten boş!");
        break;
      }
      
      console.log(`📦 ${listResult.Contents.length} dosya bulundu, siliniyor...`);
      
      // Tüm dosyaları sil
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: "user-sites",
        Delete: {
          Objects: listResult.Contents.map(obj => ({ Key: obj.Key })),
          Quiet: false,
        },
      });
      
      const deleteResult = await r2Client.send(deleteCommand);
      totalDeleted += deleteResult.Deleted?.length || 0;
      
      console.log(`✅ ${deleteResult.Deleted?.length || 0} dosya silindi`);
      
      if (deleteResult.Errors && deleteResult.Errors.length > 0) {
        console.error("⚠️  Bazı dosyalar silinemedi:", deleteResult.Errors);
      }
      
      continuationToken = listResult.NextContinuationToken;
      
    } while (continuationToken);
    
    console.log(`\n🎉 Tamamlandı! Toplam ${totalDeleted} dosya silindi.`);
    
  } catch (error) {
    console.error("❌ Hata:", error.message);
    console.error("\n🔍 Kontrol edin:");
    console.error("  - .env dosyasında tüm değişkenler doğru mu?");
    console.error("  - CLOUDFLARE_ACCOUNT_ID doğru mu?");
    console.error("  - R2_ACCESS_KEY_ID ve R2_SECRET_ACCESS_KEY doğru mu?");
    console.error("  - R2 bucket adı 'user-sites' mi?");
  }
}

clearBucket();
