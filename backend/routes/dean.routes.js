const express = require("express");
const router = express.Router();
const deanController = require("../controllers/dean.controller");
const deanOrgDashboardController = require("../controllers/dean-organization-dashboard.controller");
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

// Get current dean's profile
router.get(
  "/profile",
  verifyToken,
  checkRole("dean"),
  deanController.getProfile,
);

// Get organization dashboard statistics
router.get(
  "/organizations/dashboard",
  verifyToken,
  checkRole("dean"),
  deanOrgDashboardController.getOrganizationDashboard,
);

module.exports = router;
