const db = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { sendAccountCredentials } = require("../utils/email");

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

// Get all organizations for dean's department
exports.getOrganizations = async (req, res) => {
  try {
    const deanId = req.user.user_id;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    const whereClause = {
      department: dean.department,
    };

    if (search) {
      whereClause.organization_name = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await db.Organization.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["organization_name", "ASC"]],
      include: [
        {
          model: db.Faculty,
          attributes: [
            "faculty_id",
            "employee_id",
            "first_name",
            "middle_name",
            "last_name",
            "email",
          ],
        },
      ],
    });

    res.json({
      organizations: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    });
  } catch (error) {
    console.error("Get organizations error:", error);
    res.status(500).json({ message: "Error fetching organizations" });
  }
};

// Create organization
exports.createOrganization = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const deanId = req.user.user_id;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanId },
    });

    if (!dean) {
      await transaction.rollback();
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const { organization_name, description, faculty_id, email } = req.body;

    if (!organization_name || !faculty_id || !email) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Organization name, faculty, and email are required",
      });
    }

    // Check if faculty exists and belongs to dean's department
    const faculty = await db.Faculty.findOne({
      where: {
        faculty_id,
        department: dean.department,
      },
    });

    if (!faculty) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Faculty not found in your department",
      });
    }

    // Check if faculty is already assigned to an organization
    const existingOrg = await db.Organization.findOne({
      where: { faculty_id },
    });

    if (existingOrg) {
      await transaction.rollback();
      return res.status(400).json({
        message: "This faculty is already assigned to an organization",
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

    // Generate secure password
    const generatedPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Create user account
    const user = await db.User.create(
      {
        email,
        password: hashedPassword,
        role: "organization",
      },
      { transaction },
    );

    // Create organization
    const organization = await db.Organization.create(
      {
        organization_name,
        description,
        department: dean.department,
        faculty_id,
        user_id: user.user_id,
      },
      { transaction },
    );

    await transaction.commit();

    // Send credentials via email (non-blocking)
    let emailSent = false;
    try {
      const emailResult = await sendAccountCredentials(
        email,
        organization_name,
        generatedPassword,
        "organization",
      );
      emailSent = emailResult.success;

      if (!emailResult.success) {
        console.error("Failed to send email:", emailResult.error);
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError);
    }

    res.status(201).json({
      message: "Organization created successfully",
      organization,
      emailSent,
      generatedPassword: !emailSent ? generatedPassword : undefined,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Create organization error:", error);
    res.status(500).json({ message: "Error creating organization" });
  }
};

// Update organization
exports.updateOrganization = async (req, res) => {
  try {
    const deanId = req.user.user_id;
    const { id } = req.params;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const { organization_name, description, faculty_id } = req.body;

    const organization = await db.Organization.findOne({
      where: {
        organization_id: id,
        department: dean.department,
      },
    });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if faculty exists and belongs to dean's department
    const faculty = await db.Faculty.findOne({
      where: {
        faculty_id,
        department: dean.department,
      },
    });

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found in your department",
      });
    }

    // Check if faculty is being changed and if new faculty is already assigned
    if (faculty_id !== organization.faculty_id) {
      const existingOrg = await db.Organization.findOne({
        where: {
          faculty_id,
          organization_id: { [Op.ne]: id },
        },
      });

      if (existingOrg) {
        return res.status(400).json({
          message: "This faculty is already assigned to another organization",
        });
      }
    }

    // Update organization
    await organization.update({
      organization_name,
      description,
      faculty_id,
    });

    res.json({
      message: "Organization updated successfully",
      organization,
    });
  } catch (error) {
    console.error("Update organization error:", error);
    res.status(500).json({ message: "Error updating organization" });
  }
};

// Delete organization
exports.deleteOrganization = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const deanId = req.user.user_id;
    const { id } = req.params;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanId },
    });

    if (!dean) {
      await transaction.rollback();
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const organization = await db.Organization.findOne({
      where: {
        organization_id: id,
        department: dean.department,
      },
    });

    if (!organization) {
      await transaction.rollback();
      return res.status(404).json({ message: "Organization not found" });
    }

    // Delete user account
    await db.User.destroy({
      where: { user_id: organization.user_id },
      transaction,
    });

    // Delete organization
    await organization.destroy({ transaction });

    await transaction.commit();

    res.json({ message: "Organization deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Delete organization error:", error);
    res.status(500).json({ message: "Error deleting organization" });
  }
};
