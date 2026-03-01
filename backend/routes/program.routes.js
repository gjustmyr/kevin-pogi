const express = require("express");
const router = express.Router();
const programController = require("../controllers/program.controller");
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

// All routes require authentication and admin role
router.use(verifyToken);
router.use(checkRole("admin", "superadmin"));

// Get all programs (with pagination, search, and filter)
router.get("/", programController.getPrograms);

// Get single program
router.get("/:id", programController.getProgram);

// Admin and SuperAdmin only routes
router.post("/", programController.createProgram);
router.put("/:id", programController.updateProgram);
router.delete("/:id", programController.deleteProgram);

module.exports = router;
