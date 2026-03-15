#!/bin/bash

# Associate redirect-viewer-request CloudFront Function with a distribution
# Run after deploy-redirect-function.sh (function must be LIVE)
#
# Usage: ./associate-function.sh [DISTRIBUTION_ID]
# Or:    DISTRIBUTION_ID=E1234ABCD ./associate-function.sh
# Or:    ./associate-function.sh  (prompts if not set)

set -e

PROFILE="${AWS_PROFILE:-gill}"
FUNCTION_NAME="redirect-viewer-request"

DIST_ID="${DISTRIBUTION_ID:-$1}"
if [ -z "$DIST_ID" ]; then
  echo "Enter your CloudFront Distribution ID (find in AWS Console or GitHub secrets):"
  read -r DIST_ID
  if [ -z "$DIST_ID" ]; then
    echo "Error: Distribution ID required"
    exit 1
  fi
fi

echo "Associating $FUNCTION_NAME with distribution $DIST_ID (profile: $PROFILE)"
echo ""

# Verify function exists and is published (must query LIVE stage)
STAGE=$(aws cloudfront describe-function --name "$FUNCTION_NAME" --stage LIVE --profile "$PROFILE" --query 'FunctionSummary.FunctionMetadata.Stage' --output text 2>/dev/null || true)
if [ -z "$STAGE" ] || [ "$STAGE" != "LIVE" ]; then
  echo "Error: Function $FUNCTION_NAME must exist and be LIVE. Run deploy-redirect-function.sh first."
  exit 1
fi

# Get account ID for function ARN
ACCOUNT_ID=$(aws sts get-caller-identity --profile "$PROFILE" --query Account --output text)
FUNCTION_ARN="arn:aws:cloudfront::${ACCOUNT_ID}:function/${FUNCTION_NAME}"

# Check for jq
if ! command -v jq &> /dev/null; then
  echo "Error: jq is required. Install with: brew install jq"
  exit 1
fi

# Fetch current config
echo "Fetching distribution config..."
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

aws cloudfront get-distribution-config --id "$DIST_ID" --profile "$PROFILE" --output json > "$TMP_DIR/full.json"

ETAG=$(jq -r '.ETag' "$TMP_DIR/full.json")

# Create FunctionAssociations for viewer-request
FUNC_ASSOC=$(jq -n \
  --arg arn "$FUNCTION_ARN" \
  '{
    Quantity: 1,
    Items: [{
      FunctionARN: $arn,
      EventType: "viewer-request"
    }]
  }')

# Add to DefaultCacheBehavior (merge with existing if any)
jq --argjson fa "$FUNC_ASSOC" \
  '.DistributionConfig | .DefaultCacheBehavior.FunctionAssociations = $fa' \
  "$TMP_DIR/full.json" > "$TMP_DIR/config.json"

# Update distribution
echo "Updating distribution (this may take a minute)..."
aws cloudfront update-distribution \
  --id "$DIST_ID" \
  --if-match "$ETAG" \
  --distribution-config "file://$TMP_DIR/config.json" \
  --profile "$PROFILE" \
  --output text > /dev/null

echo ""
echo "Success. The redirect function is now associated with distribution $DIST_ID."
echo "Propagation to edge locations typically takes 2–5 minutes."
echo ""
echo "Test a redirect: curl -I https://gill-photography.com.au/about"
