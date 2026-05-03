const db = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for photo and signature uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/pds");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files (jpeg, jpg, png) are allowed!"));
    }
  },
});

// GET: Retrieve dean's Personal Data Sheet
exports.getPDS = async (req, res) => {
  try {
    const deanUserId = req.user.user_id;

    // Get dean from user_id
    const dean = await db.Dean.findOne({
      where: { user_id: deanUserId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    // Get PDS with all related data
    const pds = await db.PersonalDataSheet.findOne({
      where: { dean_id: dean.dean_id },
      include: [
        { model: db.PDSChild, as: "children" },
        { model: db.PDSEducation, as: "education" },
        { model: db.PDSEligibility, as: "eligibilities" },
        { model: db.PDSWorkExperience, as: "work_experiences" },
        { model: db.PDSVoluntaryWork, as: "voluntary_works" },
        { model: db.PDSTraining, as: "trainings" },
        { model: db.PDSOtherInfo, as: "other_info" },
        { model: db.PDSReference, as: "references" },
      ],
    });

    if (!pds) {
      return res.status(404).json({ message: "Personal Data Sheet not found" });
    }

    res.json(pds);
  } catch (error) {
    console.error("Get PDS error:", error);
    res.status(500).json({ message: "Error retrieving Personal Data Sheet" });
  }
};

// POST: Create or Update Personal Data Sheet (simplified - reuses faculty logic)
exports.savePDS = async (req, res) => {
  try {
    const deanUserId = req.user.user_id;

    const dean = await db.Dean.findOne({
      where: { user_id: deanUserId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const pdsData = { ...req.body, dean_id: dean.dean_id };
    delete pdsData.faculty_id; // Remove if exists

    let pds = await db.PersonalDataSheet.findOne({
      where: { dean_id: dean.dean_id },
    });

    if (pds) {
      await pds.update(pdsData);
    } else {
      pds = await db.PersonalDataSheet.create(pdsData);
    }

    // Handle related data (children, education, etc.) - simplified
    // You can expand this similar to faculty controller

    res.json({ message: "Personal Data Sheet saved successfully", pds });
  } catch (error) {
    console.error("Save PDS error:", error);
    res.status(500).json({ message: "Error saving Personal Data Sheet" });
  }
};

// POST: Upload photo
exports.uploadPhoto = [
  upload.single("photo"),
  async (req, res) => {
    try {
      const deanUserId = req.user.user_id;

      const dean = await db.Dean.findOne({
        where: { user_id: deanUserId },
      });

      if (!dean) {
        return res.status(404).json({ message: "Dean profile not found" });
      }

      const pds = await db.PersonalDataSheet.findOne({
        where: { dean_id: dean.dean_id },
      });

      if (!pds) {
        return res
          .status(404)
          .json({ message: "Personal Data Sheet not found" });
      }

      if (pds.photo_path) {
        const oldPhotoPath = path.join(__dirname, "../", pds.photo_path);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }

      const photoPath = `uploads/pds/${req.file.filename}`;
      await pds.update({ photo_path: photoPath });

      res.json({
        message: "Photo uploaded successfully",
        photo_path: photoPath,
      });
    } catch (error) {
      console.error("Upload photo error:", error);
      res.status(500).json({ message: "Error uploading photo" });
    }
  },
];

// POST: Upload signature
exports.uploadSignature = [
  upload.single("signature"),
  async (req, res) => {
    try {
      const deanUserId = req.user.user_id;

      const dean = await db.Dean.findOne({
        where: { user_id: deanUserId },
      });

      if (!dean) {
        return res.status(404).json({ message: "Dean profile not found" });
      }

      const pds = await db.PersonalDataSheet.findOne({
        where: { dean_id: dean.dean_id },
      });

      if (!pds) {
        return res
          .status(404)
          .json({ message: "Personal Data Sheet not found" });
      }

      if (pds.signature_path) {
        const oldSignaturePath = path.join(
          __dirname,
          "../",
          pds.signature_path,
        );
        if (fs.existsSync(oldSignaturePath)) {
          fs.unlinkSync(oldSignaturePath);
        }
      }

      const signaturePath = `uploads/pds/${req.file.filename}`;
      await pds.update({ signature_path: signaturePath });

      res.json({
        message: "Signature uploaded successfully",
        signature_path: signaturePath,
      });
    } catch (error) {
      console.error("Upload signature error:", error);
      res.status(500).json({ message: "Error uploading signature" });
    }
  },
];

// POST: Submit PDS for approval
exports.submitPDS = async (req, res) => {
  try {
    const deanUserId = req.user.user_id;

    const dean = await db.Dean.findOne({
      where: { user_id: deanUserId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    const pds = await db.PersonalDataSheet.findOne({
      where: { dean_id: dean.dean_id },
    });

    if (!pds) {
      return res.status(404).json({ message: "Personal Data Sheet not found" });
    }

    if (pds.status === "submitted" || pds.status === "approved") {
      return res.status(400).json({
        message: "Personal Data Sheet has already been submitted",
      });
    }

    if (!pds.photo_path) {
      return res
        .status(400)
        .json({ message: "Please upload a photo before submitting" });
    }

    await pds.update({
      status: "submitted",
      submitted_at: new Date(),
    });

    res.json({
      message: "Personal Data Sheet submitted successfully",
    });
  } catch (error) {
    console.error("Submit PDS error:", error);
    res.status(500).json({ message: "Error submitting Personal Data Sheet" });
  }
};

// POST: Import data from My Profile to PDS
exports.importFromProfile = async (req, res) => {
  try {
    const deanUserId = req.user.user_id;

    const dean = await db.Dean.findOne({
      where: { user_id: deanUserId },
    });

    if (!dean) {
      return res.status(404).json({ message: "Dean profile not found" });
    }

    // Get ALL profile data
    const personalProfile = await db.DeanPersonalProfile.findOne({
      where: { dean_id: dean.dean_id },
    });

    const academicProfiles = await db.DeanAcademicProfile.findAll({
      where: { dean_id: dean.dean_id },
      order: [["year_graduated", "ASC"]],
    });

    const employmentProfiles = await db.DeanEmploymentProfile.findAll({
      where: { dean_id: dean.dean_id },
      order: [["date_from", "DESC"]],
    });

    const seminars = await db.DeanSeminarsTrainings.findAll({
      where: { dean_id: dean.dean_id },
      order: [["date", "DESC"]],
    });

    const memberships = await db.DeanProfessionalMembership.findAll({
      where: { dean_id: dean.dean_id },
    });

    const awards = await db.DeanAwards.findAll({
      where: { dean_id: dean.dean_id },
      order: [["date_received", "DESC"]],
    });

    const researchActivities = await db.DeanResearchActivities.findAll({
      where: { dean_id: dean.dean_id },
      order: [["date", "DESC"]],
    });

    const extensionActivities = await db.DeanExtensionActivities.findAll({
      where: { dean_id: dean.dean_id },
      order: [["date_of_implementation", "DESC"]],
    });

    // Get or create PDS
    let pds = await db.PersonalDataSheet.findOne({
      where: { dean_id: dean.dean_id },
    });

    const pdsData = {
      dean_id: dean.dean_id,
    };

    // Map personal profile data
    if (personalProfile) {
      pdsData.surname = personalProfile.last_name || "";
      pdsData.first_name = personalProfile.first_name || "";
      pdsData.middle_name = personalProfile.middle_name || "";
      pdsData.date_of_birth = personalProfile.date_of_birth || "";
      pdsData.place_of_birth = personalProfile.place_of_birth || "";
      pdsData.sex = personalProfile.sex || "Male";
      pdsData.civil_status = personalProfile.civil_status || "Single";
      pdsData.mobile_no = personalProfile.mobile_number_primary || "";
      pdsData.email_address = personalProfile.email_primary || "";
      pdsData.citizenship_type = personalProfile.citizenship || "Filipino";
      pdsData.residential_city = personalProfile.home_barangay || "";
      pdsData.residential_province = personalProfile.home_province || "";
      pdsData.permanent_city = personalProfile.home_barangay || "";
      pdsData.permanent_province = personalProfile.home_province || "";
    }

    if (pds) {
      // Update existing PDS - always sync with latest My Profile data
      await pds.update(pdsData);
    } else {
      pds = await db.PersonalDataSheet.create(pdsData);
    }

    // Import academic profiles as education records
    for (const academic of academicProfiles) {
      const existingEducation = await db.PDSEducation.findOne({
        where: {
          pds_id: pds.pds_id,
          school_name: academic.school_name,
          degree_course: academic.degree_course,
        },
      });

      if (!existingEducation) {
        await db.PDSEducation.create({
          pds_id: pds.pds_id,
          level: "COLLEGE",
          school_name: academic.school_name || "",
          degree_course: academic.degree_course || "",
          year_graduated: academic.year_graduated || null,
          scholarship_honors: academic.honors_received || "",
        });
      }
    }

    // Import employment profiles as work experience
    for (const employment of employmentProfiles) {
      const existingWork = await db.PDSWorkExperience.findOne({
        where: {
          pds_id: pds.pds_id,
          position_title: employment.position_title,
          department_agency: employment.company_name,
          date_from: employment.date_from,
        },
      });

      if (!existingWork) {
        await db.PDSWorkExperience.create({
          pds_id: pds.pds_id,
          date_from: employment.date_from || "",
          date_to: employment.date_to || null,
          position_title: employment.position_title || "",
          department_agency: employment.company_name || "",
          monthly_salary: employment.monthly_salary || null,
          salary_grade: employment.salary_grade || null,
          status_of_appointment: employment.employment_status || "",
          is_government_service:
            employment.is_government_service !== undefined
              ? employment.is_government_service
              : null,
        });
      }
    }

    // Import seminars/trainings
    for (const seminar of seminars) {
      const existingTraining = await db.PDSTraining.findOne({
        where: {
          pds_id: pds.pds_id,
          title: seminar.title,
          date_from: seminar.date,
        },
      });

      if (!existingTraining) {
        await db.PDSTraining.create({
          pds_id: pds.pds_id,
          title: seminar.title || "",
          date_from: seminar.date || "",
          date_to: seminar.date || "",
          number_of_hours: null,
          type_of_ld: seminar.category || "",
          conducted_by:
            seminar.training_provider || seminar.sponsoring_agency || "",
        });
      }
    }

    // Import professional memberships as other info (MEMBERSHIP)
    for (const membership of memberships) {
      const existingMembership = await db.PDSOtherInfo.findOne({
        where: {
          pds_id: pds.pds_id,
          info_type: "MEMBERSHIP",
          details: membership.organization_name,
        },
      });

      if (!existingMembership) {
        await db.PDSOtherInfo.create({
          pds_id: pds.pds_id,
          info_type: "MEMBERSHIP",
          details: `${membership.organization_name} - ${membership.position || "Member"}`,
        });
      }
    }

    // Import awards as other info (RECOGNITION)
    for (const award of awards) {
      const existingAward = await db.PDSOtherInfo.findOne({
        where: {
          pds_id: pds.pds_id,
          info_type: "RECOGNITION",
          details: award.award_title,
        },
      });

      if (!existingAward) {
        await db.PDSOtherInfo.create({
          pds_id: pds.pds_id,
          info_type: "RECOGNITION",
          details: `${award.award_title} - ${award.awarding_body} (${award.date_received || "N/A"})`,
        });
      }
    }

    // Import research activities as voluntary work
    for (const research of researchActivities) {
      const existingResearch = await db.PDSVoluntaryWork.findOne({
        where: {
          pds_id: pds.pds_id,
          organization_name: research.sponsoring_agency,
          position_nature_of_work: research.research_title,
        },
      });

      if (!existingResearch) {
        await db.PDSVoluntaryWork.create({
          pds_id: pds.pds_id,
          organization_name: research.sponsoring_agency || "",
          date_from: research.date || "",
          date_to: research.date || "",
          number_of_hours: null,
          position_nature_of_work: `Research: ${research.research_title}`,
        });
      }
    }

    // Import extension activities as voluntary work
    for (const extension of extensionActivities) {
      const existingExtension = await db.PDSVoluntaryWork.findOne({
        where: {
          pds_id: pds.pds_id,
          organization_name: extension.beneficiary,
          position_nature_of_work: extension.extension_title,
        },
      });

      if (!existingExtension) {
        await db.PDSVoluntaryWork.create({
          pds_id: pds.pds_id,
          organization_name: extension.beneficiary || "",
          date_from: extension.date_of_implementation || "",
          date_to: extension.date_of_implementation || "",
          number_of_hours: null,
          position_nature_of_work: `Extension: ${extension.extension_title} (${extension.location})`,
        });
      }
    }

    // Fetch complete PDS with all relations
    const completePDS = await db.PersonalDataSheet.findOne({
      where: { pds_id: pds.pds_id },
      include: [
        { model: db.PDSChild, as: "children" },
        { model: db.PDSEducation, as: "education" },
        { model: db.PDSEligibility, as: "eligibilities" },
        { model: db.PDSWorkExperience, as: "work_experiences" },
        { model: db.PDSVoluntaryWork, as: "voluntary_works" },
        { model: db.PDSTraining, as: "trainings" },
        { model: db.PDSOtherInfo, as: "other_info" },
        { model: db.PDSReference, as: "references" },
      ],
    });

    res.json(completePDS);
  } catch (error) {
    console.error("Import from profile error:", error);
    res.status(500).json({ message: "Error importing profile data" });
  }
};
