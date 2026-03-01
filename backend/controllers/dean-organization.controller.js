const db = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

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
      department_id: dean.department_id,
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

    const { organization_name, description, faculty_id, email, password } =
      req.body;

    if (!organization_name || !faculty_id || !email || !password) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Organization name, faculty, email, and password are required",
      });
    }

    // Check if faculty exists and belongs to dean's department
    const faculty = await db.Faculty.findOne({
      where: {
        faculty_id,
        department_id: dean.department_id,
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

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
        department_id: dean.department_id,
        faculty_id,
        user_id: user.user_id,
      },
      { transaction },
    );

    await transaction.commit();

    res.status(201).json({
      message: "Organization created successfully",
      organization,
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
        department_id: dean.department_id,
      },
    });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Check if faculty exists and belongs to dean's department
    const faculty = await db.Faculty.findOne({
      where: {
        faculty_id,
        department_id: dean.department_id,
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
        department_id: dean.department_id,
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
