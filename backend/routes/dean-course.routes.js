const express = require("express");
const router = express.Router();
const deanCourseController = require("../controllers/dean-course.controller");
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

router.use(verifyToken);
router.use(checkRole("dean"));

router.get("/", deanCourseController.getCourses);
router.post("/", deanCourseController.createCourse);
router.put("/:id", deanCourseController.updateCourse);
router.delete("/:id", deanCourseController.deleteCourse);

module.exports = router;
