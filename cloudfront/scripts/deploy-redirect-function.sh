#!/bin/bash
# Deploy CloudFront redirect function (create or update + publish)
# Usage: ./deploy-redirect-function.sh
# Uses AWS profile: gill

set -e

PROFILE="gill"
FUNCTION_NAME="redirect-viewer-request"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FUNCTION_DIR="$(cd "$SCRIPT_DIR/../functions/redirect-viewer-request" && pwd)"
FUNCTION_CODE="$FUNCTION_DIR/index.js"

echo "🚀 Deploying CloudFront redirect function"
echo "   Profile: $PROFILE"
echo "   Function: $FUNCTION_NAME"
echo ""

# Check prerequisites
if ! command -v aws &>/dev/null; then
  echo "❌ AWS CLI not found. Install: https://aws.amazon.com/cli/"
  exit 1
fi

if [ ! -f "$FUNCTION_CODE" ]; then
  echo "❌ Function code not found: $FUNCTION_CODE"
  exit 1
fi

# Verify AWS credentials
if ! aws sts get-caller-identity --profile "$PROFILE" &>/dev/null; then
  echo "❌ Cannot authenticate with profile '$PROFILE'. Run: aws configure --profile gill"
  exit 1
fi

echo "✅ AWS credentials OK"
echo ""

# Check if function exists
EXISTS=$(aws cloudfront describe-function --name "$FUNCTION_NAME" --profile "$PROFILE" 2>/dev/null || true)

if [ -z "$EXISTS" ]; then
  echo "📦 Creating new function..."
  aws cloudfront create-function \
    --name "$FUNCTION_NAME" \
    --function-config 'Comment="SEO 301 redirects",Runtime="cloudfront-js-1.0"' \
    --function-code "fileb://$FUNCTION_CODE" \
    --profile "$PROFILE"
  echo "✅ Function created"
else
  echo "📦 Updating existing function..."
  ETAG=$(aws cloudfront describe-function --name "$FUNCTION_NAME" --profile "$PROFILE" --query 'ETag' --output text)
  aws cloudfront update-function \
    --name "$FUNCTION_NAME" \
    --if-match "$ETAG" \
    --function-config 'Comment="SEO 301 redirects",Runtime="cloudfront-js-1.0"' \
    --function-code "fileb://$FUNCTION_CODE" \
    --profile "$PROFILE"
  echo "✅ Function updated"
fi

echo ""
echo "📤 Publishing to LIVE stage..."
ETAG=$(aws cloudfront describe-function --name "$FUNCTION_NAME" --profile "$PROFILE" --query 'ETag' --output text)
aws cloudfront publish-function \
  --name "$FUNCTION_NAME" \
  --if-match "$ETAG" \
  --profile "$PROFILE"

echo ""
echo "✅ Deploy complete! Function is LIVE."
echo ""
echo "Next: Associate with your CloudFront distribution (one-time):"
echo "   ./associate-function.sh <DISTRIBUTION_ID>"
echo ""
echo "Get distribution ID from: AWS Console → CloudFront → Distributions"
echo "Or from your deploy secrets (CLOUDFRONT_DISTRIBUTION_ID)"
echo ""
