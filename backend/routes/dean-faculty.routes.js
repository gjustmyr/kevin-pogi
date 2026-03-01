const express = require("express");
const router = express.Router();
const deanFacultyController = require("../controllers/dean-faculty.controller");
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

router.use(verifyToken);
router.use(checkRole("dean"));

router.get("/", deanFacultyController.getFaculty);
router.post("/", deanFacultyController.createFaculty);
router.put("/:id", deanFacultyController.updateFaculty);
router.delete("/:id", deanFacultyController.deleteFaculty);

module.exports = router;
