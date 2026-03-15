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

## Deploy

### One-time setup (create function and associate)

```bash
# Create the function
aws cloudfront create-function \
  --name redirect-viewer-request \
  --function-config Comment="SEO redirects",Runtime="cloudfront-js-1.0" \
  --function-code fileb://cloudfront/functions/redirect-viewer-request/index.js

# Publish
aws cloudfront publish-function --name redirect-viewer-request

# Associate with distribution (get ETag first)
aws cloudfront get-distribution-config --id YOUR_DISTRIBUTION_ID
# Then update the distribution config to add the function to the default cache behavior's viewerRequest
```

### Update existing function

```bash
# Update code
aws cloudfront update-function \
  --name redirect-viewer-request \
  --if-match $(aws cloudfront describe-function --name redirect-viewer-request --query 'ETag' --output text) \
  --function-config Comment="SEO redirects",Runtime="cloudfront-js-1.0" \
  --function-code fileb://cloudfront/functions/redirect-viewer-request/index.js

# Publish (creates new version, triggers deployment)
aws cloudfront publish-function --name redirect-viewer-request
```

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
