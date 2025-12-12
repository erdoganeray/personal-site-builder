import { Resend } from 'resend';

interface Env {
  USER_SITES: R2Bucket;
  SITE_MAPPINGS: KVNamespace;
  RESEND_API_KEY: string;
  RATE_LIMIT: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const hostname = url.hostname;

    // Handle /api/contact endpoint
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContactForm(request, env);
    }

    // Handle CORS preflight for /api/contact
    if (url.pathname === '/api/contact' && request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

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
    let r2Key: string;

    // Check if this is an asset request (profile photo or portfolio image)
    if (filePath.startsWith('/_assets/profile/')) {
      // Profile photo: /_assets/profile/photo.jpg -> users/{userId}/profile/photo.jpg
      const fileName = filePath.replace('/_assets/profile/', '');
      r2Key = `users/${userId}/profile/${fileName}`;
    } else if (filePath.startsWith('/_assets/portfolio/')) {
      // Portfolio image: /_assets/portfolio/image.jpg -> users/{userId}/portfolio/image.jpg
      const fileName = filePath.replace('/_assets/portfolio/', '');
      r2Key = `users/${userId}/portfolio/${fileName}`;
    } else {
      // Regular site files (HTML, CSS, JS)
      if (filePath === '/' || filePath === '') {
        filePath = '/index.html';
      }
      r2Key = `users/${userId}/site/${siteId}${filePath}`;
    }

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

async function handleContactForm(request: Request, env: Env): Promise<Response> {
  try {
    // Parse request body
    const body = await request.json() as {
      name: string;
      email: string;
      message: string;
      siteOwnerEmail: string;
      honeypot?: string;
    };

    // Honeypot check - if filled, it's a bot
    if (body.honeypot && body.honeypot.trim() !== '') {
      console.log('[Contact API] Bot detected via honeypot');
      return Response.json({ success: true }); // Fake success for bots
    }

    // Basic validation
    if (!body.name || !body.email || !body.message || !body.siteOwnerEmail) {
      return Response.json(
        { error: 'Missing required fields' },
        {
          status: 400,
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      );
    }

    // Rate limiting
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (env.RATE_LIMIT) {
      const rateLimitKey = `ratelimit:${ip}`;
      const rateLimitData = await env.RATE_LIMIT.get(rateLimitKey, 'json') as
        { count: number; resetTime: number } | null;

      if (rateLimitData && rateLimitData.resetTime > Date.now()) {
        if (rateLimitData.count >= 5) {
          return Response.json(
            { error: 'Too many requests. Please try again later.' },
            {
              status: 429,
              headers: { 'Access-Control-Allow-Origin': '*' }
            }
          );
        }
        rateLimitData.count++;
        await env.RATE_LIMIT.put(rateLimitKey, JSON.stringify(rateLimitData), {
          expirationTtl: 3600
        });
      } else {
        await env.RATE_LIMIT.put(
          rateLimitKey,
          JSON.stringify({ count: 1, resetTime: Date.now() + 3600000 }),
          { expirationTtl: 3600 }
        );
      }
    }

    // Send email with Resend
    const resend = new Resend(env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: body.siteOwnerEmail,
      replyTo: body.email,
      subject: `New Contact Form Message from ${body.name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #555; }
              .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">📧 New Contact Form Submission</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">From:</div>
                  <div class="value">${body.name}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${body.email}">${body.email}</a></div>
                </div>
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="value">${body.message.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `
    });

    if (error) {
      console.error('[Contact API] Resend error:', error);
      return Response.json(
        { error: 'Failed to send email. Please try again later.' },
        {
          status: 500,
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      );
    }

    console.log('[Contact API] Email sent successfully:', data?.id);
    return Response.json(
      { success: true, messageId: data?.id },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );

  } catch (error) {
    console.error('[Contact API] Error:', error);
    return Response.json(
      { error: 'An unexpected error occurred. Please try again.' },
      {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    );
  }
}

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
