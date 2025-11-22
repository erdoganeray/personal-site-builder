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
 * HTML içeriğini Cloudflare R2'ye deploy eder ve subdomain oluşturur
 * @param username - Kullanıcı adı (subdomain için)
 * @param siteId - Site ID (dosya yolu için)
 * @param htmlContent - Yüklenecek HTML içeriği
 * @returns Deployment bilgileri (URL, subdomain)
 */
export async function deployToCloudflare(
  username: string,
  siteId: string,
  htmlContent: string
): Promise<{
  success: boolean;
  url?: string;
  subdomain?: string;
  error?: string;
}> {
  try {
    // 1. Username'den subdomain oluştur
    const subdomain = createUsernameSlug(username);
    
    // 2. R2'ye HTML dosyasını yükle
    const key = `sites/${siteId}/index.html`;
    const bucketName = process.env.R2_BUCKET_NAME || "user-sites";

    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: htmlContent,
        ContentType: "text/html; charset=utf-8",
        CacheControl: "public, max-age=3600", // 1 saat cache
      })
    );

    console.log(`✅ Site deployed to R2: ${key}`);

    // 3. R2 public URL oluştur
    // Format: https://<bucket-name>.<account-id>.r2.cloudflarestorage.com/sites/<siteId>/index.html
    // veya custom domain varsa: https://<custom-domain>/sites/<siteId>/index.html
    const r2PublicDomain = process.env.R2_PUBLIC_DOMAIN || `${bucketName}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const fullUrl = `https://${r2PublicDomain}/sites/${siteId}/index.html`;

    // 4. Başarılı yanıt döndür
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
 * Yayınlanmış siteyi R2'den siler
 * @param siteId - Silinecek site ID
 */
export async function unpublishFromCloudflare(
  siteId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
    
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME || "user-sites",
        Key: `sites/${siteId}/index.html`,
      })
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
