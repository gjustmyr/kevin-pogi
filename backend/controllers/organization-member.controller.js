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

    // Check if member already exists for this exact term and position
    // Allow same student to have multiple memberships in same academic year
    // (e.g., different positions, or re-enrollment)
    const existingMember = await db.OrganizationMember.findOne({
      where: {
        organization_id: organization.organization_id,
        sr_code,
        academic_year_id,
        position,
        is_active: true,
      },
    });

    if (existingMember) {
      return res.status(400).json({
        message:
          "This student already has this position for this academic year",
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

// Download template for bulk upload
exports.downloadTemplate = async (req, res) => {
  try {
    const path = require("path");
    const filePath = path.join(
      __dirname,
      "../public/templates/organization-members-template.csv",
    );
    res.download(filePath, "organization-members-template.csv");
  } catch (error) {
    console.error("Download template error:", error);
    res.status(500).json({ message: "Error downloading template" });
  }
};

// Bulk upload members from CSV/Excel
exports.bulkUploadMembers = async (req, res) => {
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

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { academic_year_id, term_start_date } = req.body;

    if (!academic_year_id || !term_start_date) {
      return res.status(400).json({
        message: "Academic year and term start date are required",
      });
    }

    // Parse CSV file
    const fs = require("fs");
    const csv = require("csv-parser");
    const results = [];

    const stream = fs
      .createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          const uploadResults = {
            total: results.length,
            inserted: 0,
            updated: 0,
            skipped: 0,
            errors: [],
          };

          for (const row of results) {
            try {
              // Validate required fields
              if (!row.sr_code || !row.student_name || !row.position) {
                uploadResults.errors.push({
                  row: row,
                  error: "Missing SR Code, student name, or position",
                });
                uploadResults.skipped++;
                continue;
              }

              // Parse student name (assuming format: "First Middle Last" or "First Last")
              const nameParts = row.student_name.trim().split(" ");
              let first_name, middle_name, last_name;

              if (nameParts.length === 1) {
                first_name = nameParts[0];
                last_name = nameParts[0];
              } else if (nameParts.length === 2) {
                first_name = nameParts[0];
                last_name = nameParts[1];
              } else {
                first_name = nameParts[0];
                middle_name = nameParts.slice(1, -1).join(" ");
                last_name = nameParts[nameParts.length - 1];
              }

              // Check if member exists with same position
              // Allow same student to have multiple records per academic year
              const position = row.position ? row.position.trim() : "Member";

              const existingMember = await db.OrganizationMember.findOne({
                where: {
                  organization_id: organization.organization_id,
                  sr_code: row.sr_code.trim(),
                  academic_year_id: academic_year_id,
                  position: position,
                },
              });

              const memberData = {
                organization_id: organization.organization_id,
                sr_code: row.sr_code.trim(),
                first_name: first_name,
                middle_name: middle_name || null,
                last_name: last_name,
                email: row.email ? row.email.trim() : null,
                contact_number: null, // Not in template
                gender: row.gender ? row.gender.trim() : null,
                program: row.program ? row.program.trim() : null,
                section: row.section ? row.section.trim() : null,
                department: row.department ? row.department.trim() : null,
                year_level: row.year_level ? row.year_level.trim() : "1st Year",
                position: position,
                parent_member_id: null,
                academic_year_id: academic_year_id,
                term_start_date: term_start_date,
                is_active: true,
              };

              if (existingMember) {
                // Update existing member with same position
                await existingMember.update(memberData);
                uploadResults.updated++;
              } else {
                // Insert new member record
                await db.OrganizationMember.create(memberData);
                uploadResults.inserted++;
              }
            } catch (rowError) {
              console.error("Row processing error:", rowError);
              uploadResults.errors.push({
                row: row,
                error: rowError.message,
              });
              uploadResults.skipped++;
            }
          }

          // Delete uploaded file
          fs.unlinkSync(req.file.path);

          res.json({
            message: "Bulk upload completed",
            results: uploadResults,
          });
        } catch (processingError) {
          console.error("Processing error:", processingError);
          // Clean up file
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          res.status(500).json({ message: "Error processing file" });
        }
      })
      .on("error", (error) => {
        console.error("CSV parsing error:", error);
        // Clean up file
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: "Error parsing CSV file" });
      });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({ message: "Error uploading members" });
  }
};

// Get demographics data
exports.getDemographics = async (req, res) => {
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

    // Get all active members
    const members = await db.OrganizationMember.findAll({
      where: {
        organization_id: organization.organization_id,
        is_active: true,
      },
    });

    const totalMembers = members.length;

    // Calculate gender distribution
    const maleCount = members.filter((m) => m.gender === "Male").length;
    const femaleCount = members.filter((m) => m.gender === "Female").length;
    const malePercentage =
      totalMembers > 0 ? Math.round((maleCount / totalMembers) * 100) : 0;
    const femalePercentage =
      totalMembers > 0 ? Math.round((femaleCount / totalMembers) * 100) : 0;

    // Calculate program distribution
    const programCounts = {};
    members.forEach((m) => {
      if (m.program) {
        programCounts[m.program] = (programCounts[m.program] || 0) + 1;
      }
    });

    const byProgram = Object.entries(programCounts)
      .map(([program, count]) => ({
        program,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    res.json({
      maleCount,
      femaleCount,
      malePercentage,
      femalePercentage,
      byProgram,
      totalMembers,
    });
  } catch (error) {
    console.error("Get demographics error:", error);
    res.status(500).json({ message: "Error fetching demographics" });
  }
};
