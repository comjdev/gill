const AWS = require("aws-sdk");
const { emailTemplate, textEmailTemplate } = require("./templates");

// Initialize SES with Sydney region
const ses = new AWS.SES({ region: "ap-southeast-2" });

exports.handler = async (event) => {
	// CORS headers
	const headers = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Allow-Methods": "POST,OPTIONS",
		"Content-Type": "application/json",
	};

	// Handle preflight requests
	if (event.httpMethod === "OPTIONS") {
		return { statusCode: 200, headers, body: "" };
	}

	try {
		// Parse form data
		const body = JSON.parse(event.body);
		const { name, email, subject, message } = body;

		// Validation
		if (!name || !email || !subject || !message) {
			return {
				statusCode: 400,
				headers,
				body: JSON.stringify({
					error: "All fields are required",
					success: false,
				}),
			};
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return {
				statusCode: 400,
				headers,
				body: JSON.stringify({
					error: "Invalid email address",
					success: false,
				}),
			};
		}

		// Get environment variables
		const fromEmail = process.env.FROM_EMAIL || "noreply@hindsight.com.au";
		const toEmail = process.env.TO_EMAIL || "studio@hindsight.com.au";
		const ccEmail = process.env.CC_EMAIL;

		// Prepare template data
		const templateData = {
			name: name.trim(),
			email: email.trim(),
			subject: subject.trim(),
			message: message.trim(),
			timestamp: new Date().toLocaleString("en-AU", {
				timeZone: "Australia/Sydney",
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			}),
		};

		// Generate email content using templates
		const htmlContent = emailTemplate(templateData);
		const textContent = textEmailTemplate(templateData);

		// Prepare email parameters
		const emailParams = {
			Source: fromEmail,
			Destination: {
				ToAddresses: [toEmail],
			},
			Message: {
				Subject: {
					Data: `Contact Form: ${subject}`,
					Charset: "UTF-8",
				},
				Body: {
					Html: {
						Data: htmlContent,
						Charset: "UTF-8",
					},
					Text: {
						Data: textContent,
						Charset: "UTF-8",
					},
				},
			},
		};

		// Add CC if specified
		if (ccEmail) {
			emailParams.Destination.CcAddresses = [ccEmail];
		}

		// Send email
		await ses.sendEmail(emailParams).promise();

		return {
			statusCode: 200,
			headers,
			body: JSON.stringify({
				success: true,
				message: "Message sent successfully!",
			}),
		};
	} catch (error) {
		console.error("Error sending email:", error);

		return {
			statusCode: 500,
			headers,
			body: JSON.stringify({
				error: "Failed to send message. Please try again later.",
				success: false,
			}),
		};
	}
};
