const db = require("../models");
const { Op } = require("sequelize");

// Get all course assignments for dean's department
exports.getCourseAssignments = async (req, res) => {
  try {
    const deanUserId = req.user.user_id;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanUserId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const faculty_id = req.query.faculty_id;
    const academic_year_id = req.query.academic_year_id;
    const semester = req.query.semester;
    const status = req.query.status;

    // Get all faculty in dean's department
    const facultyList = await db.Faculty.findAll({
      where: { department_id: dean.department_id },
      attributes: ["faculty_id"],
    });

    const facultyIds = facultyList.map((f) => f.faculty_id);

    if (facultyIds.length === 0) {
      return res.json({
        assignments: [],
        currentPage: page,
        totalPages: 0,
        totalItems: 0,
      });
    }

    const whereClause = {
      faculty_id: { [Op.in]: facultyIds },
    };

    if (faculty_id) {
      whereClause.faculty_id = faculty_id;
    }

    if (academic_year_id) {
      whereClause.academic_year_id = academic_year_id;
    }

    if (semester) {
      whereClause.semester = semester;
    }

    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await db.CourseAssignment.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["assigned_date", "DESC"]],
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
          where: search
            ? {
                [Op.or]: [
                  { first_name: { [Op.like]: `%${search}%` } },
                  { last_name: { [Op.like]: `%${search}%` } },
                  { employee_id: { [Op.like]: `%${search}%` } },
                ],
              }
            : undefined,
        },
        {
          model: db.Course,
          attributes: ["course_id", "course_code", "course_name"],
        },
        {
          model: db.Section,
          attributes: ["section_id", "section_name", "year_level"],
        },
        {
          model: db.AcademicYear,
          attributes: ["academic_year_id", "year_start", "year_end"],
        },
      ],
    });

    res.json({
      assignments: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    });
  } catch (error) {
    console.error("Get course assignments error:", error);
    res.status(500).json({ message: "Error fetching course assignments" });
  }
};

// Create course assignment
exports.createCourseAssignment = async (req, res) => {
  try {
    const deanUserId = req.user.user_id;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanUserId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const { faculty_id, course_id, section_id, academic_year_id, semester } =
      req.body;

    if (
      !faculty_id ||
      !course_id ||
      !section_id ||
      !academic_year_id ||
      !semester
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Verify faculty belongs to dean's department
    const faculty = await db.Faculty.findOne({
      where: {
        faculty_id,
        department_id: dean.department_id,
      },
    });

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found in your department",
      });
    }

    // Verify course belongs to dean's department
    const course = await db.Course.findOne({
      where: {
        course_id,
        department_id: dean.department_id,
      },
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found in your department",
      });
    }

    // Check if assignment already exists
    const existingAssignment = await db.CourseAssignment.findOne({
      where: {
        faculty_id,
        course_id,
        section_id,
        academic_year_id,
        semester,
      },
    });

    if (existingAssignment) {
      return res.status(400).json({
        message:
          "This course is already assigned to this faculty for the selected semester",
      });
    }

    // Create assignment
    const assignment = await db.CourseAssignment.create({
      faculty_id,
      course_id,
      section_id,
      academic_year_id,
      semester,
      assigned_by: deanUserId,
      status: "active",
    });

    // Fetch the created assignment with relations
    const createdAssignment = await db.CourseAssignment.findByPk(
      assignment.assignment_id,
      {
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
          {
            model: db.Course,
            attributes: ["course_id", "course_code", "course_name"],
          },
          {
            model: db.Section,
            attributes: ["section_id", "section_name", "year_level"],
          },
          {
            model: db.AcademicYear,
            attributes: ["academic_year_id", "year_start", "year_end"],
          },
        ],
      },
    );

    res.status(201).json({
      message: "Course assigned successfully",
      assignment: createdAssignment,
    });
  } catch (error) {
    console.error("Create course assignment error:", error);
    res.status(500).json({ message: "Error creating course assignment" });
  }
};

