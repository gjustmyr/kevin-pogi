const db = require("../models");
const { Op } = require("sequelize");

// Get all sections for dean's department programs
exports.getSections = async (req, res) => {
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
    const program_id = req.query.program_id;

    // Get programs for dean's department
    const programs = await db.Program.findAll({
      where: { department_id: dean.department_id },
      attributes: ["program_id"],
    });

    const programIds = programs.map((p) => p.program_id);

    if (programIds.length === 0) {
      return res.json({
        sections: [],
        currentPage: page,
        totalPages: 0,
        totalItems: 0,
      });
    }

    const whereClause = {
      program_id: { [Op.in]: programIds },
    };

    if (search) {
      whereClause.section_name = { [Op.like]: `%${search}%` };
    }

    if (program_id) {
      whereClause.program_id = program_id;
    }

    const { count, rows } = await db.Section.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["section_name", "ASC"]],
      include: [
        {
          model: db.Program,
          attributes: ["program_id", "program_name", "program_acronym"],
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
        },
      ],
    });

    res.json({
      sections: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    });
  } catch (error) {
    console.error("Get sections error:", error);
    res.status(500).json({ message: "Error fetching sections" });
  }
};

// Create section
exports.createSection = async (req, res) => {
  try {
    const deanId = req.user.user_id;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const { section_name, year_level, semester, program_id } = req.body;

    if (!section_name || !year_level || !semester || !program_id) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if program belongs to dean's department
    const program = await db.Program.findOne({
      where: {
        program_id,
        department_id: dean.department_id,
      },
    });

    if (!program) {
      return res.status(404).json({
        message: "Program not found in your department",
      });
    }

    // Create section
    const section = await db.Section.create({
      section_name,
      year_level,
      semester,
      program_id,
    });

    res.status(201).json({
      message: "Section created successfully",
      section,
    });
  } catch (error) {
    console.error("Create section error:", error);
    res.status(500).json({ message: "Error creating section" });
  }
};

// Update section
exports.updateSection = async (req, res) => {
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

    const { section_name, year_level, semester, program_id } = req.body;

    // Check if program belongs to dean's department
    const program = await db.Program.findOne({
      where: {
        program_id,
        department_id: dean.department_id,
      },
    });

    if (!program) {
      return res.status(404).json({
        message: "Program not found in your department",
      });
    }

    const section = await db.Section.findByPk(id);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Verify section belongs to dean's department programs
    const sectionProgram = await db.Program.findOne({
      where: {
        program_id: section.program_id,
        department_id: dean.department_id,
      },
    });

    if (!sectionProgram) {
      return res.status(403).json({
        message: "You don't have permission to update this section",
      });
    }

    // Update section
    await section.update({
      section_name,
      year_level,
      semester,
      program_id,
    });

    res.json({
      message: "Section updated successfully",
      section,
    });
  } catch (error) {
    console.error("Update section error:", error);
    res.status(500).json({ message: "Error updating section" });
  }
};

// Delete section
exports.deleteSection = async (req, res) => {
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

    const section = await db.Section.findByPk(id);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Verify section belongs to dean's department programs
    const program = await db.Program.findOne({
      where: {
        program_id: section.program_id,
        department_id: dean.department_id,
      },
    });

    if (!program) {
      return res.status(403).json({
        message: "You don't have permission to delete this section",
      });
    }

    await section.destroy();

    res.json({ message: "Section deleted successfully" });
  } catch (error) {
    console.error("Delete section error:", error);
    res.status(500).json({ message: "Error deleting section" });
  }
};
