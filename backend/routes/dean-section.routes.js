const express = require("express");
const router = express.Router();
const deanSectionController = require("../controllers/dean-section.controller");
const verifyToken = require("../middleware/auth.middleware");
const checkRole = require("../middleware/role.middleware");

router.use(verifyToken);
router.use(checkRole("dean"));

router.get("/", deanSectionController.getSections);
router.post("/", deanSectionController.createSection);
router.put("/:id", deanSectionController.updateSection);
router.delete("/:id", deanSectionController.deleteSection);

module.exports = router;
