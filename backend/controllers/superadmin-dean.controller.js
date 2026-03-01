const db = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { sendEmail } = require("../utils/email");

// Generate secure random password
const generatePassword = () => {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Generate 5-digit employee ID
const generateEmployeeId = async () => {
  let employeeId;
  let exists = true;

  while (exists) {
    // Generate random 5-digit number
    employeeId = Math.floor(10000 + Math.random() * 90000).toString();

    // Check if it already exists
    const existing = await db.Dean.findOne({
      where: { employee_id: employeeId },
    });
    exists = !!existing;
  }

  return employeeId;
};

// Send dean credentials email
const sendDeanCredentials = async (email, firstName, password) => {
  const subject = "🎓 Your Dean Account Credentials - Commission System";
  const text = `Hello ${firstName},\n\nYour dean account has been created successfully.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease login and change your password immediately.\n\nBest regards,\nCommission System Team`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
        }
        .email-wrapper {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .header {
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          opacity: 0.3;
        }
        .header-content {
          position: relative;
          z-index: 1;
        }
        .logo {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .header p {
          font-size: 16px;
          margin-top: 8px;
          opacity: 0.95;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .message {
          font-size: 16px;
          color: #4b5563;
          margin-bottom: 30px;
          line-height: 1.8;
        }
        .credentials-box {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border-left: 5px solid #dc2626;
          border-radius: 12px;
          padding: 25px;
          margin: 30px 0;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
        }
        .credentials-box h3 {
          color: #dc2626;
          font-size: 18px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .credential-item {
          background: white;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .credential-item:last-child {
          margin-bottom: 0;
        }
        .credential-label {
          font-weight: 600;
          color: #6b7280;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .credential-value {
          font-family: 'Courier New', monospace;
          font-size: 16px;
          color: #1f2937;
          font-weight: 600;
          background: #f9fafb;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }
        .warning-box {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-left: 5px solid #f59e0b;
          border-radius: 12px;
          padding: 20px;
          margin: 25px 0;
          display: flex;
          gap: 15px;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
        }
        .warning-icon {
          font-size: 24px;
          flex-shrink: 0;
        }
        .warning-text {
          color: #92400e;
          font-size: 14px;
          line-height: 1.6;
        }
        .warning-text strong {
          display: block;
          font-size: 16px;
          margin-bottom: 5px;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          color: white;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          transition: transform 0.2s;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
        }
        .footer {
          background: #f9fafb;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        .footer-text {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 15px;
        }
        .footer-links {
          margin-top: 15px;
        }
        .footer-link {
          color: #dc2626;
          text-decoration: none;
          margin: 0 10px;
          font-size: 13px;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e5e7eb, transparent);
          margin: 30px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <div class="header-content">
            <div class="logo">🎓</div>
            <h1>Welcome to Commission System</h1>
            <p>Your Dean Account is Ready</p>
          </div>
        </div>
        
        <div class="content">
          <div class="greeting">Hello ${firstName}! 👋</div>
          
          <p class="message">
            We're excited to have you on board! Your dean account has been successfully created. 
            You now have access to the Commission System dashboard where you can manage your department's activities.
          </p>

          <div class="credentials-box">
            <h3>🔐 Your Login Credentials</h3>
            <div class="credential-item">
              <span class="credential-label">Email Address</span>
              <span class="credential-value">${email}</span>
            </div>
            <div class="credential-item">
              <span class="credential-label">Temporary Password</span>
              <span class="credential-value">${password}</span>
            </div>
          </div>

          <div class="warning-box">
            <div class="warning-icon">⚠️</div>
            <div class="warning-text">
              <strong>Important Security Notice</strong>
              For your account security, please change your password immediately after your first login. 
              Never share your credentials with anyone.
            </div>
          </div>

          <div class="divider"></div>

          <p class="message">
            <strong>What's Next?</strong><br>
            Log in to your dashboard and explore the features available to you. If you have any questions 
            or need assistance, don't hesitate to reach out to our support team.
          </p>

          <p class="message" style="margin-top: 30px; color: #6b7280;">
            Best regards,<br>
            <strong style="color: #1f2937;">Commission System Team</strong>
          </p>
        </div>

        <div class="footer">
          <p class="footer-text">
            This is an automated message. Please do not reply to this email.
          </p>
          <p class="footer-text" style="font-size: 12px; color: #9ca3af;">
            © 2026 Commission System. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(email, subject, text, html);
};

// Get all deans with pagination
exports.getDeans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const department_id = req.query.department_id;

    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    if (department_id) {
      whereClause.department_id = department_id;
    }

    const { count, rows } = await db.Dean.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["last_name", "ASC"]],
      include: [
        {
          model: db.Department,
          attributes: [
            "department_id",
            "department_name",
            "department_acronym",
          ],
        },
      ],
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
  const transaction = await db.sequelize.transaction();

  try {
    const {
      employee_id,
      first_name,
      middle_name,
      last_name,
      email,
      contact_number,
      department_id,
    } = req.body;

    if (!employee_id || !first_name || !last_name || !email || !department_id) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Employee ID, first name, last name, email, and department are required",
      });
    }

    // Validate employee_id is 5 digits
    if (!/^\d{5}$/.test(employee_id)) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Employee ID must be exactly 5 digits",
      });
    }

    // Check if employee_id already exists
    const existingEmployeeId = await db.Dean.findOne({
      where: { employee_id },
    });
    if (existingEmployeeId) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Employee ID already exists",
      });
    }

    // Check if email already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Check if department exists
    const department = await db.Department.findByPk(department_id);
    if (!department) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Department not found",
      });
    }

    // Check if department already has a dean
    const existingDean = await db.Dean.findOne({
      where: { department_id },
    });
    if (existingDean) {
      await transaction.rollback();
      return res.status(400).json({
        message: "This department already has a dean assigned",
      });
    }

    // Generate employee ID and secure password
    const generatedPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Create user account
    const user = await db.User.create(
      {
        email,
        password: hashedPassword,
        role: "dean",
      },
      { transaction },
    );

    // Create dean profile
    const dean = await db.Dean.create(
      {
        employee_id,
        first_name,
        middle_name,
        last_name,
        email,
        contact_number,
        department_id,
        user_id: user.user_id,
      },
      { transaction },
    );

    await transaction.commit();

    // Send credentials via email (non-blocking, won't fail the request)
    let emailSent = false;
    try {
      const emailResult = await sendDeanCredentials(
        email,
        first_name,
        generatedPassword,
      );
      emailSent = emailResult.success;

      if (!emailResult.success) {
        console.error("Failed to send email:", emailResult.error);
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError);
    }

    res.status(201).json({
      message: "Dean created successfully",
      dean,
      emailSent,
      generatedPassword: !emailSent ? generatedPassword : undefined, // Return password if email failed
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Create dean error:", error);
    res.status(500).json({ message: "Error creating dean" });
  }
};

