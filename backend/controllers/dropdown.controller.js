const db = require("../models");

// Get all departments for dropdown
exports.getDepartments = async (req, res) => {
	try {
		const departments = await db.Department.findAll({
			attributes: ["department_id", "department_name"],
			order: [["department_name", "ASC"]],
		});

		res.json(departments);
	} catch (error) {
		console.error("Get departments dropdown error:", error);
		res.status(500).json({ message: "Error fetching departments" });
	}
};

// Get all programs for dropdown (optionally filter by department)
exports.getPrograms = async (req, res) => {
	try {
		const { department_id } = req.query;
		const whereClause = department_id ? { department_id } : {};

		const programs = await db.Program.findAll({
			where: whereClause,
			attributes: ["program_id", "program_name", "department_id"],
			include: [
				{
					model: db.Department,
					attributes: ["department_name"],
				},
			],
			order: [["program_name", "ASC"]],
		});

		res.json(programs);
	} catch (error) {
		console.error("Get programs dropdown error:", error);
		res.status(500).json({ message: "Error fetching programs" });
	}
};

// Get all sections for dropdown (optionally filter by program)
exports.getSections = async (req, res) => {
	try {
		const { program_id } = req.query;
		const whereClause = program_id ? { program_id } : {};

		const sections = await db.Section.findAll({
			where: whereClause,
			attributes: ["section_id", "section_name", "year_level", "semester", "program_id"],
			include: [
				{
					model: db.Program,
					attributes: ["program_name", "program_acronym"],
				}
			],
			order: [["section_name", "ASC"]],
		});

		res.json(sections);
	} catch (error) {
		console.error("Get sections dropdown error:", error);
		res.status(500).json({ message: "Error fetching sections" });
	}
};

// Get all organizations for dropdown
exports.getOrganizations = async (req, res) => {
	try {
		const organizations = await db.Organization.findAll({
			attributes: ["organization_id", "organization_name"],
			order: [["organization_name", "ASC"]],
		});

		res.json(organizations);
	} catch (error) {
		console.error("Get organizations dropdown error:", error);
		res.status(500).json({ message: "Error fetching organizations" });
	}
};

// Get all academic years for dropdown
exports.getAcademicYears = async (req, res) => {
	try {
		const academicYears = await db.AcademicYear.findAll({
			attributes: ["academic_year_id", "year_start", "year_end", "is_active"],
			order: [["year_start", "DESC"]],
		});

		res.json(academicYears);
	} catch (error) {
		console.error("Get academic years dropdown error:", error);
		res.status(500).json({ message: "Error fetching academic years" });
	}
};
