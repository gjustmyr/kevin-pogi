const db = require("../models");
const { Op } = require("sequelize");

// Get all requirement submissions for dean's department faculty
exports.getAllRequirements = async (req, res) => {
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
    const faculty_id = req.query.faculty_id;
    const academic_year_id = req.query.academic_year_id;
    const semester = req.query.semester;
    const status = req.query.status;
    const search = req.query.search || "";

    // Get all faculty in dean's department
    const facultyList = await db.Faculty.findAll({
      where: { department_id: dean.department_id },
      attributes: ["faculty_id"],
    });

    const facultyIds = facultyList.map((f) => f.faculty_id);

    if (facultyIds.length === 0) {
      return res.json({
        requirements: [],
        currentPage: page,
        totalPages: 0,
        totalItems: 0,
      });
    }

    // Build assignment where clause
    const assignmentWhere = {
      faculty_id: { [Op.in]: facultyIds },
    };

    if (faculty_id) {
      assignmentWhere.faculty_id = faculty_id;
    }

    if (academic_year_id) {
      assignmentWhere.academic_year_id = academic_year_id;
    }

    if (semester) {
      assignmentWhere.semester = semester;
    }

    // Build submission where clause
    const submissionWhere = {};
    if (status) {
      submissionWhere.status = status;
    }

    const { count, rows } = await db.RequirementSubmission.findAndCountAll({
      where: submissionWhere,
      limit,
      offset,
      order: [["submission_date", "DESC"]],
      include: [
        {
          model: db.CourseAssignment,
          where: assignmentWhere,
          include: [
            {
              model: db.Faculty,
              attributes: [
                "faculty_id",
                "employee_id",
                "first_name",
                "middle_name",
                "last_name",
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
        },
      ],
    });

    res.json({
      requirements: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    });
  } catch (error) {
    console.error("Get all requirements error:", error);
    res.status(500).json({ message: "Error fetching requirements" });
  }
};

// Get faculty accomplishment summary
exports.getFacultyAccomplishment = async (req, res) => {
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
      attributes: [
        "faculty_id",
        "employee_id",
        "first_name",
        "middle_name",
        "last_name",
        "email",
      ],
    });

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const academic_year_id = req.query.academic_year_id;
    const semester = req.query.semester;

    const assignmentWhere = {
      faculty_id,
      status: "active",
    };

    if (academic_year_id) {
      assignmentWhere.academic_year_id = academic_year_id;
    }

    if (semester) {
      assignmentWhere.semester = semester;
    }

    // Get all assignments for this faculty
    const assignments = await db.CourseAssignment.findAll({
      where: assignmentWhere,
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
        {
          model: db.RequirementSubmission,
          required: false,
        },
      ],
      order: [["assigned_date", "DESC"]],
    });

    // Calculate statistics
    const requirementTypes = [
      "Instructional Materials",
      "Student Class Attendance Sheet",
      "Acknowledgement Receipt of Syllabus",
      "Acknowledgement Receipt of Exam",
      "Midterm, Final Exam, and TQS",
      "Student Exam (Highest-Middle-Lowest)",
      "Key to Correction of Midterm and Final Exam",
      "Report of Grades",
      "Class Record",
    ];

    const totalRequirements = assignments.length * requirementTypes.length;
    let submittedCount = 0;
    let clearedCount = 0;
    let pendingCount = 0;
    let returnedCount = 0;

    assignments.forEach((assignment) => {
      assignment.requirement_submissions.forEach((submission) => {
        submittedCount++;
        if (submission.status === "cleared") clearedCount++;
        else if (submission.status === "pending") pendingCount++;
        else if (submission.status === "returned") returnedCount++;
      });
    });

    res.json({
      faculty,
      assignments,
      statistics: {
        total_courses: assignments.length,
        total_requirements: totalRequirements,
        submitted: submittedCount,
        cleared: clearedCount,
        pending: pendingCount,
        returned: returnedCount,
        not_submitted: totalRequirements - submittedCount,
        completion_rate:
          totalRequirements > 0
            ? ((clearedCount / totalRequirements) * 100).toFixed(2)
            : 0,
      },
    });
  } catch (error) {
    console.error("Get faculty accomplishment error:", error);
    res.status(500).json({ message: "Error fetching faculty accomplishment" });
  }
};

