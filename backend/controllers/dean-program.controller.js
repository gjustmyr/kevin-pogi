const db = require("../models");
const { Op } = require("sequelize");

// Get all programs for dean's department
exports.getPrograms = async (req, res) => {
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
      whereClause.program_name = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await db.Program.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["program_name", "ASC"]],
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
      programs: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    });
  } catch (error) {
    console.error("Get programs error:", error);
    res.status(500).json({ message: "Error fetching programs" });
  }
};

// Create program
exports.createProgram = async (req, res) => {
  try {
    const deanId = req.user.user_id;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const { program_name, program_acronym } = req.body;

    if (!program_name) {
      return res.status(400).json({
        message: "Program name is required",
      });
    }

    // Check if program name already exists in department
    const existingProgram = await db.Program.findOne({
      where: {
        program_name,
        department_id: dean.department_id,
      },
    });

    if (existingProgram) {
      return res.status(400).json({
        message: "Program name already exists in your department",
      });
    }

    // Create program
    const program = await db.Program.create({
      program_name,
      program_acronym,
      department_id: dean.department_id,
    });

    res.status(201).json({
      message: "Program created successfully",
      program,
    });
  } catch (error) {
    console.error("Create program error:", error);
    res.status(500).json({ message: "Error creating program" });
  }
};

// Update program
exports.updateProgram = async (req, res) => {
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

    const { program_name, program_acronym } = req.body;

    if (!program_name) {
      return res.status(400).json({
        message: "Program name is required",
      });
    }

    // Find program
    const program = await db.Program.findOne({
      where: {
        program_id: id,
        department_id: dean.department_id,
      },
    });

    if (!program) {
      return res.status(404).json({
        message:
          "Program not found or you don't have permission to update it",
      });
    }

    // Check if new program name conflicts with existing program
    if (program_name !== program.program_name) {
      const existingProgram = await db.Program.findOne({
        where: {
          program_name,
          department_id: dean.department_id,
          program_id: { [Op.ne]: id },
        },
      });

      if (existingProgram) {
        return res.status(400).json({
          message: "Program name already exists in your department",
        });
      }
    }

    // Update program
    await program.update({
      program_name,
      program_acronym,
    });

    res.json({
      message: "Program updated successfully",
      program,
    });
  } catch (error) {
    console.error("Update program error:", error);
    res.status(500).json({ message: "Error updating program" });
  }
};

// Delete program
exports.deleteProgram = async (req, res) => {
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

    // Find program
    const program = await db.Program.findOne({
      where: {
        program_id: id,
        department_id: dean.department_id,
      },
    });

    if (!program) {
      return res.status(404).json({
        message:
          "Program not found or you don't have permission to delete it",
      });
    }

    // Check if program has associated sections
    const sectionCount = await db.Section.count({
      where: { program_id: id },
    });

    if (sectionCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete program with existing sections. Please delete sections first.",
      });
    }

    // Delete program
    await program.destroy();

    res.json({
      message: "Program deleted successfully",
    });
  } catch (error) {
    console.error("Delete program error:", error);
    res.status(500).json({ message: "Error deleting program" });
  }
};
