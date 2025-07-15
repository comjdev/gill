#!/bin/bash

# Simple Contact Form Lambda Deployment Script
# This script packages and uploads the Lambda function

set -e

echo "🚀 Packaging Contact Form Lambda Function..."

# Check if we're in the right directory
if [ ! -f "index.js" ]; then
    echo "❌ Please run this script from the lambda/contact-form-handler directory"
    exit 1
fi

# Install dependencies
echo "📥 Installing dependencies..."
npm install --production

# Create deployment package
echo "🗜️  Creating deployment package..."
zip -r contact-form-handler.zip index.js templates.js node_modules/

echo "✅ Package created: contact-form-handler.zip"
echo ""
echo "📋 Next steps:"
echo "1. Go to AWS Lambda Console"
echo "2. Create a new function or update existing one"
echo "3. Upload contact-form-handler.zip"
echo "4. Set environment variables:"
echo "   - FROM_EMAIL: noreply@hindsight.com.au"
echo "   - TO_EMAIL: studio@hindsight.com.au"
echo "5. Set up IAM permissions for SES"
echo "6. Create API Gateway endpoint"
echo "7. Update the form action URL in contact.ejs"
echo ""
echo "🔗 API Gateway URL format:"
echo "   https://[api-id].execute-api.ap-southeast-2.amazonaws.com/prod/contact" 