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
 * @param userId - Kullanıcı ID (dosya yolu için)
 * @param siteId - Site ID (dosya yolu için)
 * @param htmlContent - Yüklenecek HTML içeriği
 * @param cssContent - Yüklenecek CSS içeriği
 * @param jsContent - Yüklenecek JS içeriği
 * @returns Deployment bilgileri (URL, subdomain)
 */
export async function deployToCloudflare(
  username: string,
  userId: string,
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
        Key: `users/${userId}/site/${siteId}/index.html`,
        Body: htmlContent,
        ContentType: "text/html; charset=utf-8",
        CacheControl: "public, max-age=3600",
      })
    );

    // 3. CSS dosyasını yükle
    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: `users/${userId}/site/${siteId}/styles.css`,
        Body: cssContent,
        ContentType: "text/css; charset=utf-8",
        CacheControl: "public, max-age=3600",
      })
    );

    // 4. JS dosyasını yükle
    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: `users/${userId}/site/${siteId}/script.js`,
        Body: jsContent,
        ContentType: "application/javascript; charset=utf-8",
        CacheControl: "public, max-age=3600",
      })
    );

    console.log(`✅ Site deployed to R2: users/${userId}/site/${siteId}/`);

    // 5. Subdomain URL oluştur (Worker üzerinden serve edilecek)
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "personalweb.info";
    const fullUrl = `https://${subdomain}.${baseDomain}`;

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
 * @param userId - Kullanıcı ID
 * @param siteId - Silinecek site ID
 */
export async function unpublishFromCloudflare(
  userId: string,
  siteId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
    const bucketName = process.env.R2_BUCKET_NAME || "user-sites";
    
    // HTML, CSS ve JS dosyalarını sil
    const filesToDelete = [
      `users/${userId}/site/${siteId}/index.html`,
      `users/${userId}/site/${siteId}/styles.css`,
      `users/${userId}/site/${siteId}/script.js`,
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

    console.log(`✅ Site unpublished from R2: users/${userId}/site/${siteId}`);

    return { success: true };
  } catch (error) {
    console.error("❌ Cloudflare unpublish error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unpublish failed",
    };
  }
}

/**
 * KV store'a subdomain mapping ekler
 * @param subdomain - Subdomain adı
 * @param userId - Kullanıcı ID
 * @param siteId - Site ID
 */
export async function updateKVMapping(
  subdomain: string,
  userId: string,
  siteId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const kvNamespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

    if (!kvNamespaceId || !apiToken || !accountId) {
      throw new Error("Missing KV configuration (CLOUDFLARE_KV_NAMESPACE_ID, CLOUDFLARE_API_TOKEN, or CLOUDFLARE_ACCOUNT_ID)");
    }

    const kvData = JSON.stringify({ userId, siteId });

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${kvNamespaceId}/values/${subdomain}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${apiToken}`,
          "Content-Type": "text/plain",
        },
        body: kvData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`KV update failed: ${response.statusText} - ${errorText}`);
    }

    console.log(`✅ KV mapping updated: ${subdomain} -> userId: ${userId}, siteId: ${siteId}`);

    return { success: true };
  } catch (error) {
    console.error("❌ KV update error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "KV update failed",
    };
  }
}

/**
 * KV store'dan subdomain mapping siler
 * @param subdomain - Silinecek subdomain adı
 */
export async function deleteKVMapping(
  subdomain: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const kvNamespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

    if (!kvNamespaceId || !apiToken || !accountId) {
      throw new Error("Missing KV configuration");
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${kvNamespaceId}/values/${subdomain}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${apiToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`KV delete failed: ${response.statusText} - ${errorText}`);
    }

    console.log(`✅ KV mapping deleted: ${subdomain}`);

    return { success: true };
  } catch (error) {
    console.error("❌ KV delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "KV delete failed",
    };
  }
}
