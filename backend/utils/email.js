const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST || "smtp.gmail.com",
	port: process.env.SMTP_PORT || 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

// Send email function
const sendEmail = async (to, subject, text, html) => {
	try {
		const mailOptions = {
			from: `"Commission System" <${process.env.SMTP_USER}>`,
			to,
			subject,
			text,
			html,
		};

		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent: %s", info.messageId);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error("Email error:", error);
		return { success: false, error: error.message };
	}
};

// Send admin credentials email
const sendAdminCredentials = async (email, firstName, password) => {
	const subject = "Your Admin Account Credentials";
	const text = `Hello ${firstName},\n\nYour admin account has been created successfully.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease login and change your password immediately.\n\nBest regards,\nCommission System Team`;
	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<style>
				body { font-family: 'Open Sans', Arial, sans-serif; line-height: 1.6; color: #333; }
				.container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
				.header { background-color: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
				.content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
				.credentials { background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin: 20px 0; }
				.credentials strong { color: #16a34a; }
				.footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
				.warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px; margin: 15px 0; }
			</style>
		</head>
		<body>
			<div class="container">
				<div class="header">
					<h1>Welcome to Commission System</h1>
				</div>
				<div class="content">
					<h2>Hello ${firstName},</h2>
					<p>Your admin account has been created successfully. Below are your login credentials:</p>
					
					<div class="credentials">
						<p><strong>Email:</strong> ${email}</p>
						<p><strong>Password:</strong> ${password}</p>
					</div>

					<div class="warning">
						<strong>⚠️ Important:</strong> Please change your password immediately after your first login for security purposes.
					</div>

					<p>You can now access your dashboard using these credentials.</p>
					
					<p>Best regards,<br>Commission System Team</p>
				</div>
				<div class="footer">
					<p>This is an automated message. Please do not reply to this email.</p>
				</div>
			</div>
		</body>
		</html>
	`;

	return await sendEmail(email, subject, text, html);
};

module.exports = {
	sendEmail,
	sendAdminCredentials,
};
