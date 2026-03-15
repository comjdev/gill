#!/bin/bash

# One-time setup: Deploy redirect function + associate with CloudFront distribution
# Usage: ./setup-redirects.sh [DISTRIBUTION_ID]
# Or:    DISTRIBUTION_ID=E1234ABCD ./setup-redirects.sh
#
# Uses AWS profile: gill
# Requires: aws cli, jq (brew install jq)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "═══════════════════════════════════════════════════════"
echo "  CloudFront Redirect Setup (profile: gill)"
echo "═══════════════════════════════════════════════════════"
echo ""

# Step 1: Deploy function
"$SCRIPT_DIR/deploy-redirect-function.sh"

echo ""
echo "───────────────────────────────────────────────────────"
echo ""

# Step 2: Associate with distribution
"$SCRIPT_DIR/associate-function.sh" "$@"
