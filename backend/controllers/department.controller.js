const db = require("../models");
const { Op } = require("sequelize");

// Get all departments with pagination and search
exports.getDepartments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    const whereClause = search
      ? {
          [Op.or]: [
            {
              department_name: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              department_acronym: {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        }
      : {};

    const { count, rows } = await db.Department.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["department_name", "ASC"]],
    });

    res.json({
      departments: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    });
  } catch (error) {
    console.error("Get departments error:", error);
    res.status(500).json({ message: "Error fetching departments" });
  }
};

// Get all active departments (for dropdowns)
exports.getActiveDepartments = async (req, res) => {
  try {
    const departments = await db.Department.findAll({
      where: { status: "enabled" },
      attributes: ["department_id", "department_name"],
      order: [["department_name", "ASC"]],
    });

    res.json(departments);
  } catch (error) {
    console.error("Get active departments error:", error);
    res.status(500).json({ message: "Error fetching active departments" });
  }
};

// Create department
exports.createDepartment = async (req, res) => {
  try {
    const { department_name, department_acronym, status } = req.body;

    if (!department_name || !department_acronym) {
      return res.status(400).json({
        message: "Department name and acronym are required",
      });
    }

    // Check if department already exists
    const existingDepartment = await db.Department.findOne({
      where: {
        [Op.or]: [{ department_name }, { department_acronym }],
      },
    });

    if (existingDepartment) {
      if (existingDepartment.department_name === department_name) {
        return res
          .status(400)
          .json({ message: "Department name already exists" });
      }
      if (existingDepartment.department_acronym === department_acronym) {
        return res
          .status(400)
          .json({ message: "Department acronym already exists" });
      }
    }

    const department = await db.Department.create({
      department_name,
      department_acronym,
      status: status || "enabled",
    });

    res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    console.error("Create department error:", error);
    res.status(500).json({ message: "Error creating department" });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { department_name, department_acronym, status } = req.body;

    const department = await db.Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Check if new name or acronym conflicts with existing department
    if (
      department_name !== department.department_name ||
      department_acronym !== department.department_acronym
    ) {
      const existingDepartment = await db.Department.findOne({
        where: {
          [Op.or]: [{ department_name }, { department_acronym }],
          department_id: { [Op.ne]: id },
        },
      });

      if (existingDepartment) {
        if (existingDepartment.department_name === department_name) {
          return res
            .status(400)
            .json({ message: "Department name already exists" });
        }
        if (existingDepartment.department_acronym === department_acronym) {
          return res
            .status(400)
            .json({ message: "Department acronym already exists" });
        }
      }
    }

    await department.update({
      department_name,
      department_acronym,
      status,
    });

    res.json({
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    console.error("Update department error:", error);
    res.status(500).json({ message: "Error updating department" });
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await db.Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Check if department has associated deans
    const deanCount = await db.Dean.count({
      where: { department_id: id },
    });

    if (deanCount > 0) {
      return res.status(400).json({
        message: `Cannot delete department. ${deanCount} dean(s) are assigned to this department.`,
      });
    }

    await department.destroy();

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Delete department error:", error);
    res.status(500).json({ message: "Error deleting department" });
  }
};
