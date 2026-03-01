const db = require("../models");
const { Op } = require("sequelize");

// Get all sections with pagination and search
exports.getSections = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const program_id = req.query.program_id;

    const whereClause = {};

    if (search) {
      whereClause.section_name = {
        [Op.like]: `%${search}%`,
      };
    }

    if (program_id) {
      whereClause.program_id = program_id;
    }

    const { count, rows } = await db.Section.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [
        ["year_level", "ASC"],
        ["semester", "ASC"],
        ["section_name", "ASC"],
      ],
      include: [
        {
          model: db.Program,
          include: [{ model: db.Department }],
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
    const { section_name, year_level, semester, program_id } = req.body;

    if (!section_name || !year_level || !semester || !program_id) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if section already exists
    const existingSection = await db.Section.findOne({
      where: {
        section_name,
        year_level,
        semester,
        program_id,
      },
    });

    if (existingSection) {
      return res.status(400).json({
        message:
          "Section already exists for this program, year level, and semester",
      });
    }

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
    const { id } = req.params;
    const { section_name, year_level, semester, program_id } = req.body;

    const section = await db.Section.findByPk(id);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Check if new combination conflicts with existing section
    const existingSection = await db.Section.findOne({
      where: {
        section_name,
        year_level,
        semester,
        program_id,
        section_id: { [Op.ne]: id },
      },
    });

    if (existingSection) {
      return res.status(400).json({
        message:
          "Section already exists for this program, year level, and semester",
      });
    }

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
    const { id } = req.params;

    const section = await db.Section.findByPk(id);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    await section.destroy();

    res.json({ message: "Section deleted successfully" });
  } catch (error) {
    console.error("Delete section error:", error);
    res.status(500).json({ message: "Error deleting section" });
  }
};
