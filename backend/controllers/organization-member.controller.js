const db = require("../models");
const { Op } = require("sequelize");

// Get all members for the organization
exports.getMembers = async (req, res) => {
	try {
		const userId = req.user.user_id;

		// Get organization profile
		const organization = await db.Organization.findOne({
			where: { user_id: userId },
		});

		if (!organization) {
			return res
				.status(404)
				.json({ message: "Organization profile not found" });
		}

		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 20;
		const offset = (page - 1) * limit;
		const search = req.query.search || "";
		const academicYearId = req.query.academic_year_id;
		const position = req.query.position;
		const isActive =
			req.query.is_active !== undefined ? req.query.is_active === "true" : null;

		const whereClause = {
			organization_id: organization.organization_id,
		};

		if (search) {
			whereClause[Op.or] = [
				{ sr_code: { [Op.like]: `%${search}%` } },
				{ first_name: { [Op.like]: `%${search}%` } },
				{ last_name: { [Op.like]: `%${search}%` } },
			];
		}

		if (academicYearId) {
			whereClause.academic_year_id = academicYearId;
		}

		if (position) {
			whereClause.position = position;
		}

		if (isActive !== null) {
			whereClause.is_active = isActive;
		}

		const { count, rows } = await db.OrganizationMember.findAndCountAll({
			where: whereClause,
			limit,
			offset,
			order: [
				["is_active", "DESC"],
				["term_start_date", "DESC"],
				["position", "ASC"],
			],
			include: [
				{
					model: db.OrganizationMember,
					as: "supervisor",
					attributes: ["member_id", "first_name", "last_name", "position"],
				},
				{
					model: db.AcademicYear,
					attributes: ["academic_year_id", "year_start", "year_end"],
				},
			],
		});

		res.json({
			members: rows,
			currentPage: page,
			totalPages: Math.ceil(count / limit),
			totalItems: count,
		});
	} catch (error) {
		console.error("Get members error:", error);
		res.status(500).json({ message: "Error fetching members" });
	}
};

// Search for existing member by SR Code or name (for auto-populate)
exports.searchMemberHistory = async (req, res) => {
	try {
		const userId = req.user.user_id;
		const { sr_code, name } = req.query;

		const organization = await db.Organization.findOne({
			where: { user_id: userId },
		});

		if (!organization) {
			return res
				.status(404)
				.json({ message: "Organization profile not found" });
		}

		if (!sr_code && !name) {
			return res.status(400).json({ message: "SR Code or name is required" });
		}

		const whereClause = {
			organization_id: organization.organization_id,
		};

		if (sr_code) {
			whereClause.sr_code = sr_code;
		} else if (name) {
			whereClause[Op.or] = [
				{ first_name: { [Op.like]: `%${name}%` } },
				{ last_name: { [Op.like]: `%${name}%` } },
			];
		}

		// Get the most recent record for this member
		const member = await db.OrganizationMember.findOne({
			where: whereClause,
			order: [["created_at", "DESC"]],
			attributes: [
				"sr_code",
				"first_name",
				"middle_name",
				"last_name",
				"email",
				"contact_number",
			],
		});

		if (!member) {
			return res.status(404).json({ message: "No previous record found" });
		}

		res.json({ member });
	} catch (error) {
		console.error("Search member history error:", error);
		res.status(500).json({ message: "Error searching member history" });
	}
};

// Create a new member
exports.createMember = async (req, res) => {
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

		const {
			sr_code,
			first_name,
			middle_name,
			last_name,
			email,
			contact_number,
			year_level,
			position,
			parent_member_id,
			academic_year_id,
			term_start_date,
			term_end_date,
		} = req.body;

		// Validate required fields
		if (
			!sr_code ||
			!first_name ||
			!last_name ||
			!year_level ||
			!position ||
			!academic_year_id ||
			!term_start_date
		) {
			return res.status(400).json({
				message:
					"SR Code, name, year level, position, academic year, and term start date are required",
			});
		}

		// Check if member already exists for this term
		const existingMember = await db.OrganizationMember.findOne({
			where: {
				organization_id: organization.organization_id,
				sr_code,
				academic_year_id,
				is_active: true,
			},
		});

		if (existingMember) {
			return res.status(400).json({
				message: "This student is already a member for this term",
			});
		}

		// Create member
		const member = await db.OrganizationMember.create({
			organization_id: organization.organization_id,
			sr_code,
			first_name,
			middle_name,
			last_name,
			email,
			contact_number,
			year_level,
			position,
			parent_member_id,
			academic_year_id,
			term_start_date,
			term_end_date,
			is_active: true,
		});

		res.status(201).json({
			message: "Member added successfully",
			member,
		});
	} catch (error) {
		console.error("Create member error:", error);
		res.status(500).json({ message: "Error creating member" });
	}
};

