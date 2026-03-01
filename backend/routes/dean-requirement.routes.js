const express = require("express");
const router = express.Router();
const requirementController = require("../controllers/dean-requirement.controller");
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

router.use(verifyToken);
router.use(checkRole("dean"));

// Get all requirement submissions for dean's department
router.get("/", requirementController.getAllRequirements);

// Get department-wide statistics
router.get("/statistics", requirementController.getDepartmentStatistics);

// Get faculty accomplishment summary
router.get(
  "/faculty/:faculty_id/accomplishment",
  requirementController.getFacultyAccomplishment
);

// Get requirements for a specific assignment
router.get(
  "/assignments/:assignment_id/requirements",
  requirementController.getAssignmentRequirements
);

// Clear a requirement (approve)
router.put("/:submission_id/clear", requirementController.clearRequirement);

// Return a requirement (needs revision)
router.put("/:submission_id/return", requirementController.returnRequirement);

// Download a requirement file
router.get(
  "/:submission_id/download",
  requirementController.downloadRequirement
);

module.exports = router;
