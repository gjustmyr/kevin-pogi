const db = require("../models");
const Dean = db.Dean;

// Get current dean's profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const dean = await Dean.findOne({
      where: { user_id: userId },
      attributes: [
        "dean_id",
        "employee_id",
        "first_name",
        "middle_name",
        "last_name",
        "email",
        "contact_number",
        "department",
      ],
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    res.json(dean);
  } catch (error) {
    console.error("Get dean profile error:", error);
    res.status(500).json({ message: "Error fetching dean profile" });
  }
};
