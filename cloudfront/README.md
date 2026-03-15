# CloudFront Redirect Function

SEO 301 redirects for legacy URLs. Runs at the edge on every viewer request.

## Redirects

| From | To |
|------|-----|
| `/about`, `/about/` | `/melbourne-lifestyle-photographer/` |
| `/contact`, `/contact/` | `/book-lifestyle-photographer-in-melbourne/` |
| `/portfolio`, `/portfolio/` | `/melbourne-photos/` |
| `/gallery`, `/gallery/` | `/melbourne-photos/` |
| `/blog`, `/blog/` | `/melbourne-photography-tips/` |
| `/categories/Maternity`, `/categories/Maternity/` | `/melbourne-maternity-photographer/` |
| `/categories/Newborn`, `/categories/Newborn/` | `/melbourne-newborn-photographer/` |
| `/categories/Family`, `/categories/Family/` | `/melbourne-family-photographer/` |
| `/categories/Wedding`, `/categories/Wedding/` | `/melbourne-wedding-photographer/` |

## Features

- **301 redirects** – permanent, SEO-safe
- **Query string preserved** – `?utm_source=google` carries through
- **Trailing slash variants** – both `/about` and `/about/` redirect
- **No redirect chains** – destinations are canonical URLs
- **Cache headers** – `max-age=31536000` on redirect responses

## Deploy (AWS profile: gill)

**Prerequisites:** AWS CLI, `jq` (`brew install jq`), profile `gill` configured (`aws configure --profile gill`)

### One-time setup (create function + associate with distribution)

```bash
# Run from project root
./cloudfront/scripts/setup-redirects.sh YOUR_DISTRIBUTION_ID
```

You'll be prompted for the distribution ID if omitted. Find it in **AWS Console → CloudFront → Distributions** or in your GitHub deploy secrets (`CLOUDFRONT_DISTRIBUTION_ID`).

### Update existing function (after editing redirects)

```bash
./cloudfront/scripts/deploy-redirect-function.sh
```

### Associate with a different distribution

```bash
./cloudfront/scripts/associate-function.sh YOUR_DISTRIBUTION_ID
```

### Scripts

| Script | Purpose |
|--------|---------|
| `cloudfront/scripts/deploy-redirect-function.sh` | Create/update function + publish to LIVE |
| `cloudfront/scripts/associate-function.sh` | Attach function to distribution (viewer-request) |
| `cloudfront/scripts/setup-redirects.sh` | Full setup: deploy + associate |

## Adding redirects

Edit `cloudfront/functions/redirect-viewer-request/index.js` and add both variants to the `REDIRECTS` object:

```javascript
"/old-path": "/new-canonical-path/",
"/old-path/": "/new-canonical-path/",
```

Redeploy the function after changes.

---

## 404 Logging (Identify Missing Redirects)

CloudFront Functions do not run for 4xx responses, so 404 logging requires **Lambda@Edge** (origin-response).

### Option A: Lambda@Edge — CloudWatch Logs

Deploy the companion function to log 404 paths to CloudWatch:

```bash
cd cloudfront/lambda-edge-404-logger
zip -r function.zip index.js
aws lambda create-function \
  --function-name log-404-origin-response \
  --runtime nodejs18.x \
  --handler index.handler \
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-edge-role \
  --zip-file fileb://function.zip
# Then associate with CloudFront distribution (origin-response trigger)
```

Logs appear in CloudWatch Logs: `/aws/lambda/us-east-1.log-404-origin-response`

### Option B: CloudFront Access Logs

Enable standard logging (S3). Logs include `cs-uri` and `sc-status`. Filter for `sc-status=404` to find paths needing redirects. Zero performance impact; no additional code.
