const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/section.controller");
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

// All routes require authentication and superadmin role
router.use(verifyToken);
router.use(checkRole("superadmin"));

router.get("/", sectionController.getSections);
router.post("/", sectionController.createSection);
router.put("/:id", sectionController.updateSection);
router.delete("/:id", sectionController.deleteSection);

module.exports = router;
