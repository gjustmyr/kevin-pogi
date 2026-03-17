const db = require("../models");

// Get static departments for dropdown
exports.getDepartments = async (req, res) => {
  try {
    const departments = [
      { department_id: 1, department_name: "College of Engineering" },
      { department_id: 2, department_name: "College of Education" },
      { department_id: 3, department_name: "College of Arts and Sciences" },
      { department_id: 4, department_name: "College of Business Administration" },
      { department_id: 5, department_name: "College of Information Technology" },
      { department_id: 6, department_name: "College of Nursing" },
    ];

    res.json(departments);
  } catch (error) {
    console.error("Get departments dropdown error:", error);
    res.status(500).json({ message: "Error fetching departments" });
  }
};

// Get static programs for dropdown
exports.getPrograms = async (req, res) => {
  try {
    const programs = [
      { program_id: 1, program_name: "Bachelor of Science in Computer Science", program_acronym: "BSCS" },
      { program_id: 2, program_name: "Bachelor of Science in Information Technology", program_acronym: "BSIT" },
      { program_id: 3, program_name: "Bachelor of Elementary Education", program_acronym: "BEEd" },
      { program_id: 4, program_name: "Bachelor of Secondary Education", program_acronym: "BSEd" },
      { program_id: 5, program_name: "Bachelor of Science in Business Administration", program_acronym: "BSBA" },
      { program_id: 6, program_name: "Bachelor of Science in Nursing", program_acronym: "BSN" },
    ];

    res.json(programs);
  } catch (error) {
    console.error("Get programs dropdown error:", error);
    res.status(500).json({ message: "Error fetching programs" });
  }
};

// Get static sections for dropdown
exports.getSections = async (req, res) => {
  try {
    const sections = [
      { section_id: 1, section_name: "Section A", year_level: 1 },
      { section_id: 2, section_name: "Section B", year_level: 1 },
      { section_id: 3, section_name: "Section C", year_level: 2 },
      { section_id: 4, section_name: "Section D", year_level: 2 },
      { section_id: 5, section_name: "Section E", year_level: 3 },
      { section_id: 6, section_name: "Section F", year_level: 4 },
    ];

    res.json(sections);
  } catch (error) {
    console.error("Get sections dropdown error:", error);
    res.status(500).json({ message: "Error fetching sections" });
  }
};

// Get static semester options
exports.getSemesters = async (req, res) => {
  try {
    const semesters = [
      { value: "1st Semester", label: "1st Semester" },
      { value: "2nd Semester", label: "2nd Semester" },
      { value: "Midterm 1", label: "Midterm 1" },
      { value: "Midterm 2", label: "Midterm 2" },
    ];

    res.json(semesters);
  } catch (error) {
    console.error("Get semesters dropdown error:", error);
    res.status(500).json({ message: "Error fetching semesters" });
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