// Bulk create course assignments
exports.bulkCreateAssignments = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const deanUserId = req.user.user_id;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanUserId },
    });

    if (!dean) {
      await transaction.rollback();
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const { assignments } = req.body; // Array of assignment objects

    if (
      !assignments ||
      !Array.isArray(assignments) ||
      assignments.length === 0
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Assignments array is required",
      });
    }

    const createdAssignments = [];
    const errors = [];

    for (const assignment of assignments) {
      try {
        const {
          faculty_id,
          course_id,
          section_id,
          academic_year_id,
          semester,
        } = assignment;

        // Check if assignment already exists
        const existingAssignment = await db.CourseAssignment.findOne({
          where: {
            faculty_id,
            course_id,
            section_id,
            academic_year_id,
            semester,
          },
        });

        if (!existingAssignment) {
          const newAssignment = await db.CourseAssignment.create(
            {
              faculty_id,
              course_id,
              section_id,
              academic_year_id,
              semester,
              assigned_by: deanUserId,
              status: "active",
            },
            { transaction },
          );
          createdAssignments.push(newAssignment);
        } else {
          errors.push({
            assignment,
            error: "Assignment already exists",
          });
        }
      } catch (error) {
        errors.push({
          assignment,
          error: error.message,
        });
      }
    }

    await transaction.commit();

    res.status(201).json({
      message: `${createdAssignments.length} assignments created successfully`,
      created: createdAssignments.length,
      errors: errors.length,
      errorDetails: errors,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Bulk create assignments error:", error);
    res.status(500).json({ message: "Error creating assignments" });
  }
};

// Update course assignment
exports.updateCourseAssignment = async (req, res) => {
  try {
    const deanUserId = req.user.user_id;
    const { id } = req.params;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanUserId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const { status } = req.body;

    const assignment = await db.CourseAssignment.findByPk(id, {
      include: [
        {
          model: db.Faculty,
          where: { department_id: dean.department_id },
        },
      ],
    });

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found or not in your department",
      });
    }

    await assignment.update({ status });

    res.json({
      message: "Assignment updated successfully",
      assignment,
    });
  } catch (error) {
    console.error("Update course assignment error:", error);
    res.status(500).json({ message: "Error updating assignment" });
  }
};

// Delete course assignment
exports.deleteCourseAssignment = async (req, res) => {
  try {
    const deanUserId = req.user.user_id;
    const { id } = req.params;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanUserId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const assignment = await db.CourseAssignment.findByPk(id, {
      include: [
        {
          model: db.Faculty,
          where: { department_id: dean.department_id },
        },
      ],
    });

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found or not in your department",
      });
    }

    await assignment.destroy();

    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Delete course assignment error:", error);
    res.status(500).json({ message: "Error deleting assignment" });
  }
};

// Get faculty workload
exports.getFacultyWorkload = async (req, res) => {
  try {
    const deanUserId = req.user.user_id;
    const { faculty_id } = req.params;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanUserId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    // Verify faculty belongs to dean's department
    const faculty = await db.Faculty.findOne({
      where: {
        faculty_id,
        department_id: dean.department_id,
      },
    });

    if (!faculty) {
      return res.status(404).json({
        message: "Faculty not found in your department",
      });
    }

    // Get all active assignments for this faculty
    const assignments = await db.CourseAssignment.findAll({
      where: {
        faculty_id,
        status: "active",
      },
      include: [
        {
          model: db.Course,
          attributes: ["course_id", "course_code", "course_name"],
        },
        {
          model: db.Section,
          attributes: ["section_id", "section_name", "year_level"],
        },
        {
          model: db.AcademicYear,
          attributes: ["academic_year_id", "year_start", "year_end"],
        },
      ],
      order: [["semester", "ASC"]],
    });

    // Calculate statistics
    const totalCourses = assignments.length;
    const bySemester = {};
    const byAcademicYear = {};

    assignments.forEach((assignment) => {
      // Count by semester
      if (!bySemester[assignment.semester]) {
        bySemester[assignment.semester] = 0;
      }
      bySemester[assignment.semester]++;

      // Count by academic year
      const yearKey = `${assignment.academic_year.year_start}-${assignment.academic_year.year_end}`;
      if (!byAcademicYear[yearKey]) {
        byAcademicYear[yearKey] = 0;
      }
      byAcademicYear[yearKey]++;
    });

    res.json({
      faculty: {
        faculty_id: faculty.faculty_id,
        employee_id: faculty.employee_id,
        name: `${faculty.first_name} ${faculty.last_name}`,
      },
      workload: {
        totalCourses,
        bySemester,
        byAcademicYear,
      },
      assignments,
    });
  } catch (error) {
    console.error("Get faculty workload error:", error);
    res.status(500).json({ message: "Error fetching faculty workload" });
  }
};
