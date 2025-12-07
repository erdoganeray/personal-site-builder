# PersonalWeb Subdomain Router Worker

Cloudflare Worker for handling wildcard subdomain routing to R2-hosted personal websites.

## Setup

### 1. Install Wrangler CLI (if not installed)
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Create KV Namespace
```bash
wrangler kv:namespace create "SITE_MAPPINGS"
```

Copy the namespace ID from the output and paste it in `wrangler.toml` replacing `YOUR_KV_ID`.

### 4. Deploy Worker
```bash
wrangler deploy
```

### 5. Verify Deployment
```bash
wrangler tail
```

Then visit any subdomain like `https://test.personalweb.info` and watch the logs.

## How It Works

1. **Request arrives**: `https://eray.personalweb.info`
2. **Extract subdomain**: `eray`
3. **Lookup in KV**: Get `{userId, siteId}` mapping
4. **Fetch from R2**: `users/{userId}/site/{siteId}/index.html`
5. **Return response**: HTML with proper headers

## KV Store Structure

```json
{
  "eray": {
    "userId": "clxxx",
    "siteId": "clyyy"
  }
}
```

## Environment Variables

All configuration is in `wrangler.toml`:
- R2 bucket binding: `USER_SITES`
- KV namespace binding: `SITE_MAPPINGS`
- Account ID: Set in config
- Route: `*.personalweb.info/*`

## Testing Locally

```bash
wrangler dev
```

Then test with: `http://localhost:8787` (you'll need to manually set hostname header or use a tool like curl)

## Deployment

```bash
wrangler deploy
```

## Monitoring

```bash
wrangler tail
```
