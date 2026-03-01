const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

// Dean dashboard
router.get("/", verifyToken, checkRole("dean"), (req, res) => {
	res.json({
		message: "Dean Dashboard",
		user: req.user,
	});
});

module.exports = router;
