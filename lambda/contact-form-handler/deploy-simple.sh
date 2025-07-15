#!/bin/bash

# Contact Form Handler - Simple Deploy Script
# This script deploys the Lambda function for the contact form

set -e

echo "🚀 Deploying Contact Form Handler Lambda Function"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if zip is available
if ! command -v zip &> /dev/null; then
    echo "❌ zip command is not available. Please install it first."
    exit 1
fi

# Configuration
FUNCTION_NAME="contact-form-handler"
REGION="ap-southeast-2"
RUNTIME="nodejs18.x"
HANDLER="index.handler"
ROLE_NAME="contact-form-handler-role"

echo "📋 Configuration:"
echo "   - Function Name: $FUNCTION_NAME"
echo "   - Region: $REGION"
echo "   - Runtime: $RUNTIME"
echo "   - Handler: $HANDLER"
echo "   - FROM_EMAIL: noreply@gill-photography.com.au"
echo "   - TO_EMAIL: gill@gill-photography.com.au"
echo ""

# Create deployment package
echo "📦 Creating deployment package..."
rm -rf package.zip
zip -r package.zip index.js templates.js package.json node_modules/
echo "✅ Package created: package.zip"
echo ""

# Check if function exists
FUNCTION_EXISTS=$(aws lambda list-functions --region $REGION --query "Functions[?FunctionName=='$FUNCTION_NAME'].FunctionName" --output text)

if [ -z "$FUNCTION_EXISTS" ]; then
    echo "🆕 Creating new Lambda function..."
    
    # Create IAM role for Lambda
    echo "🔐 Creating IAM role..."
    aws iam create-role \
        --role-name $ROLE_NAME \
        --assume-role-policy-document '{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "lambda.amazonaws.com"
                    },
                    "Action": "sts:AssumeRole"
                }
            ]
        }' 2>/dev/null || echo "Role already exists"
    
    # Attach basic execution role
    aws iam attach-role-policy \
        --role-name $ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole 2>/dev/null || echo "Policy already attached"
    
    # Attach SES permissions
    aws iam put-role-policy \
        --role-name $ROLE_NAME \
        --policy-name SESPermissions \
        --policy-document '{
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "ses:SendEmail",
                        "ses:SendRawEmail"
                    ],
                    "Resource": "*"
                }
            ]
        }' 2>/dev/null || echo "SES policy already attached"
    
    # Get role ARN
    ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text)
    
    # Create function
    aws lambda create-function \
        --function-name $FUNCTION_NAME \
        --runtime $RUNTIME \
        --role $ROLE_ARN \
        --handler $HANDLER \
        --zip-file fileb://package.zip \
        --region $REGION \
        --timeout 30 \
        --memory-size 128 \
        --environment Variables='{
            "FROM_EMAIL": "noreply@gill-photography.com.au",
            "TO_EMAIL": "gill@gill-photography.com.au"
        }'
    
    echo "✅ Function created successfully!"
else
    echo "🔄 Updating existing Lambda function..."
    
    # Update function code
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb://package.zip \
        --region $REGION
    
    # Update function configuration
    aws lambda update-function-configuration \
        --function-name $FUNCTION_NAME \
        --region $REGION \
        --timeout 30 \
        --memory-size 128 \
        --environment Variables='{
            "FROM_EMAIL": "noreply@gill-photography.com.au",
            "TO_EMAIL": "gill@gill-photography.com.au"
        }'
    
    echo "✅ Function updated successfully!"
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Create API Gateway endpoint"
echo "   2. Update your website form action URL"
echo "   3. Test the contact form"
echo ""
echo "🔗 API Gateway URL format:"
echo "   https://[api-id].execute-api.$REGION.amazonaws.com/prod/contact"
echo ""
echo "📧 Email configuration:"
echo "   - FROM: noreply@gill-photography.com.au"
echo "   - TO: gill@gill-photography.com.au"
echo ""
echo "✅ All Hindsight Creative references have been updated to Gill Juergens Photography!" 