// Update dean
exports.updateDean = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      employee_id,
      first_name,
      middle_name,
      last_name,
      email,
      contact_number,
      department_id,
    } = req.body;

    const dean = await db.Dean.findByPk(id);
    if (!dean) {
      return res.status(404).json({ message: "Dean not found" });
    }

    // Validate employee_id is 5 digits
    if (!/^\d{5}$/.test(employee_id)) {
      return res.status(400).json({
        message: "Employee ID must be exactly 5 digits",
      });
    }

    // Check if employee_id is being changed and if it already exists
    if (employee_id !== dean.employee_id) {
      const existingEmployeeId = await db.Dean.findOne({
        where: {
          employee_id,
          dean_id: { [Op.ne]: id },
        },
      });
      if (existingEmployeeId) {
        return res.status(400).json({
          message: "Employee ID already exists",
        });
      }
    }

    // Check if email is being changed and if it already exists
    if (email !== dean.email) {
      const existingUser = await db.User.findOne({
        where: {
          email,
          user_id: { [Op.ne]: dean.user_id },
        },
      });
      if (existingUser) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }
    }

    // Check if department is being changed and if new department already has a dean
    if (department_id !== dean.department_id) {
      const existingDean = await db.Dean.findOne({
        where: {
          department_id,
          dean_id: { [Op.ne]: id },
        },
      });
      if (existingDean) {
        return res.status(400).json({
          message: "This department already has a dean assigned",
        });
      }
    }

    // Update dean
    await dean.update({
      employee_id,
      first_name,
      middle_name,
      last_name,
      email,
      contact_number,
      department_id,
    });

    // Update user email if changed
    if (email !== dean.email) {
      await db.User.update({ email }, { where: { user_id: dean.user_id } });
    }

    res.json({
      message: "Dean updated successfully",
      dean,
    });
  } catch (error) {
    console.error("Update dean error:", error);
    res.status(500).json({ message: "Error updating dean" });
  }
};

// Delete dean
exports.deleteDean = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;

    const dean = await db.Dean.findByPk(id);
    if (!dean) {
      await transaction.rollback();
      return res.status(404).json({ message: "Dean not found" });
    }

    // Delete user account
    await db.User.destroy({
      where: { user_id: dean.user_id },
      transaction,
    });

    // Delete dean profile
    await dean.destroy({ transaction });

    await transaction.commit();

    res.json({ message: "Dean deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Delete dean error:", error);
    res.status(500).json({ message: "Error deleting dean" });
  }
};
