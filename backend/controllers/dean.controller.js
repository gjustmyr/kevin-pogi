const db = require("../models");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/email");

// Generate random password
const generateRandomPassword = (length = 12) => {
	const charset =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
	let password = "";
	for (let i = 0; i < length; i++) {
		password += charset.charAt(Math.floor(Math.random() * charset.length));
	}
	return password;
};

// Send dean credentials email
const sendDeanCredentials = async (email, firstName, password) => {
	const subject = "Your Dean Account Credentials - Commission System";
	const text = `Hello ${firstName},\n\nYour dean account has been created.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after logging in.\n\nBest regards,\nCommission System`;
	const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Open Sans', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .credentials { background: white; border-left: 4px solid #16a34a; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .credential-item { margin: 10px 0; }
        .credential-label { font-weight: bold; color: #16a34a; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Dean Account Created</h1>
        </div>
        <div class="content">
          <p>Hello <strong>${firstName}</strong>,</p>
          <p>Your dean account has been successfully created in the Commission System.</p>
          
          <div class="credentials">
            <div class="credential-item">
              <span class="credential-label">Email:</span> ${email}
            </div>
            <div class="credential-item">
              <span class="credential-label">Temporary Password:</span> ${password}
            </div>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> Please change your password immediately after your first login for security purposes.
          </div>
          
          <p>You can now log in to the Commission System using these credentials.</p>
          
          <p>Best regards,<br>Commission System Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

	await sendEmail(email, subject, text, html);
};

// Get all deans with pagination
exports.getDeans = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const offset = (page - 1) * limit;

		const { count, rows } = await db.Dean.findAndCountAll({
			include: [
				{
					model: db.User,
					as: "user",
					attributes: ["user_id", "email", "role"],
				},
				{
					model: db.Department,
					as: "department",
					attributes: ["department_id", "department_name"],
				},
			],
			limit,
			offset,
			order: [["createdAt", "DESC"]],
		});

		res.json({
			deans: rows,
			currentPage: page,
			totalPages: Math.ceil(count / limit),
			totalItems: count,
		});
	} catch (error) {
		console.error("Get deans error:", error);
		res.status(500).json({ message: "Error fetching deans" });
	}
};

// Create dean
exports.createDean = async (req, res) => {
	try {
		const {
			email,
			first_name,
			middle_name,
			last_name,
			contact_number,
			department_id,
		} = req.body;

		// Check if user already exists
		const existingUser = await db.User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: "Email already exists" });
		}

		// Generate random password
		const plainPassword = generateRandomPassword();
		const hashedPassword = await bcrypt.hash(plainPassword, 10);

		// Create user
		const user = await db.User.create({
			email,
			password: hashedPassword,
			role: "dean",
		});

		// Create dean profile
		const dean = await db.Dean.create({
			user_id: user.user_id,
			first_name,
			middle_name,
			last_name,
			contact_number,
			department_id,
		});

		// Send credentials email
		await sendDeanCredentials(email, first_name, plainPassword);

		// Fetch complete dean data
		const completeDean = await db.Dean.findOne({
			where: { dean_id: dean.dean_id },
			include: [
				{
					model: db.User,
					as: "user",
					attributes: ["user_id", "email", "role"],
				},
				{
					model: db.Department,
					as: "department",
					attributes: ["department_id", "department_name"],
				},
			],
		});

		res.status(201).json({
			message: "Dean created successfully",
			dean: completeDean,
		});
	} catch (error) {
		console.error("Create dean error:", error);
		res.status(500).json({ message: "Error creating dean" });
	}
};

// Update dean
exports.updateDean = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			first_name,
			middle_name,
			last_name,
			contact_number,
			department_id,
			email,
		} = req.body;

		const dean = await db.Dean.findByPk(id);
		if (!dean) {
			return res.status(404).json({ message: "Dean not found" });
		}

		// Update dean profile
		await dean.update({
			first_name,
			middle_name,
			last_name,
			contact_number,
			department_id,
		});

		// Update email if changed
		if (email) {
			await db.User.update({ email }, { where: { user_id: dean.user_id } });
		}

		// Fetch updated dean data
		const updatedDean = await db.Dean.findOne({
			where: { dean_id: id },
			include: [
				{
					model: db.User,
					as: "user",
					attributes: ["user_id", "email", "role"],
				},
				{
					model: db.Department,
					as: "department",
					attributes: ["department_id", "department_name"],
				},
			],
		});

		res.json({
			message: "Dean updated successfully",
			dean: updatedDean,
		});
	} catch (error) {
		console.error("Update dean error:", error);
		res.status(500).json({ message: "Error updating dean" });
	}
};

// Delete dean
exports.deleteDean = async (req, res) => {
	try {
		const { id } = req.params;

		const dean = await db.Dean.findByPk(id);
		if (!dean) {
			return res.status(404).json({ message: "Dean not found" });
		}

		const userId = dean.user_id;

		// Delete dean profile
		await dean.destroy();

		// Delete user account
		await db.User.destroy({ where: { user_id: userId } });

		res.json({ message: "Dean deleted successfully" });
	} catch (error) {
		console.error("Delete dean error:", error);
		res.status(500).json({ message: "Error deleting dean" });
	}
};

// Get departments for dropdown
exports.getDepartments = async (req, res) => {
	try {
		const departments = await db.Department.findAll({
			attributes: ["department_id", "department_name"],
			order: [["department_name", "ASC"]],
		});

		res.json(departments);
	} catch (error) {
		console.error("Get departments error:", error);
		res.status(500).json({ message: "Error fetching departments" });
	}
};
