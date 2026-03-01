const express = require("express");
const router = express.Router();
const programController = require("../controllers/program.controller");
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

// All routes require authentication and superadmin role
router.use(verifyToken);
router.use(checkRole("superadmin"));

router.get("/", programController.getPrograms);
router.post("/", programController.createProgram);
router.put("/:id", programController.updateProgram);
router.delete("/:id", programController.deleteProgram);

module.exports = router;
