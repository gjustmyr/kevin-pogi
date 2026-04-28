const express = require("express");
const router = express.Router();
const multer = require("multer");
const eventController = require("../controllers/organization-event.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { isOrganization } = require("../middleware/role.middleware");

// Configure multer for CSV upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// All routes require authentication and organization role
router.use(verifyToken, isOrganization);

// Event CRUD
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEvent);
router.post("/", eventController.createEvent);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

// Attendee management
router.get("/:id/attendees", eventController.getAttendees);
router.post(
  "/:id/attendees/upload",
  upload.single("file"),
  eventController.uploadAttendees,
);
router.get("/template/download", eventController.downloadTemplate);
router.delete("/:id/attendees/:attendeeId", eventController.deleteAttendee);

module.exports = router;
