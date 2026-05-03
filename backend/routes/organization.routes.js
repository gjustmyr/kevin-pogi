const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");
const memberController = require("../controllers/organization-member.controller");
const documentController = require("../controllers/organization-document.controller");
const adviserController = require("../controllers/organization-adviser.controller");

// Configure multer for document uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/organization-documents/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|doc|docx|xls|xlsx|jpg|jpeg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only documents and images are allowed"));
    }
  },
});

// Configure multer for Excel file uploads (memory storage for parsing)
const fs = require("fs");
const csvUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = "uploads/temp/";
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, "members-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /csv|xls|xlsx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype =
      file.mimetype === "text/csv" ||
      file.mimetype === "application/vnd.ms-excel" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only CSV or Excel files (.csv, .xls, .xlsx) are allowed"));
    }
  },
});

// Organization dashboard
router.get("/", verifyToken, checkRole("organization"), (req, res) => {
  res.json({
    message: "Organization Dashboard",
    user: req.user,
  });
});

// Member routes
router.get(
  "/members",
  verifyToken,
  checkRole("organization"),
  memberController.getMembers,
);
router.get(
  "/members/search-history",
  verifyToken,
  checkRole("organization"),
  memberController.searchMemberHistory,
);
router.get(
  "/members/hierarchy",
  verifyToken,
  checkRole("organization"),
  memberController.getHierarchy,
);
router.post(
  "/members",
  verifyToken,
  checkRole("organization"),
  memberController.createMember,
);
router.put(
  "/members/:id",
  verifyToken,
  checkRole("organization"),
  memberController.updateMember,
);
router.delete(
  "/members/:id",
  verifyToken,
  checkRole("organization"),
  memberController.deleteMember,
);

// Position templates
router.get(
  "/positions",
  verifyToken,
  checkRole("organization"),
  memberController.getPositionTemplates,
);

// Bulk upload routes
router.get(
  "/members/template/download",
  verifyToken,
  checkRole("organization"),
  memberController.downloadTemplate,
);
router.post(
  "/members/bulk-upload",
  verifyToken,
  checkRole("organization"),
  csvUpload.single("file"),
  memberController.bulkUploadMembers,
);

// Document routes
router.get(
  "/documents",
  verifyToken,
  checkRole("organization"),
  documentController.getDocuments,
);
router.get(
  "/documents/types",
  verifyToken,
  checkRole("organization"),
  documentController.getDocumentTypes,
);
router.get(
  "/documents/checklist",
  verifyToken,
  checkRole("organization"),
  documentController.getSubmissionChecklist,
);
router.post(
  "/documents",
  verifyToken,
  checkRole("organization"),
  upload.single("document"),
  documentController.submitDocument,
);
router.put(
  "/documents/:id",
  verifyToken,
  checkRole("organization"),
  upload.single("document"),
  documentController.updateDocument,
);
router.delete(
  "/documents/:id",
  verifyToken,
  checkRole("organization"),
  documentController.deleteDocument,
);
router.get(
  "/documents/:id/download",
  verifyToken,
  checkRole("organization"),
  documentController.downloadDocument,
);

// Adviser routes
router.get(
  "/advisers",
  verifyToken,
  checkRole("organization"),
  adviserController.getAdvisers,
);

// Demographics routes
router.get(
  "/demographics",
  verifyToken,
  checkRole("organization"),
  memberController.getDemographics,
);

module.exports = router;