// Get requirements for a specific assignment
exports.getAssignmentRequirements = async (req, res) => {
  try {
    const deanUserId = req.user.user_id;
    const { assignment_id } = req.params;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanUserId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    // Get assignment and verify it belongs to dean's department
    const assignment = await db.CourseAssignment.findOne({
      where: { assignment_id },
      include: [
        {
          model: db.Faculty,
          where: { department_id: dean.department_id },
          attributes: [
            "faculty_id",
            "employee_id",
            "first_name",
            "middle_name",
            "last_name",
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
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Get all submissions for this assignment
    const submissions = await db.RequirementSubmission.findAll({
      where: { assignment_id },
      order: [["submission_date", "DESC"]],
    });

    // Define all requirement types
    const requirementTypes = [
      "Instructional Materials",
      "Student Class Attendance Sheet",
      "Acknowledgement Receipt of Syllabus",
      "Acknowledgement Receipt of Exam",
      "Midterm, Final Exam, and TQS",
      "Student Exam (Highest-Middle-Lowest)",
      "Key to Correction of Midterm and Final Exam",
      "Report of Grades",
      "Class Record",
    ];

    // Map submissions to requirement types
    const requirementsStatus = requirementTypes.map((type, index) => {
      const submission = submissions.find((s) => s.requirement_type === type);
      return {
        requirement_number: index + 1,
        requirement_type: type,
        submission: submission || null,
      };
    });

    res.json({
      assignment,
      requirements: requirementsStatus,
    });
  } catch (error) {
    console.error("Get assignment requirements error:", error);
    res.status(500).json({ message: "Error fetching assignment requirements" });
  }
};

// Clear a requirement (approve)
exports.clearRequirement = async (req, res) => {
  try {
    const deanUserId = req.user.user_id;
    const { submission_id } = req.params;
    const { remarks } = req.body;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanUserId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    // Find submission and verify it belongs to dean's department
    const submission = await db.RequirementSubmission.findOne({
      where: { submission_id },
      include: [
        {
          model: db.CourseAssignment,
          include: [
            {
              model: db.Faculty,
              where: { department_id: dean.department_id },
            },
          ],
        },
      ],
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Update submission status
    submission.status = "cleared";
    submission.dean_remarks = remarks || "Approved";
    submission.validated_by = deanUserId;
    submission.validated_date = new Date();
    await submission.save();

    res.json({
      message: "Requirement cleared successfully",
      submission,
    });
  } catch (error) {
    console.error("Clear requirement error:", error);
    res.status(500).json({ message: "Error clearing requirement" });
  }
};

// Return a requirement (needs revision)
exports.returnRequirement = async (req, res) => {
  try {
    const deanUserId = req.user.user_id;
    const { submission_id } = req.params;
    const { remarks } = req.body;

    if (!remarks || !remarks.trim()) {
      return res.status(400).json({
        message: "Remarks are required when returning a requirement",
      });
    }

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanUserId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    // Find submission and verify it belongs to dean's department
    const submission = await db.RequirementSubmission.findOne({
      where: { submission_id },
      include: [
        {
          model: db.CourseAssignment,
          include: [
            {
              model: db.Faculty,
              where: { department_id: dean.department_id },
            },
          ],
        },
      ],
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Update submission status
    submission.status = "returned";
    submission.dean_remarks = remarks;
    submission.validated_by = deanUserId;
    submission.validated_date = new Date();
    await submission.save();

    res.json({
      message: "Requirement returned successfully",
      submission,
    });
  } catch (error) {
    console.error("Return requirement error:", error);
    res.status(500).json({ message: "Error returning requirement" });
  }
};

// Download a requirement file
exports.downloadRequirement = async (req, res) => {
  try {
    const deanUserId = req.user.user_id;
    const { submission_id } = req.params;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanUserId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    // Find submission and verify it belongs to dean's department
    const submission = await db.RequirementSubmission.findOne({
      where: { submission_id },
      include: [
        {
          model: db.CourseAssignment,
          include: [
            {
              model: db.Faculty,
              where: { department_id: dean.department_id },
            },
          ],
        },
      ],
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Send file
    res.download(submission.file_path, submission.file_name);
  } catch (error) {
    console.error("Download requirement error:", error);
    res.status(500).json({ message: "Error downloading file" });
  }
};

// Get department-wide statistics
exports.getDepartmentStatistics = async (req, res) => {
  try {
    const deanUserId = req.user.user_id;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanUserId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const academic_year_id = req.query.academic_year_id;
    const semester = req.query.semester;

    // Get all faculty in dean's department
    const facultyList = await db.Faculty.findAll({
      where: { department_id: dean.department_id },
    });

    const facultyIds = facultyList.map((f) => f.faculty_id);

    const assignmentWhere = {
      faculty_id: { [Op.in]: facultyIds },
      status: "active",
    };

    if (academic_year_id) {
      assignmentWhere.academic_year_id = academic_year_id;
    }

    if (semester) {
      assignmentWhere.semester = semester;
    }

    // Get all assignments
    const assignments = await db.CourseAssignment.findAll({
      where: assignmentWhere,
      include: [
        {
          model: db.RequirementSubmission,
          required: false,
        },
      ],
    });

    const requirementTypes = [
      "Instructional Materials",
      "Student Class Attendance Sheet",
      "Acknowledgement Receipt of Syllabus",
      "Acknowledgement Receipt of Exam",
      "Midterm, Final Exam, and TQS",
      "Student Exam (Highest-Middle-Lowest)",
      "Key to Correction of Midterm and Final Exam",
      "Report of Grades",
      "Class Record",
    ];

    const totalRequirements = assignments.length * requirementTypes.length;
    let submittedCount = 0;
    let clearedCount = 0;
    let pendingCount = 0;
    let returnedCount = 0;

    assignments.forEach((assignment) => {
      assignment.requirement_submissions.forEach((submission) => {
        submittedCount++;
        if (submission.status === "cleared") clearedCount++;
        else if (submission.status === "pending") pendingCount++;
        else if (submission.status === "returned") returnedCount++;
      });
    });

    res.json({
      total_faculty: facultyList.length,
      total_courses: assignments.length,
      total_requirements: totalRequirements,
      submitted: submittedCount,
      cleared: clearedCount,
      pending: pendingCount,
      returned: returnedCount,
      not_submitted: totalRequirements - submittedCount,
      completion_rate:
        totalRequirements > 0
          ? ((clearedCount / totalRequirements) * 100).toFixed(2)
          : 0,
    });
  } catch (error) {
    console.error("Get department statistics error:", error);
    res.status(500).json({ message: "Error fetching statistics" });
  }
};
