interface Env {
  USER_SITES: R2Bucket;
  SITE_MAPPINGS: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // 1. Subdomain'i çıkar
    const subdomain = hostname.split('.')[0];
    
    // www veya boş subdomain kontrolü
    if (!subdomain || subdomain === 'www' || subdomain === 'personalweb') {
      return new Response('Not Found - Invalid subdomain', { 
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    // 2. KV'den site bilgisini al
    const siteDataStr = await env.SITE_MAPPINGS.get(subdomain);
    
    if (!siteDataStr) {
      return new Response(`Site Not Found - Subdomain "${subdomain}" does not exist`, { 
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    let siteData: { userId: string; siteId: string };
    try {
      siteData = JSON.parse(siteDataStr);
    } catch (error) {
      console.error('Failed to parse site data:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
    
    const { userId, siteId } = siteData;
    
    // 3. URL path'ini belirle (/, /styles.css, /script.js)
    let filePath = url.pathname;
    if (filePath === '/' || filePath === '') {
      filePath = '/index.html';
    }
    
    const r2Key = `users/${userId}/site/${siteId}${filePath}`;
    
    console.log(`Fetching: ${r2Key}`);
    
    // 4. R2'den dosyayı getir
    const object = await env.USER_SITES.get(r2Key);
    
    if (!object) {
      console.error(`File not found in R2: ${r2Key}`);
      return new Response('File Not Found', { 
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    // 5. Content-Type belirle
    const contentType = getContentType(filePath);
    
    // 6. Response döndür
    return new Response(object.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'X-Powered-By': 'Cloudflare Workers + R2',
      },
    });
  },
};

function getContentType(path: string): string {
  const extension = path.toLowerCase().split('.').pop() || '';
  
  const contentTypes: Record<string, string> = {
    'html': 'text/html; charset=utf-8',
    'css': 'text/css; charset=utf-8',
    'js': 'application/javascript; charset=utf-8',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'ico': 'image/x-icon',
    'pdf': 'application/pdf',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'eot': 'application/vnd.ms-fontobject',
  };
  
  return contentTypes[extension] || 'application/octet-stream';
}
