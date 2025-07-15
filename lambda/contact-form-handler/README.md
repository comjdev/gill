# Contact Form Lambda Function

A simple AWS Lambda function to handle contact form submissions using AWS SES and Handlebars email templates.

## Features

- ✅ AWS SES integration (Sydney region)
- ✅ Handlebars email templates (HTML + Text)
- ✅ Separate template file for easy customization
- ✅ Environment variables for reusability
- ✅ CORS support
- ✅ Input validation
- ✅ Professional email styling
- ✅ Australian timezone support

## File Structure

```
lambda/contact-form-handler/
├── index.js          # Main Lambda function
├── templates.js      # Email templates (HTML & Text)
├── package.json      # Dependencies
├── test-event.json   # Test event for AWS console
└── README.md         # This file
```

## Environment Variables

Set these in your Lambda function configuration:

| Variable     | Description                          | Example                  |
| ------------ | ------------------------------------ | ------------------------ |
| `FROM_EMAIL` | Verified SES email to send from      | `noreply@yourdomain.com` |
| `TO_EMAIL`   | Email address to receive submissions | `contact@yourdomain.com` |
| `CC_EMAIL`   | Optional CC email address            | `admin@yourdomain.com`   |

## Setup Instructions

### 1. Install Dependencies

```bash
cd lambda/contact-form-handler
npm install --production
```

### 2. Create Deployment Package

```bash
zip -r contact-form-handler.zip index.js templates.js node_modules/
```

### 3. Create Lambda Function

1. Go to AWS Lambda Console
2. Click "Create function"
3. Choose "Author from scratch"
4. Name: `contact-form-handler`
5. Runtime: `Node.js 18.x`
6. Click "Create function"

### 4. Upload Code

1. In Lambda console, go to "Code" tab
2. Click "Upload from" → ".zip file"
3. Upload `contact-form-handler.zip`
4. Click "Save"

### 5. Configure Environment Variables

1. Go to "Configuration" → "Environment variables"
2. Add the following variables:
   - `FROM_EMAIL`: Your verified SES email
   - `TO_EMAIL`: Where to send contact form emails
   - `CC_EMAIL`: Optional CC email (optional)

### 6. Set Up IAM Permissions

Add this policy to your Lambda execution role:

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

### 7. Create API Gateway

1. Go to API Gateway Console
2. Create new REST API
3. Create resource `/contact`
4. Create POST method
5. Integrate with your Lambda function
6. Deploy the API

### 8. Verify SES Emails

Make sure all email addresses are verified in AWS SES (Sydney region).

## Email Templates

The email templates are stored in `templates.js` for easy customization:

### HTML Template Features

- Professional styling with CSS
- Responsive design
- Color-coded sections
- Australian timezone formatting
- Clean typography
- Background styling for better presentation

### Template Variables

- `{{name}}` - Contact form name
- `{{email}}` - Contact form email
- `{{subject}}` - Contact form subject
- `{{message}}` - Contact form message
- `{{timestamp}}` - Formatted timestamp (Sydney time)

### Customizing Templates

To modify the email appearance, edit the `templates.js` file:

- Change colors in the CSS
- Modify layout structure
- Add new template variables
- Update styling for different email clients

## Testing

Test with this JSON payload:

```json
{
	"name": "John Doe",
	"email": "john@example.com",
	"subject": "Website Inquiry",
	"message": "Hello, I'm interested in your services. Please contact me."
}
```

## Response Format

### Success Response

```json
{
	"success": true,
	"message": "Message sent successfully!"
}
```

### Error Response

```json
{
	"error": "All fields are required",
	"success": false
}
```

## Reusability

This function is designed to be reusable across projects:

1. **Environment Variables**: Change emails without code modification
2. **Template System**: Easy to customize email appearance in `templates.js`
3. **Region Configurable**: Set to Sydney by default
4. **Clean Code**: Well-structured and documented
5. **Separate Templates**: Email styling is isolated for easy maintenance

## Customization

### Change Email Template

Edit the `templates.js` file to modify:

- HTML structure and styling
- Text email format
- Colors and layout
- Template variables

### Add More Fields

1. Update validation in `index.js`
2. Add new template variables to `templates.js`
3. Update both HTML and text templates

### Change Styling

Modify the CSS in the `htmlTemplate` variable in `templates.js`

## Troubleshooting

### Common Issues

1. **SES not verified**: Ensure all emails are verified in SES
2. **Wrong region**: Function uses Sydney region (`ap-southeast-2`)
3. **Missing permissions**: Check IAM role has SES permissions
4. **Invalid email format**: Check email validation regex
5. **Template errors**: Verify `templates.js` is included in ZIP file

### Logs

Check CloudWatch logs for detailed error information.
