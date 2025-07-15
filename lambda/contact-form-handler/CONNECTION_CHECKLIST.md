# Contact Form Handler - Connection Checklist

## Environment Variables Setup

### Required Environment Variables

- [ ] `FROM_EMAIL` = `noreply@gill-photography.com.au`
- [ ] `TO_EMAIL` = `gill@gill-photography.com.au`
- [ ] `CC_EMAIL` = (optional - for additional recipients)
- [ ] `AWS_REGION` = `ap-southeast-2` (or your preferred region)

### SES Configuration

- [ ] SES domain verified: `gill-photography.com.au`
- [ ] SES email addresses verified:
- [ ] `noreply@gill-photography.com.au`
- [ ] `gill@gill-photography.com.au`
- [ ] SES out of sandbox mode (if sending to non-verified emails)

### API Gateway Configuration

- [ ] API Gateway endpoint created
- [ ] CORS enabled for your domain
- [ ] Lambda function integrated
- [ ] POST method configured
- [ ] Request/Response mapping templates set up

### Lambda Function Configuration

- [ ] Function deployed with correct environment variables
- [ ] IAM role with SES permissions
- [ ] Timeout set to 30 seconds
- [ ] Memory allocated appropriately (128MB should be sufficient)

### Frontend Integration

- [ ] Form action URL updated in `themes/gill/layout/contact.ejs`:
  ```html
  <form id="contactForm" action="YOUR_API_GATEWAY_URL" method="POST"></form>
  ```
- [ ] JavaScript form handler updated in `themes/gill/source/js/main.js`
- [ ] Form validation implemented
- [ ] Success/error handling configured

### Testing Checklist

- [ ] Test form submission with valid data
- [ ] Test form validation with invalid data
- [ ] Test email delivery to `gill@gill-photography.com.au`
- [ ] Test CORS headers for cross-origin requests
- [ ] Test error handling and user feedback

### Security Considerations

- [ ] Rate limiting configured on API Gateway
- [ ] Input validation implemented
- [ ] CORS properly configured for your domain
- [ ] No sensitive data logged in CloudWatch

### Monitoring

- [ ] CloudWatch logs enabled
- [ ] Error tracking configured
- [ ] Email delivery monitoring set up
