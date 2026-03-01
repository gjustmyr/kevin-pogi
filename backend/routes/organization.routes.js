const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

// Organization dashboard
router.get("/", verifyToken, checkRole("organization"), (req, res) => {
	res.json({
		message: "Organization Dashboard",
		user: req.user,
	});
});

module.exports = router;
