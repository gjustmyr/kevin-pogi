const express = require("express");
const router = express.Router();
const courseAssignmentController = require("../controllers/dean-course-assignment.controller");
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

router.use(verifyToken);
router.use(checkRole("dean"));

router.get("/", courseAssignmentController.getCourseAssignments);
router.post("/", courseAssignmentController.createCourseAssignment);
router.post("/bulk", courseAssignmentController.bulkCreateAssignments);
router.put("/:id", courseAssignmentController.updateCourseAssignment);
router.delete("/:id", courseAssignmentController.deleteCourseAssignment);
router.get(
  "/faculty/:faculty_id/workload",
  courseAssignmentController.getFacultyWorkload,
);

module.exports = router;