// Update member
exports.updateMember = async (req, res) => {
	try {
		const userId = req.user.user_id;
		const { id } = req.params;

		const organization = await db.Organization.findOne({
			where: { user_id: userId },
		});

		if (!organization) {
			return res
				.status(404)
				.json({ message: "Organization profile not found" });
		}

		const member = await db.OrganizationMember.findOne({
			where: {
				member_id: id,
				organization_id: organization.organization_id,
			},
		});

		if (!member) {
			return res.status(404).json({ message: "Member not found" });
		}

		const {
			first_name,
			middle_name,
			last_name,
			email,
			contact_number,
			year_level,
			position,
			parent_member_id,
			term_end_date,
			is_active,
		} = req.body;

		await member.update({
			first_name,
			middle_name,
			last_name,
			email,
			contact_number,
			year_level,
			position,
			parent_member_id,
			term_end_date,
			is_active,
		});

		res.json({
			message: "Member updated successfully",
			member,
		});
	} catch (error) {
		console.error("Update member error:", error);
		res.status(500).json({ message: "Error updating member" });
	}
};

// Delete member
exports.deleteMember = async (req, res) => {
	try {
		const userId = req.user.user_id;
		const { id } = req.params;

		const organization = await db.Organization.findOne({
			where: { user_id: userId },
		});

		if (!organization) {
			return res
				.status(404)
				.json({ message: "Organization profile not found" });
		}

		const member = await db.OrganizationMember.findOne({
			where: {
				member_id: id,
				organization_id: organization.organization_id,
			},
		});

		if (!member) {
			return res.status(404).json({ message: "Member not found" });
		}

		await member.destroy();

		res.json({ message: "Member deleted successfully" });
	} catch (error) {
		console.error("Delete member error:", error);
		res.status(500).json({ message: "Error deleting member" });
	}
};

// Get position templates
exports.getPositionTemplates = async (req, res) => {
	try {
		const positions = await db.OrganizationPositionTemplate.findAll({
			order: [
				["hierarchy_level", "ASC"],
				["position_name", "ASC"],
			],
		});

		res.json({ positions });
	} catch (error) {
		console.error("Get position templates error:", error);
		res.status(500).json({ message: "Error fetching position templates" });
	}
};

// Get organization hierarchy (tree structure)
exports.getHierarchy = async (req, res) => {
	try {
		const userId = req.user.user_id;
		const academicYearId = req.query.academic_year_id;

		const organization = await db.Organization.findOne({
			where: { user_id: userId },
		});

		if (!organization) {
			return res
				.status(404)
				.json({ message: "Organization profile not found" });
		}

		const whereClause = {
			organization_id: organization.organization_id,
			is_active: true,
		};

		if (academicYearId) {
			whereClause.academic_year_id = academicYearId;
		}

		// Get all active members
		const members = await db.OrganizationMember.findAll({
			where: whereClause,
			include: [
				{
					model: db.OrganizationMember,
					as: "subordinates",
					where: { is_active: true },
					required: false,
				},
			],
			order: [
				["position", "ASC"],
				[
					{ model: db.OrganizationMember, as: "subordinates" },
					"position",
					"ASC",
				],
			],
		});

		// Build hierarchy tree
		const memberMap = new Map();
		const rootMembers = [];

		// First pass: create map of all members
		members.forEach((member) => {
			memberMap.set(member.member_id, {
				...member.toJSON(),
				children: [],
			});
		});

		// Second pass: build tree structure
		members.forEach((member) => {
			const memberData = memberMap.get(member.member_id);
			if (member.parent_member_id) {
				const parent = memberMap.get(member.parent_member_id);
				if (parent) {
					parent.children.push(memberData);
				}
			} else {
				rootMembers.push(memberData);
			}
		});

		res.json({ hierarchy: rootMembers });
	} catch (error) {
		console.error("Get hierarchy error:", error);
		res.status(500).json({ message: "Error fetching hierarchy" });
	}
};
