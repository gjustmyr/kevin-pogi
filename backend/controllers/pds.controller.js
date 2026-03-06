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

// GET: Retrieve faculty's Personal Data Sheet
exports.getPDS = async (req, res) => {
	try {
		const facultyUserId = req.user.user_id;

		// Get faculty from user_id
		const faculty = await db.Faculty.findOne({
			where: { user_id: facultyUserId },
		});

		if (!faculty) {
			return res.status(404).json({ message: "Faculty profile not found" });
		}

		// Get PDS with all related data
		const pds = await db.PersonalDataSheet.findOne({
			where: { faculty_id: faculty.faculty_id },
			include: [
				{
					model: db.PDSChild,
					as: "children",
				},
				{
					model: db.PDSEducation,
					as: "education",
				},
				{
					model: db.PDSEligibility,
					as: "eligibilities",
				},
				{
					model: db.PDSWorkExperience,
					as: "work_experiences",
				},
				{
					model: db.PDSVoluntaryWork,
					as: "voluntary_works",
				},
				{
					model: db.PDSTraining,
					as: "trainings",
				},
				{
					model: db.PDSOtherInfo,
					as: "other_info",
				},
				{
					model: db.PDSReference,
					as: "references",
				},
			],
		});

		if (!pds) {
			return res
				.status(404)
				.json({ message: "Personal Data Sheet not found" });
		}

		res.json(pds);
	} catch (error) {
		console.error("Get PDS error:", error);
		res.status(500).json({ message: "Error retrieving Personal Data Sheet" });
	}
};

