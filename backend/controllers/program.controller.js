const db = require("../models");
const { Op } = require("sequelize");

// Get all programs with pagination, search, and filter
exports.getPrograms = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const offset = (page - 1) * limit;
		const search = req.query.search || "";
		const department_id = req.query.department_id;

		let whereClause = {};

		// Add search condition
		if (search) {
			whereClause.program_name = {
				[Op.like]: `%${search}%`,
			};
		}

		// Add department filter
		if (department_id) {
			whereClause.department_id = department_id;
		}

		const { count, rows } = await db.Program.findAndCountAll({
			where: whereClause,
			include: [
				{
					model: db.Department,
					attributes: ["department_id", "department_name"],
				},
			],
			limit,
			offset,
			order: [["program_name", "ASC"]],
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

// Get single program
exports.getProgram = async (req, res) => {
	try {
		const { id } = req.params;

		const program = await db.Program.findByPk(id, {
			include: [
				{
					model: db.Department,
					attributes: ["department_id", "department_name"],
				},
			],
		});

		if (!program) {
			return res.status(404).json({ message: "Program not found" });
		}

		res.json(program);
	} catch (error) {
		console.error("Get program error:", error);
		res.status(500).json({ message: "Error fetching program" });
	}
};

// Create program
exports.createProgram = async (req, res) => {
	try {
		const { program_name, department_id } = req.body;

		// Validate input
		if (!program_name || !department_id) {
			return res
				.status(400)
				.json({ message: "Program name and department are required" });
		}

		// Check if department exists
		const department = await db.Department.findByPk(department_id);
		if (!department) {
			return res.status(404).json({ message: "Department not found" });
		}

		// Check if program already exists in the department
		const existingProgram = await db.Program.findOne({
			where: { program_name, department_id },
		});

		if (existingProgram) {
			return res
				.status(400)
				.json({ message: "Program already exists in this department" });
		}

		const program = await db.Program.create({
			program_name,
			department_id,
		});

		// Fetch the created program with department info
		const createdProgram = await db.Program.findByPk(program.program_id, {
			include: [
				{
					model: db.Department,
					attributes: ["department_id", "department_name"],
				},
			],
		});

		res.status(201).json({
			message: "Program created successfully",
			program: createdProgram,
		});
	} catch (error) {
		console.error("Create program error:", error);
		res.status(500).json({ message: "Error creating program" });
	}
};

// Update program
exports.updateProgram = async (req, res) => {
	try {
		const { id } = req.params;
		const { program_name, department_id } = req.body;

		const program = await db.Program.findByPk(id);
		if (!program) {
			return res.status(404).json({ message: "Program not found" });
		}

		// Validate input
		if (!program_name || !department_id) {
			return res
				.status(400)
				.json({ message: "Program name and department are required" });
		}

		// Check if department exists
		const department = await db.Department.findByPk(department_id);
		if (!department) {
			return res.status(404).json({ message: "Department not found" });
		}

		// Check if new name conflicts with existing program in the same department
		if (
			program_name !== program.program_name ||
			department_id !== program.department_id
		) {
			const existingProgram = await db.Program.findOne({
				where: {
					program_name,
					department_id,
					program_id: { [Op.ne]: id },
				},
			});

			if (existingProgram) {
				return res
					.status(400)
					.json({ message: "Program already exists in this department" });
			}
		}

		await program.update({
			program_name,
			department_id,
		});

		// Fetch updated program with department info
		const updatedProgram = await db.Program.findByPk(id, {
			include: [
				{
					model: db.Department,
					attributes: ["department_id", "department_name"],
				},
			],
		});

		res.json({
			message: "Program updated successfully",
			program: updatedProgram,
		});
	} catch (error) {
		console.error("Update program error:", error);
		res.status(500).json({ message: "Error updating program" });
	}
};

// Delete program
exports.deleteProgram = async (req, res) => {
	try {
		const { id } = req.params;

		const program = await db.Program.findByPk(id);
		if (!program) {
			return res.status(404).json({ message: "Program not found" });
		}

		// Check if program has associated sections
		const sectionsCount = await db.Section.count({
			where: { program_id: id },
		});

		if (sectionsCount > 0) {
			return res.status(400).json({
				message: "Cannot delete program. It has associated sections.",
			});
		}

		await program.destroy();

		res.json({ message: "Program deleted successfully" });
	} catch (error) {
		console.error("Delete program error:", error);
		res.status(500).json({ message: "Error deleting program" });
	}
};
