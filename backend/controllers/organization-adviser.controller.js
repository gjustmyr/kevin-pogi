const db = require("../models");
const { Op } = require("sequelize");

// Get advisers for organization
exports.getAdvisers = async (req, res) => {
	try {
		const userId = req.user.user_id;

		const organization = await db.Organization.findOne({
			where: { user_id: userId },
		});

		if (!organization) {
			return res
				.status(404)
				.json({ message: "Organization profile not found" });
		}

		const advisers = await db.OrganizationAdviser.findAll({
			where: {
				organization_id: organization.organization_id,
				is_active: true,
			},
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
						"contact_number",
					],
				},
			],
			order: [["assigned_date", "ASC"]],
		});

		res.json({ advisers });
	} catch (error) {
		console.error("Get advisers error:", error);
		res.status(500).json({ message: "Error fetching advisers" });
	}
};

// For Dean - Get advisers for a specific organization
exports.deanGetOrganizationAdvisers = async (req, res) => {
	try {
		const deanId = req.user.user_id;
		const { organizationId } = req.params;

		const dean = await db.Dean.findOne({
			where: { user_id: deanId },
		});

		if (!dean) {
			return res.status(404).json({ message: "Dean profile not found" });
		}

		// Check if organization belongs to dean's department
		const organization = await db.Organization.findOne({
			where: {
				organization_id: organizationId,
				department: dean.department,
			},
		});

		if (!organization) {
			return res.status(404).json({
				message: "Organization not found in your department",
			});
		}

		const advisers = await db.OrganizationAdviser.findAll({
			where: {
				organization_id: organizationId,
			},
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
			order: [
				["is_active", "DESC"],
				["assigned_date", "ASC"],
			],
		});

		res.json({ advisers });
	} catch (error) {
		console.error("Dean get organization advisers error:", error);
		res.status(500).json({ message: "Error fetching advisers" });
	}
};

// For Dean - Assign adviser to organization
exports.deanAssignAdviser = async (req, res) => {
	try {
		const deanId = req.user.user_id;
		const { organizationId } = req.params;
		const { faculty_id } = req.body;

		if (!faculty_id) {
			return res.status(400).json({ message: "Faculty ID is required" });
		}

		const dean = await db.Dean.findOne({
			where: { user_id: deanId },
		});

		if (!dean) {
			return res.status(404).json({ message: "Dean profile not found" });
		}

		// Check organization
		const organization = await db.Organization.findOne({
			where: {
				organization_id: organizationId,
				department: dean.department,
			},
		});

		if (!organization) {
			return res.status(404).json({
				message: "Organization not found in your department",
			});
		}

		// Check faculty
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

		// Check if already assigned
		const existingAdviser = await db.OrganizationAdviser.findOne({
			where: {
				organization_id: organizationId,
				faculty_id,
				is_active: true,
			},
		});

		if (existingAdviser) {
			return res.status(400).json({
				message:
					"This faculty is already an active adviser for this organization",
			});
		}

		// Check maximum advisers (2)
		const activeAdvisersCount = await db.OrganizationAdviser.count({
			where: {
				organization_id: organizationId,
				is_active: true,
			},
		});

		if (activeAdvisersCount >= 2) {
			return res.status(400).json({
				message: "Maximum of 2 active advisers allowed per organization",
			});
		}

		// Create adviser assignment
		const adviser = await db.OrganizationAdviser.create({
			organization_id: organizationId,
			faculty_id,
			assigned_date: new Date(),
			is_active: true,
		});

		res.status(201).json({
			message: "Adviser assigned successfully",
			adviser,
		});
	} catch (error) {
		console.error("Dean assign adviser error:", error);
		res.status(500).json({ message: "Error assigning adviser" });
	}
};

// For Dean - Remove/deactivate adviser
exports.deanRemoveAdviser = async (req, res) => {
	try {
		const deanId = req.user.user_id;
		const { id } = req.params;

		const dean = await db.Dean.findOne({
			where: { user_id: deanId },
		});

		if (!dean) {
			return res.status(404).json({ message: "Dean profile not found" });
		}

		const adviser = await db.OrganizationAdviser.findOne({
			where: { adviser_id: id },
			include: [
				{
					model: db.Organization,
					where: { department: dean.department },
				},
			],
		});

		if (!adviser) {
			return res.status(404).json({
				message: "Adviser assignment not found or not in your department",
			});
		}

		await adviser.update({ is_active: false });

		res.json({ message: "Adviser removed successfully" });
	} catch (error) {
		console.error("Dean remove adviser error:", error);
		res.status(500).json({ message: "Error removing adviser" });
	}
};
