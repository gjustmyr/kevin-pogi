const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/department.controller");
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

// All routes require authentication and admin role
router.use(verifyToken);
router.use(checkRole("admin", "superadmin"));

// Get all departments with pagination
router.get("/", departmentController.getDepartments);

// Get active departments
router.get("/active", departmentController.getActiveDepartments);

// Create department
router.post("/", departmentController.createDepartment);

// Update department
router.put("/:id", departmentController.updateDepartment);

// Delete department
router.delete("/:id", departmentController.deleteDepartment);

module.exports = router;
