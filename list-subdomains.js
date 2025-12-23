// node list-subdomains.js

require('dotenv').config({ path: '.env' });

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_KV_NAMESPACE_ID = process.env.CLOUDFLARE_KV_NAMESPACE_ID || "ddef70b87d2e4655b7ce32f1a0d9f4f4";

async function listSubdomains() {
    if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_KV_NAMESPACE_ID) {
        console.error("❌ Hata: .env dosyasında CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID veya CLOUDFLARE_KV_NAMESPACE_ID eksik.");
        return;
    }

    try {
        console.log("🔍 Cloudflare KV üzerindeki aktif subdomainler listeleniyor...");

        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${CLOUDFLARE_KV_NAMESPACE_ID}/keys`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ KV listeleme hatası: ${response.status} ${response.statusText}`);
            console.error(errorText);
            return;
        }

        const data = await response.json();

        if (data.result && data.result.length > 0) {
            console.log(`\n✅ ${data.result.length} adet subdomain bulundu:\n`);
            data.result.forEach((key, index) => {
                console.log(`${index + 1}. ${key.name}`);
            });
            console.log("\n💡 Bu isimler KV mapping'de kayıtlı olan subdomainlerdir.");
        } else {
            console.log("ℹ️ Hiç subdomain bulunamadı.");
        }

    } catch (error) {
        console.error("❌ Bir hata oluştu:", error.message);
    }
}

listSubdomains();