// POST: Create or Update Personal Data Sheet
exports.savePDS = async (req, res) => {
	try {
		const facultyUserId = req.user.user_id;

		// Get faculty from user_id
		const faculty = await db.Faculty.findOne({
			where: { user_id: facultyUserId },
		});

		if (!faculty) {
			return res.status(404).json({ message: "Faculty profile not found" });
		}

		const {
			// Personal Information
			surname,
			first_name,
			middle_name,
			name_extension,
			date_of_birth,
			place_of_birth,
			sex,
			civil_status,
			height,
			weight,
			blood_type,
			gsis_id_no,
			pag_ibig_id_no,
			philhealth_no,
			sss_no,
			tin_no,
			agency_employee_no,
			citizenship_type,
			dual_citizenship_country,
			// Addresses
			residential_house_no,
			residential_street,
			residential_subdivision,
			residential_barangay,
			residential_city,
			residential_province,
			residential_zip_code,
			permanent_house_no,
			permanent_street,
			permanent_subdivision,
			permanent_barangay,
			permanent_city,
			permanent_province,
			permanent_zip_code,
			telephone_no,
			mobile_no,
			email_address,
			// Family Background
			spouse_surname,
			spouse_first_name,
			spouse_middle_name,
			spouse_name_ext,
			spouse_occupation,
			spouse_employer,
			spouse_business_address,
			spouse_telephone,
			father_surname,
			father_first_name,
			father_middle_name,
			father_name_ext,
			mother_surname,
			mother_first_name,
			mother_middle_name,
			// Questionnaire Answers
			q34_a_answer,
			q34_a_details,
			q34_b_answer,
			q34_b_details,
			q35_a_answer,
			q35_a_details,
			q35_b_answer,
			q35_b_details,
			q36_answer,
			q36_details,
			q36_date_filed,
			q36_case_status,
			q37_answer,
			q37_details,
			q38_answer,
			q38_details,
			q39_answer,
			q39_details,
			q40_answer,
			q40_details,
			q41_answer,
			q41_country,
			q42_answer,
			q42_group,
			q43_answer,
			q43_id_no,
			q44_answer,
			q44_id_no,
			government_issued_id,
			government_id_number,
			government_id_date_issued,
			// Related data
			children,
			education,
			eligibilities,
			work_experiences,
			voluntary_works,
			trainings,
			other_info,
			references,
		} = req.body;

		// Check if PDS already exists for this faculty
		let pds = await db.PersonalDataSheet.findOne({
			where: { faculty_id: faculty.faculty_id },
		});

		const pdsData = {
			faculty_id: faculty.faculty_id,
			surname,
			first_name,
			middle_name,
			name_extension,
			date_of_birth,
			place_of_birth,
			sex,
			civil_status,
			height,
			weight,
			blood_type,
			gsis_id_no,
			pag_ibig_id_no,
			philhealth_no,
			sss_no,
			tin_no,
			agency_employee_no,
			citizenship_type,
			dual_citizenship_country,
			residential_house_no,
			residential_street,
			residential_subdivision,
			residential_barangay,
			residential_city,
			residential_province,
			residential_zip_code,
			permanent_house_no,
			permanent_street,
			permanent_subdivision,
			permanent_barangay,
			permanent_city,
			permanent_province,
			permanent_zip_code,
			telephone_no,
			mobile_no,
			email_address,
			spouse_surname,
			spouse_first_name,
			spouse_middle_name,
			spouse_name_ext,
			spouse_occupation,
			spouse_employer,
			spouse_business_address,
			spouse_telephone,
			father_surname,
			father_first_name,
			father_middle_name,
			father_name_ext,
			mother_surname,
			mother_first_name,
			mother_middle_name,
			q34_a_answer,
			q34_a_details,
			q34_b_answer,
			q34_b_details,
			q35_a_answer,
			q35_a_details,
			q35_b_answer,
			q35_b_details,
			q36_answer,
			q36_details,
			q36_date_filed,
			q36_case_status,
			q37_answer,
			q37_details,
			q38_answer,
			q38_details,
			q39_answer,
			q39_details,
			q40_answer,
			q40_details,
			q41_answer,
			q41_country,
			q42_answer,
			q42_group,
			q43_answer,
			q43_id_no,
			q44_answer,
			q44_id_no,
			government_issued_id,
			government_id_number,
			government_id_date_issued,
			status: "draft",
		};

		if (pds) {
			// Update existing PDS
			await pds.update(pdsData);
		} else {
			// Create new PDS
			pds = await db.PersonalDataSheet.create(pdsData);
		}

		// Save related data
		if (children && Array.isArray(children)) {
			// Delete existing children and recreate
			await db.PDSChild.destroy({ where: { pds_id: pds.pds_id } });
			for (const child of children) {
				await db.PDSChild.create({
					pds_id: pds.pds_id,
					...child,
				});
			}
		}

		if (education && Array.isArray(education)) {
			await db.PDSEducation.destroy({ where: { pds_id: pds.pds_id } });
			for (const edu of education) {
				await db.PDSEducation.create({
					pds_id: pds.pds_id,
					...edu,
				});
			}
		}

		if (eligibilities && Array.isArray(eligibilities)) {
			await db.PDSEligibility.destroy({ where: { pds_id: pds.pds_id } });
			for (const eligibility of eligibilities) {
				await db.PDSEligibility.create({
					pds_id: pds.pds_id,
					...eligibility,
				});
			}
		}

		if (work_experiences && Array.isArray(work_experiences)) {
			await db.PDSWorkExperience.destroy({ where: { pds_id: pds.pds_id } });
			for (const work of work_experiences) {
				await db.PDSWorkExperience.create({
					pds_id: pds.pds_id,
					...work,
				});
			}
		}

		if (voluntary_works && Array.isArray(voluntary_works)) {
			await db.PDSVoluntaryWork.destroy({ where: { pds_id: pds.pds_id } });
			for (const voluntary of voluntary_works) {
				await db.PDSVoluntaryWork.create({
					pds_id: pds.pds_id,
					...voluntary,
				});
			}
		}

		if (trainings && Array.isArray(trainings)) {
			await db.PDSTraining.destroy({ where: { pds_id: pds.pds_id } });
			for (const training of trainings) {
				await db.PDSTraining.create({
					pds_id: pds.pds_id,
					...training,
				});
			}
		}

		if (other_info && Array.isArray(other_info)) {
			await db.PDSOtherInfo.destroy({ where: { pds_id: pds.pds_id } });
			for (const info of other_info) {
				await db.PDSOtherInfo.create({
					pds_id: pds.pds_id,
					...info,
				});
			}
		}

		if (references && Array.isArray(references)) {
			await db.PDSReference.destroy({ where: { pds_id: pds.pds_id } });
			for (const reference of references) {
				await db.PDSReference.create({
					pds_id: pds.pds_id,
					...reference,
				});
			}
		}

		res.json({
			message: "Personal Data Sheet saved successfully",
			pds_id: pds.pds_id,
		});
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
			const facultyUserId = req.user.user_id;

			const faculty = await db.Faculty.findOne({
				where: { user_id: facultyUserId },
			});

			if (!faculty) {
				return res.status(404).json({ message: "Faculty profile not found" });
			}

			const pds = await db.PersonalDataSheet.findOne({
				where: { faculty_id: faculty.faculty_id },
			});

			if (!pds) {
				return res
					.status(404)
					.json({ message: "Personal Data Sheet not found. Please save basic information first." });
			}

			if (!req.file) {
				return res.status(400).json({ message: "No file uploaded" });
			}

			// Delete old photo if exists
			if (pds.photo_path) {
				const oldPhotoPath = path.join(__dirname, "../", pds.photo_path);
				if (fs.existsSync(oldPhotoPath)) {
					fs.unlinkSync(oldPhotoPath);
				}
			}

			// Update PDS with new photo path
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
			const facultyUserId = req.user.user_id;

			const faculty = await db.Faculty.findOne({
				where: { user_id: facultyUserId },
			});

			if (!faculty) {
				return res.status(404).json({ message: "Faculty profile not found" });
			}

			const pds = await db.PersonalDataSheet.findOne({
				where: { faculty_id: faculty.faculty_id },
			});

			if (!pds) {
				return res
					.status(404)
					.json({ message: "Personal Data Sheet not found. Please save basic information first." });
			}

			if (!req.file) {
				return res.status(400).json({ message: "No file uploaded" });
			}

			// Delete old signature if exists
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

			// Update PDS with new signature path
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
		const facultyUserId = req.user.user_id;

		const faculty = await db.Faculty.findOne({
			where: { user_id: facultyUserId },
		});

		if (!faculty) {
			return res.status(404).json({ message: "Faculty profile not found" });
		}

		const pds = await db.PersonalDataSheet.findOne({
			where: { faculty_id: faculty.faculty_id },
		});

		if (!pds) {
			return res
				.status(404)
				.json({ message: "Personal Data Sheet not found" });
		}

		if (pds.status === "submitted" || pds.status === "approved") {
			return res.status(400).json({
				message: "Personal Data Sheet has already been submitted",
			});
		}

		// Validate required fields
		if (!pds.photo_path) {
			return res
				.status(400)
				.json({ message: "Please upload a photo before submitting" });
		}

		// Update status to submitted
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
