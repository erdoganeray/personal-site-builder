import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// R2 Client (S3-compatible)
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

/**
 * Kullanıcı adını URL-safe subdomain'e çevirir
 * Örnek: "Ahmet Yılmaz" -> "ahmet-yilmaz"
 */
export function createUsernameSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD") // Türkçe karakterleri ayır
    .replace(/[\u0300-\u036f]/g, "") // Aksan işaretlerini kaldır
    .replace(/[^a-z0-9]+/g, "-") // Özel karakterleri tire yap
    .replace(/^-+|-+$/g, ""); // Baştaki/sondaki tireleri temizle
}

/**
 * HTML, CSS ve JS içeriğini Cloudflare R2'ye deploy eder ve subdomain oluşturur
 * @param username - Kullanıcı adı (subdomain için)
 * @param siteId - Site ID (dosya yolu için)
 * @param htmlContent - Yüklenecek HTML içeriği
 * @param cssContent - Yüklenecek CSS içeriği
 * @param jsContent - Yüklenecek JS içeriği
 * @returns Deployment bilgileri (URL, subdomain)
 */
export async function deployToCloudflare(
  username: string,
  siteId: string,
  htmlContent: string,
  cssContent: string,
  jsContent: string
): Promise<{
  success: boolean;
  url?: string;
  subdomain?: string;
  error?: string;
}> {
  try {
    // 1. Username'den subdomain oluştur
    const subdomain = createUsernameSlug(username);
    
    const bucketName = process.env.R2_BUCKET_NAME || "user-sites";
    
    // 2. R2'ye HTML dosyasını yükle
    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: `sites/${siteId}/index.html`,
        Body: htmlContent,
        ContentType: "text/html; charset=utf-8",
        CacheControl: "public, max-age=3600",
      })
    );

    // 3. CSS dosyasını yükle
    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: `sites/${siteId}/styles.css`,
        Body: cssContent,
        ContentType: "text/css; charset=utf-8",
        CacheControl: "public, max-age=3600",
      })
    );

    // 4. JS dosyasını yükle
    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: `sites/${siteId}/script.js`,
        Body: jsContent,
        ContentType: "application/javascript; charset=utf-8",
        CacheControl: "public, max-age=3600",
      })
    );

    console.log(`✅ Site deployed to R2: sites/${siteId}/`);

    // 5. R2 public URL oluştur
    const r2PublicDomain = process.env.R2_PUBLIC_DOMAIN || `${bucketName}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const fullUrl = `https://${r2PublicDomain}/sites/${siteId}/index.html`;

    // 6. Başarılı yanıt döndür
    return {
      success: true,
      url: fullUrl,
      subdomain: subdomain,
    };
  } catch (error) {
    console.error("❌ Cloudflare deployment error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Deployment failed",
    };
  }
}

/**
 * Yayınlanmış siteyi R2'den siler (HTML, CSS, JS)
 * @param siteId - Silinecek site ID
 */
export async function unpublishFromCloudflare(
  siteId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
    const bucketName = process.env.R2_BUCKET_NAME || "user-sites";
    
    // HTML, CSS ve JS dosyalarını sil
    const filesToDelete = [
      `sites/${siteId}/index.html`,
      `sites/${siteId}/styles.css`,
      `sites/${siteId}/script.js`,
    ];

    await Promise.all(
      filesToDelete.map((key) =>
        r2Client.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
          })
        )
      )
    );

    console.log(`✅ Site unpublished from R2: ${siteId}`);

    return { success: true };
  } catch (error) {
    console.error("❌ Cloudflare unpublish error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unpublish failed",
    };
  }
}
