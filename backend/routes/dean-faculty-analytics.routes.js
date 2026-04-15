const express = require("express");
const router = express.Router();
const deanFacultyAnalyticsController = require("../controllers/dean-faculty-analytics.controller");
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

// Middleware
router.use(verifyToken);
router.use(checkRole("dean"));

// Get research involvement statistics (for pie chart)
router.get(
  "/research-involvement",
  deanFacultyAnalyticsController.getResearchInvolvement,
);

// Get extension services involvement statistics (for pie chart)
router.get(
  "/extension-involvement",
  deanFacultyAnalyticsController.getExtensionInvolvement,
);

// Get seminars/trainings/conferences involvement statistics (for pie chart)
router.get(
  "/seminars-involvement",
  deanFacultyAnalyticsController.getSeminarsInvolvement,
);

// Get awards statistics (for pie chart)
router.get("/awards", deanFacultyAnalyticsController.getAwardsStatistics);

// Get professional membership statistics (for pie chart)
router.get(
  "/memberships",
  deanFacultyAnalyticsController.getMembershipStatistics,
);

// Get comprehensive dashboard analytics (all charts data)
router.get("/dashboard", deanFacultyAnalyticsController.getDashboardAnalytics);

module.exports = router;
