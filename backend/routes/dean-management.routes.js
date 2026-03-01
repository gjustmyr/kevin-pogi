const express = require("express");
const router = express.Router();
const deanController = require("../controllers/dean.controller");
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

// All routes require authentication and admin role
router.use(verifyToken);
router.use(checkRole("admin", "superadmin"));

// Get all deans with pagination
router.get("/", deanController.getDeans);

// Get departments
router.get("/departments", deanController.getDepartments);

// Create dean
router.post("/", deanController.createDean);

// Update dean
router.put("/:id", deanController.updateDean);

// Delete dean
router.delete("/:id", deanController.deleteDean);

module.exports = router;
