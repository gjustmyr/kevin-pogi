const db = require("../models");
const { Op } = require("sequelize");

// Generate 5-digit employee ID for faculty
const generateEmployeeId = async () => {
  let employeeId;
  let exists = true;

  while (exists) {
    // Generate random 5-digit number
    employeeId = Math.floor(10000 + Math.random() * 90000).toString();

    // Check if it already exists
    const existing = await db.Faculty.findOne({
      where: { employee_id: employeeId },
    });
    exists = !!existing;
  }

  return employeeId;
};

// Get all faculty with pagination (READ ONLY for superadmin)
exports.getFaculty = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const department_id = req.query.department_id;

    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    if (department_id) {
      whereClause.department_id = department_id;
    }

    const { count, rows } = await db.Faculty.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["last_name", "ASC"]],
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
      faculty: rows,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    });
  } catch (error) {
    console.error("Get faculty error:", error);
    res.status(500).json({ message: "Error fetching faculty" });
  }
};
