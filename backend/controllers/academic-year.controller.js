const db = require("../models");
const AcademicYear = db.AcademicYear;

// Get all academic years with pagination
exports.getAcademicYears = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const includeArchived = req.query.includeArchived === 'true';

    // If includeArchived is true, show ONLY archived (is_archived = true)
    // If includeArchived is false, show ONLY non-archived (is_archived = false)
    const whereClause = includeArchived ? { is_archived: true } : { is_archived: false };

    const { count, rows } = await AcademicYear.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["year_start", "DESC"]],
    });

    res.json({
      academicYears: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    });
  } catch (error) {
    console.error("Get academic years error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single academic year
exports.getAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;

    const academicYear = await AcademicYear.findByPk(id);

    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }

    res.json(academicYear);
  } catch (error) {
    console.error("Get academic year error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create academic year
exports.createAcademicYear = async (req, res) => {
  try {
    const { year_start, year_end, is_active } = req.body;

    if (!year_start || !year_end) {
      return res.status(400).json({
        message: "Year start and year end are required",
      });
    }

    const academicYear = await AcademicYear.create({
      year_start,
      year_end,
      is_active: is_active || false,
    });

    res.status(201).json({
      message: "Academic year created successfully",
      academicYear,
    });
  } catch (error) {
    console.error("Create academic year error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update academic year
exports.updateAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { year_start, year_end, is_active } = req.body;

    const academicYear = await AcademicYear.findByPk(id);

    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }

    await academicYear.update({
      year_start,
      year_end,
      is_active,
    });

    res.json({
      message: "Academic year updated successfully",
      academicYear,
    });
  } catch (error) {
    console.error("Update academic year error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete academic year (soft delete - archive)
exports.deleteAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;

    const academicYear = await AcademicYear.findByPk(id);

    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }

    // Soft delete - set is_archived to true
    await academicYear.update({ is_archived: true });

    res.json({ message: "Academic year archived successfully" });
  } catch (error) {
    console.error("Delete academic year error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Restore archived academic year
exports.restoreAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;

    const academicYear = await AcademicYear.findByPk(id);

    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }

    if (!academicYear.is_archived) {
      return res.status(400).json({ message: "Academic year is not archived" });
    }

    // Restore - set is_archived to false
    await academicYear.update({ is_archived: false });

    res.json({ message: "Academic year restored successfully" });
  } catch (error) {
    console.error("Restore academic year error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Permanently delete academic year (hard delete)
exports.permanentlyDeleteAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;

    const academicYear = await AcademicYear.findByPk(id);

    if (!academicYear) {
      return res.status(404).json({ message: "Academic year not found" });
    }

    if (!academicYear.is_archived) {
      return res.status(400).json({ 
        message: "Academic year must be archived before permanent deletion" 
      });
    }

    // Permanently delete from database
    await academicYear.destroy();

    res.json({ message: "Academic year permanently deleted successfully" });
  } catch (error) {
    console.error("Permanently delete academic year error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
