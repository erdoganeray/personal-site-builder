// node delete-subdomain.js <subdomain>

require('dotenv').config({ path: '.env' });

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_KV_NAMESPACE_ID = process.env.CLOUDFLARE_KV_NAMESPACE_ID || "ddef70b87d2e4655b7ce32f1a0d9f4f4";

const subdomainToDelete = process.argv[2];

async function deleteSubdomain() {
    if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_KV_NAMESPACE_ID) {
        console.error("❌ Hata: .env dosyasında CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID veya CLOUDFLARE_KV_NAMESPACE_ID eksik.");
        return;
    }

    if (!subdomainToDelete) {
        console.error("❌ Hata: Silinecek subdomain adını belirtmelisiniz.");
        console.log("Kullanım: node delete-subdomain.js <subdomain-adi>");
        return;
    }

    try {
        console.log(`🗑️  Subdomain siliniyor: ${subdomainToDelete}...`);

        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${CLOUDFLARE_KV_NAMESPACE_ID}/values/${subdomainToDelete}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ KV silme hatası: ${response.status} ${response.statusText}`);
            console.error(errorText);
            return;
        }

        const data = await response.json();

        if (data.success) {
            console.log(`\n✅ Subdomain "${subdomainToDelete}" başarıyla KV üzerinden silindi.`);
            console.log("💡 Not: Bu işlem sadece KV mapping'ini siler. Eğer R2 üzerindeki dosyaları da silmek isterseniz clear-r2-bucket.js betiğini kullanabilirsiniz.");
        } else {
            console.error("❌ Silme başarısız oldu:", data.errors);
        }

    } catch (error) {
        console.error("❌ Bir hata oluştu:", error.message);
    }
}

deleteSubdomain();
