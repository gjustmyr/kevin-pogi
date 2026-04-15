const db = require("../models");
const { Op } = require("sequelize");

// Get faculty involvement in research-related activities
exports.getResearchInvolvement = async (req, res) => {
  try {
    const deanId = req.user.user_id;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const academicYearId = req.query.academic_year_id;

    // Get all faculty in dean's department
    const faculty = await db.Faculty.findAll({
      where: { department: dean.department },
      include: [
        {
          model: db.FacultyResearchActivities,
          as: "research_activities",
          required: false,
          where: academicYearId
            ? {
                date_from: {
                  [Op.gte]: db.sequelize.literal(
                    `(SELECT start_date FROM academic_years WHERE academic_year_id = ${academicYearId})`,
                  ),
                },
                date_to: {
                  [Op.lte]: db.sequelize.literal(
                    `(SELECT end_date FROM academic_years WHERE academic_year_id = ${academicYearId})`,
                  ),
                },
              }
            : undefined,
        },
      ],
    });

    // Calculate involvement statistics
    const stats = faculty.map((f) => ({
      faculty_id: f.faculty_id,
      faculty_name: `${f.first_name} ${f.last_name}`,
      count: f.research_activities ? f.research_activities.length : 0,
    }));

    // Calculate total and percentages
    const total = stats.reduce((sum, s) => sum + s.count, 0);
    const data = stats
      .filter((s) => s.count > 0)
      .map((s) => ({
        ...s,
        percentage: total > 0 ? ((s.count / total) * 100).toFixed(0) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    res.json({
      title:
        "Faculty Involvement in Research-related Seminars/Workshops/Trainings/Conferences",
      subtitle: "(Permanent and Temporary)",
      data,
      total,
    });
  } catch (error) {
    console.error("Get research involvement error:", error);
    res.status(500).json({ message: "Error fetching research involvement" });
  }
};

// Get faculty involvement in extension services
exports.getExtensionInvolvement = async (req, res) => {
  try {
    const deanId = req.user.user_id;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const academicYearId = req.query.academic_year_id;

    // Get all faculty in dean's department
    const faculty = await db.Faculty.findAll({
      where: { department: dean.department },
      include: [
        {
          model: db.FacultyExtensionActivities,
          as: "extension_activities",
          required: false,
          where: academicYearId
            ? {
                date_from: {
                  [Op.gte]: db.sequelize.literal(
                    `(SELECT start_date FROM academic_years WHERE academic_year_id = ${academicYearId})`,
                  ),
                },
                date_to: {
                  [Op.lte]: db.sequelize.literal(
                    `(SELECT end_date FROM academic_years WHERE academic_year_id = ${academicYearId})`,
                  ),
                },
              }
            : undefined,
        },
      ],
    });

    // Calculate involvement statistics
    const stats = faculty.map((f) => ({
      faculty_id: f.faculty_id,
      faculty_name: `${f.first_name} ${f.last_name}`,
      count: f.extension_activities ? f.extension_activities.length : 0,
    }));

    // Calculate total and percentages
    const total = stats.reduce((sum, s) => sum + s.count, 0);
    const data = stats
      .filter((s) => s.count > 0)
      .map((s) => ({
        ...s,
        percentage: total > 0 ? ((s.count / total) * 100).toFixed(0) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    res.json({
      title: "Faculty Involvement in Extension Services",
      subtitle: "(Permanent and Temporary)",
      data,
      total,
    });
  } catch (error) {
    console.error("Get extension involvement error:", error);
    res.status(500).json({ message: "Error fetching extension involvement" });
  }
};

// Get faculty involvement in seminars/trainings/conferences
exports.getSeminarsInvolvement = async (req, res) => {
  try {
    const deanId = req.user.user_id;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const academicYearId = req.query.academic_year_id;

    // Get all faculty in dean's department
    const faculty = await db.Faculty.findAll({
      where: { department: dean.department },
      include: [
        {
          model: db.FacultySeminarsTrainings,
          as: "seminars_trainings",
          required: false,
          where: academicYearId
            ? {
                date_from: {
                  [Op.gte]: db.sequelize.literal(
                    `(SELECT start_date FROM academic_years WHERE academic_year_id = ${academicYearId})`,
                  ),
                },
                date_to: {
                  [Op.lte]: db.sequelize.literal(
                    `(SELECT end_date FROM academic_years WHERE academic_year_id = ${academicYearId})`,
                  ),
                },
              }
            : undefined,
        },
      ],
    });

    // Calculate involvement statistics
    const stats = faculty.map((f) => ({
      faculty_id: f.faculty_id,
      faculty_name: `${f.first_name} ${f.last_name}`,
      count: f.seminars_trainings ? f.seminars_trainings.length : 0,
    }));

    // Calculate total and percentages
    const total = stats.reduce((sum, s) => sum + s.count, 0);
    const data = stats
      .filter((s) => s.count > 0)
      .map((s) => ({
        ...s,
        percentage: total > 0 ? ((s.count / total) * 100).toFixed(0) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    res.json({
      title: "Faculty Involvement in Seminars/Workshops/Trainings/Conferences",
      subtitle: "(Permanent and Temporary)",
      data,
      total,
    });
  } catch (error) {
    console.error("Get seminars involvement error:", error);
    res.status(500).json({ message: "Error fetching seminars involvement" });
  }
};

// Get faculty awards statistics
exports.getAwardsStatistics = async (req, res) => {
  try {
    const deanId = req.user.user_id;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const academicYearId = req.query.academic_year_id;

    // Get all faculty in dean's department
    const faculty = await db.Faculty.findAll({
      where: { department: dean.department },
      include: [
        {
          model: db.FacultyAwards,
          as: "awards",
          required: false,
          where: academicYearId
            ? {
                date_received: {
                  [Op.between]: [
                    db.sequelize.literal(
                      `(SELECT start_date FROM academic_years WHERE academic_year_id = ${academicYearId})`,
                    ),
                    db.sequelize.literal(
                      `(SELECT end_date FROM academic_years WHERE academic_year_id = ${academicYearId})`,
                    ),
                  ],
                },
              }
            : undefined,
        },
      ],
    });

    // Calculate awards statistics
    const stats = faculty.map((f) => ({
      faculty_id: f.faculty_id,
      faculty_name: `${f.first_name} ${f.last_name}`,
      count: f.awards ? f.awards.length : 0,
    }));

    // Calculate total and percentages
    const total = stats.reduce((sum, s) => sum + s.count, 0);
    const data = stats
      .filter((s) => s.count > 0)
      .map((s) => ({
        ...s,
        percentage: total > 0 ? ((s.count / total) * 100).toFixed(0) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    res.json({
      title: "Faculty Awards Received",
      subtitle: "(Permanent and Temporary)",
      data,
      total,
    });
  } catch (error) {
    console.error("Get awards statistics error:", error);
    res.status(500).json({ message: "Error fetching awards statistics" });
  }
};

// Get faculty professional membership statistics
exports.getMembershipStatistics = async (req, res) => {
  try {
    const deanId = req.user.user_id;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    // Get all faculty in dean's department
    const faculty = await db.Faculty.findAll({
      where: { department: dean.department },
      include: [
        {
          model: db.FacultyProfessionalMembership,
          as: "professional_memberships",
          required: false,
          where: {
            is_active: true,
          },
        },
      ],
    });

    // Calculate membership statistics
    const stats = faculty.map((f) => ({
      faculty_id: f.faculty_id,
      faculty_name: `${f.first_name} ${f.last_name}`,
      count: f.professional_memberships ? f.professional_memberships.length : 0,
    }));

    // Calculate total and percentages
    const total = stats.reduce((sum, s) => sum + s.count, 0);
    const data = stats
      .filter((s) => s.count > 0)
      .map((s) => ({
        ...s,
        percentage: total > 0 ? ((s.count / total) * 100).toFixed(0) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    res.json({
      title: "Faculty Professional Memberships",
      subtitle: "(Active Memberships)",
      data,
      total,
    });
  } catch (error) {
    console.error("Get membership statistics error:", error);
    res.status(500).json({ message: "Error fetching membership statistics" });
  }
};

// Get comprehensive faculty analytics dashboard
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const deanId = req.user.user_id;

    // Get dean's department
    const dean = await db.Dean.findOne({
      where: { user_id: deanId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const academicYearId = req.query.academic_year_id;

    // Get all faculty in dean's department with all profile data
    const faculty = await db.Faculty.findAll({
      where: { department: dean.department },
      include: [
        {
          model: db.FacultyResearchActivities,
          as: "research_activities",
          required: false,
        },
        {
          model: db.FacultyExtensionActivities,
          as: "extension_activities",
          required: false,
        },
        {
          model: db.FacultySeminarsTrainings,
          as: "seminars_trainings",
          required: false,
        },
        {
          model: db.FacultyAwards,
          as: "awards",
          required: false,
        },
        {
          model: db.FacultyProfessionalMembership,
          as: "professional_memberships",
          required: false,
          where: { is_active: true },
        },
      ],
    });

    // Calculate statistics for each category
    const calculateStats = (category) => {
      const stats = faculty.map((f) => ({
        faculty_id: f.faculty_id,
        faculty_name: `${f.first_name} ${f.last_name}`,
        count: f[category] ? f[category].length : 0,
      }));

      const total = stats.reduce((sum, s) => sum + s.count, 0);
      return stats
        .filter((s) => s.count > 0)
        .map((s) => ({
          ...s,
          percentage: total > 0 ? ((s.count / total) * 100).toFixed(0) : 0,
        }))
        .sort((a, b) => b.count - a.count);
    };

    res.json({
      research_involvement: {
        title:
          "Faculty Involvement in Research-related Seminars/Workshops/Trainings/Conferences",
        data: calculateStats("research_activities"),
      },
      extension_involvement: {
        title: "Faculty Involvement in Extension Services",
        data: calculateStats("extension_activities"),
      },
      seminars_involvement: {
        title:
          "Faculty Involvement in Seminars/Workshops/Trainings/Conferences",
        data: calculateStats("seminars_trainings"),
      },
      awards: {
        title: "Faculty Awards Received",
        data: calculateStats("awards"),
      },
      memberships: {
        title: "Faculty Professional Memberships",
        data: calculateStats("professional_memberships"),
      },
      total_faculty: faculty.length,
    });
  } catch (error) {
    console.error("Get dashboard analytics error:", error);
    res.status(500).json({ message: "Error fetching dashboard analytics" });
  }
};
