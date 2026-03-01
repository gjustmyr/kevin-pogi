const express = require("express");
const router = express.Router();
const deanProgramController = require("../controllers/dean-program.controller");
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

// All routes require authentication and dean role
router.use(verifyToken);
router.use(checkRole("dean"));

// GET /api/dean/programs - Get all programs for dean's department
router.get("/", deanProgramController.getPrograms);

// POST /api/dean/programs - Create program
router.post("/", deanProgramController.createProgram);

// PUT /api/dean/programs/:id - Update program
router.put("/:id", deanProgramController.updateProgram);

// DELETE /api/dean/programs/:id - Delete program
router.delete("/:id", deanProgramController.deleteProgram);

module.exports = router;
