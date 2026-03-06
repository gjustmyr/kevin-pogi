const db = require("../models");
const { Op } = require("sequelize");

// Get all courses for dean's department
exports.getCourses = async (req, res) => {
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
			whereClause[Op.or] = [
				{ course_code: { [Op.like]: `%${search}%` } },
				{ course_name: { [Op.like]: `%${search}%` } },
			];
		}

		const { count, rows } = await db.Course.findAndCountAll({
			where: whereClause,
			limit,
			offset,
			order: [["course_code", "ASC"]],
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
			courses: rows,
			currentPage: page,
			totalPages: Math.ceil(count / limit),
			totalItems: count,
		});
	} catch (error) {
		console.error("Get courses error:", error);
		res.status(500).json({ message: "Error fetching courses" });
	}
};

// Create course
exports.createCourse = async (req, res) => {
	try {
		const deanId = req.user.user_id;

		// Get dean's department
		const dean = await db.Dean.findOne({
			where: { user_id: deanId },
		});

		if (!dean) {
			return res.status(404).json({ message: "Dean profile not found" });
		}

		const { course_code, course_name, description } = req.body;

		if (!course_code || !course_name) {
			return res.status(400).json({
				message: "Course code and course name are required",
			});
		}

		// Check if course code already exists in department
		const existingCourse = await db.Course.findOne({
			where: {
				course_code,
				department_id: dean.department_id,
			},
		});

		if (existingCourse) {
			return res.status(400).json({
				message: "Course code already exists in your department",
			});
		}

		// Create course
		const course = await db.Course.create({
			course_code,
			course_name,
			description,
			department_id: dean.department_id,
		});

		res.status(201).json({
			message: "Course created successfully",
			course,
		});
	} catch (error) {
		console.error("Create course error:", error);
		res.status(500).json({ message: "Error creating course" });
	}
};

// Update course
exports.updateCourse = async (req, res) => {
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

		const { course_code, course_name, description } = req.body;

		const course = await db.Course.findOne({
			where: {
				course_id: id,
				department_id: dean.department_id,
			},
		});

		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}

		// Check if course code is being changed and if it already exists
		if (course_code !== course.course_code) {
			const existingCourse = await db.Course.findOne({
				where: {
					course_code,
					department_id: dean.department_id,
					course_id: { [Op.ne]: id },
				},
			});

			if (existingCourse) {
				return res.status(400).json({
					message: "Course code already exists in your department",
				});
			}
		}

		// Update course
		await course.update({
			course_code,
			course_name,
			description,
		});

		res.json({
			message: "Course updated successfully",
			course,
		});
	} catch (error) {
		console.error("Update course error:", error);
		res.status(500).json({ message: "Error updating course" });
	}
};

// Delete course
exports.deleteCourse = async (req, res) => {
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

		const course = await db.Course.findOne({
			where: {
				course_id: id,
				department_id: dean.department_id,
			},
		});

		if (!course) {
			return res.status(404).json({ message: "Course not found" });
		}

		await course.destroy();

		res.json({ message: "Course deleted successfully" });
	} catch (error) {
		console.error("Delete course error:", error);
		res.status(500).json({ message: "Error deleting course" });
	}
};
