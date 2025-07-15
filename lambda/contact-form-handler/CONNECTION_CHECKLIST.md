# Contact Form Connection Checklist

Use this checklist to verify your contact form is properly connected to the Lambda function.

## ✅ Lambda Function Setup

- [ ] Lambda function created in AWS Console
- [ ] Code uploaded (index.js, templates.js, node_modules)
- [ ] Runtime set to Node.js 18.x
- [ ] Handler set to `index.handler`
- [ ] Environment variables configured:
  - [ ] `FROM_EMAIL` = `noreply@hindsight.com.au`
  - [ ] `TO_EMAIL` = `studio@hindsight.com.au`
  - [ ] `CC_EMAIL` = (optional)

## ✅ IAM Permissions

- [ ] Lambda execution role has SES permissions:

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": ["ses:SendEmail", "ses:SendRawEmail"],
			"Resource": "*"
		}
	]
}
```

## ✅ AWS SES Setup

- [ ] Email addresses verified in SES (Sydney region):
  - [ ] `noreply@hindsight.com.au`
  - [ ] `studio@hindsight.com.au`
- [ ] SES is out of sandbox mode (or emails are verified)

## ✅ API Gateway Setup

- [ ] REST API created
- [ ] Resource `/contact` created
- [ ] POST method created
- [ ] Lambda integration configured
- [ ] API deployed to stage (e.g., `prod`)
- [ ] API URL obtained: `https://[api-id].execute-api.ap-southeast-2.amazonaws.com/prod/contact`

## ✅ Website Configuration

- [ ] Form action URL updated in `themes/hindsight/layout/contact.ejs`:
  ```html
  <form action="https://[YOUR-API-GATEWAY-URL]/contact" method="POST"></form>
  ```
- [ ] Form fields have `name` attributes:
  - [ ] `name="name"`
  - [ ] `name="email"`
  - [ ] `name="subject"`
  - [ ] `name="message"`
- [ ] JavaScript form handler updated in `themes/hindsight/source/js/main.js`

## ✅ Testing

### Test 1: Lambda Function Test

- [ ] Use test event in Lambda console:

```json
{
	"httpMethod": "POST",
	"headers": { "Content-Type": "application/json" },
	"body": "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"subject\":\"Test\",\"message\":\"Test message\"}"
}
```

- [ ] Check CloudWatch logs for any errors
- [ ] Verify email received

### Test 2: API Gateway Test

- [ ] Test API Gateway endpoint directly:

```bash
curl -X POST https://[api-id].execute-api.ap-southeast-2.amazonaws.com/prod/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message"}'
```

- [ ] Verify response: `{"success": true, "message": "Message sent successfully!"}`

### Test 3: Website Form Test

- [ ] Fill out contact form on website
- [ ] Submit form
- [ ] Check browser console for errors
- [ ] Verify success message appears
- [ ] Check email received
- [ ] Verify form resets after submission

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**

   - Check API Gateway CORS settings
   - Verify Lambda returns proper CORS headers

2. **403 Forbidden**

   - Check IAM permissions
   - Verify API Gateway integration

3. **500 Internal Server Error**

   - Check CloudWatch logs
   - Verify SES email verification
   - Check environment variables

4. **Form not submitting**

   - Check browser console for JavaScript errors
   - Verify form action URL is correct
   - Check network tab for failed requests

5. **No email received**
   - Check SES console for bounces/rejections
   - Verify email addresses are verified
   - Check Lambda CloudWatch logs

## 📞 Support

If you're still having issues:

1. Check CloudWatch logs for detailed error messages
2. Verify all checklist items are completed
3. Test each component individually (Lambda → API Gateway → Website)
