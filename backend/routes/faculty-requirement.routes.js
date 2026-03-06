const express = require("express");
const router = express.Router();
const requirementController = require("../controllers/faculty-requirement.controller");
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");
const upload = require("../utils/upload");

router.use(verifyToken);
router.use(checkRole("faculty"));

// Get faculty's course assignments with requirement status
router.get("/assignments", requirementController.getMyAssignments);

// Get requirements for a specific assignment
router.get(
	"/assignments/:assignment_id/requirements",
	requirementController.getRequirementsByAssignment,
);

// Submit a requirement (with file upload)
router.post(
	"/submit",
	upload.single("file"),
	requirementController.submitRequirement,
);

// Delete a requirement submission
router.delete("/:submission_id", requirementController.deleteRequirement);

// Download a requirement file
router.get(
	"/:submission_id/download",
	requirementController.downloadRequirement,
);

module.exports = router;
