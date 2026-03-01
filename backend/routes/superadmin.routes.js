const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

// Superadmin dashboard
router.get("/", verifyToken, checkRole("superadmin"), (req, res) => {
	res.json({
		message: "Superadmin Dashboard",
		user: req.user,
	});
});

module.exports = router;
