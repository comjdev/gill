const Handlebars = require("handlebars");

// HTML Email Template
const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 20px; 
            background-color: #f4f4f4;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #fff; 
            border-radius: 8px; 
            overflow: hidden; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        .header { 
            background: #2c3e50; 
            color: white; 
            padding: 30px; 
            text-align: center; 
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 24px;
        }
        .header p {
            margin: 0;
            opacity: 0.9;
        }
        .content { 
            padding: 30px; 
        }
        .field { 
            margin-bottom: 20px; 
        }
        .label { 
            font-weight: bold; 
            color: #555; 
            margin-bottom: 5px; 
            font-size: 14px;
        }
        .value { 
            background: #f8f9fa; 
            padding: 12px; 
            border-radius: 4px; 
            border-left: 4px solid #3498db; 
            font-size: 14px;
        }
        .message-box { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 4px; 
            white-space: pre-wrap; 
            border-left: 4px solid #e74c3c; 
            font-size: 14px;
            line-height: 1.5;
        }
        .footer { 
            background: #ecf0f1; 
            padding: 20px; 
            text-align: center; 
            color: #7f8c8d; 
            font-size: 12px; 
        }
        .timestamp {
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Contact Form Submission</h1>
            <p>A new message has been submitted through your website contact form.</p>
        </div>
        
        <div class="content">
            <div class="field">
                <div class="label">Name:</div>
                <div class="value">{{name}}</div>
            </div>
            
            <div class="field">
                <div class="label">Email:</div>
                <div class="value">{{email}}</div>
            </div>
            
            <div class="field">
                <div class="label">Subject:</div>
                <div class="value">{{subject}}</div>
            </div>
            
            <div class="field">
                <div class="label">Message:</div>
                <div class="message-box">{{message}}</div>
            </div>
        </div>
        
        <div class="footer">
            <p>This message was sent from your website contact form at <span class="timestamp">{{timestamp}}</span></p>
        </div>
    </div>
</body>
</html>
`;

// Text Email Template
const textTemplate = `
New Contact Form Submission

Name: {{name}}
Email: {{email}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your website contact form at {{timestamp}}
`;

// Compile templates
const emailTemplate = Handlebars.compile(htmlTemplate);
const textEmailTemplate = Handlebars.compile(textTemplate);

module.exports = {
	emailTemplate,
	textEmailTemplate,
};
