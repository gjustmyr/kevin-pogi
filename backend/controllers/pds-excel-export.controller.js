const db = require("../models");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

/**
 * Helper function to format dates as MM/DD/YYYY
 */
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
};

/**
 * Helper function to convert boolean to YES/NO
 */
const boolToYesNo = (value) => {
  if (value === null || value === undefined) return "";
  return value ? "YES" : "NO";
};

/**
 * Helper function to write value across merged cells
 */
const writeMergedCell = (worksheet, startCell, endCell, value) => {
  worksheet[startCell] = { v: value || "", t: "s" };
};

/**
 * Export PDS to Excel for Faculty
 */
exports.exportFacultyPDSToExcel = async (req, res) => {
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

    // Generate Excel file
    const workbook = await generatePDSExcel(pds);

    // Generate filename
    const surname = pds.surname || "Unknown";
    const firstName = pds.first_name || "Unknown";
    const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const filename = `PDS_${surname}_${firstName}_${dateStr}.xlsx`;

    // Write to buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Send buffer
    res.send(buffer);
  } catch (error) {
    console.error("Export PDS to Excel error:", error);
    res.status(500).json({ message: "Failed to generate Excel file" });
  }
};

/**
 * Export PDS to Excel for Dean
 */
exports.exportDeanPDSToExcel = async (req, res) => {
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

    // Generate Excel file
    const workbook = await generatePDSExcel(pds);

    // Generate filename
    const surname = pds.surname || "Unknown";
    const firstName = pds.first_name || "Unknown";
    const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const filename = `PDS_${surname}_${firstName}_${dateStr}.xlsx`;

    // Write to buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Send buffer
    res.send(buffer);
  } catch (error) {
    console.error("Export Dean PDS to Excel error:", error);
    res.status(500).json({ message: "Failed to generate Excel file" });
  }
};

/**
 * Generate PDS Excel workbook from PDS data
 */
async function generatePDSExcel(pds) {
  // Check if template exists
  const templatePath = path.join(
    __dirname,
    "../public/templates/pds-template.xlsx",
  );

  let workbook;
  let worksheet;

  if (fs.existsSync(templatePath)) {
    // Load template if it exists
    workbook = XLSX.readFile(templatePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
  } else {
    // Create new workbook if template doesn't exist
    workbook = XLSX.utils.book_new();
    worksheet = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "PDS");
  }

  // PERSONAL INFORMATION SECTION
  // Surname: D10 to N10
  writeMergedCell(worksheet, "D10", "N10", pds.surname);

  // First name: D11 to K11
  writeMergedCell(worksheet, "D11", "K11", pds.first_name);

  // Name Extension: L11 to N11
  writeMergedCell(worksheet, "L11", "N11", pds.name_extension);

  // Middle name: D12 to N12
  writeMergedCell(worksheet, "D12", "N12", pds.middle_name);

  // Date of Birth: D13 to F13
  writeMergedCell(worksheet, "D13", "F13", formatDate(pds.date_of_birth));

  // Place of birth: D15 to F15
  writeMergedCell(worksheet, "D15", "F15", pds.place_of_birth);

  // Sex: Mark checkbox with "X" (D16 for Male, F16 for Female based on merged cell D16:F16)
  if (pds.sex === "Male") {
    worksheet["E16"] = { v: "X", t: "s" };
  } else if (pds.sex === "Female") {
    worksheet["F16"] = { v: "X", t: "s" };
  }

  // Civil Status: Mark checkbox with "X" (D17:F18 merged for Single, P11-P16 for others)
  if (pds.civil_status === "Single") {
    worksheet["E17"] = { v: "X", t: "s" };
  } else if (pds.civil_status === "Married") {
    worksheet["P11"] = { v: "X", t: "s" };
  } else if (pds.civil_status === "Widowed") {
    worksheet["P12"] = { v: "X", t: "s" };
  } else if (pds.civil_status === "Separated") {
    worksheet["P13"] = { v: "X", t: "s" };
  }

  // Height: D22 to F22 (merged cells D22:F23 based on your spec)
  writeMergedCell(worksheet, "D22", "F22", pds.height ? `${pds.height} m` : "");
  writeMergedCell(worksheet, "D23", "F23", ""); // Part of merged cell

  // Weight: D24 to F24
  writeMergedCell(
    worksheet,
    "D24",
    "F24",
    pds.weight ? `${pds.weight} kg` : "",
  );

  // Blood type: D25 to F25 (merged cells D25:F26 based on your spec)
  writeMergedCell(worksheet, "D25", "F25", pds.blood_type);
  writeMergedCell(worksheet, "D26", "F26", ""); // Part of merged cell

  // GSIS ID No: D27 to F27 (merged cells D27:F28 based on your spec)
  writeMergedCell(worksheet, "D27", "F27", pds.gsis_id_no);
  writeMergedCell(worksheet, "D28", "F28", ""); // Part of merged cell

  // Pag-IBIG ID No: D29 to F29 (merged cells D29:F30 based on your spec)
  writeMergedCell(worksheet, "D29", "F29", pds.pag_ibig_id_no);
  writeMergedCell(worksheet, "D30", "F30", ""); // Part of merged cell

  // PhilHealth No: D31 to F31
  writeMergedCell(worksheet, "D31", "F31", pds.philhealth_no);

  // SSS/PhilSys Number: D32 to F32
  writeMergedCell(worksheet, "D32", "F32", pds.sss_no);

  // TIN No: D33 to F33
  writeMergedCell(worksheet, "D33", "F33", pds.tin_no);

  // Agency Employee No: D34 to F34
  writeMergedCell(worksheet, "D34", "F34", pds.agency_employee_no);

  // CITIZENSHIP SECTION (Row 13-17)
  // Mark checkboxes with "X" or leave blank
  // Filipino checkbox: D16 (in merged cell D16:F16)
  if (pds.citizenship_type === "Filipino") {
    worksheet["D16"] = { v: "X", t: "s" };
  }

  // Dual Citizenship checkbox: G16 (in merged cell G16:I16)
  if (pds.citizenship_type === "Dual Citizenship") {
    worksheet["G16"] = { v: "X", t: "s" };

    // Mark by birth or by naturalization
    if (pds.dual_citizenship_type === "by birth") {
      worksheet["D17"] = { v: "X", t: "s" };
    } else if (pds.dual_citizenship_type === "by naturalization") {
      worksheet["G17"] = { v: "X", t: "s" };
    }

    // Write country name: L16:N16
    if (pds.dual_citizenship_country) {
      writeMergedCell(worksheet, "L16", "N16", pds.dual_citizenship_country);
    }
  }

  // RESIDENTIAL ADDRESS (Row 17-24)
  // House/Block/Lot No: I18 to K18
  writeMergedCell(worksheet, "I18", "K18", pds.residential_house_no);

  // Street: L18 to N18
  writeMergedCell(worksheet, "L18", "N18", pds.residential_street);

  // Subdivision/Village: I19 to K20 (merged)
  writeMergedCell(worksheet, "I19", "K20", pds.residential_subdivision);

  // Barangay: L19 to N20 (merged)
  writeMergedCell(worksheet, "L19", "N20", pds.residential_barangay);

  // City/Municipality: I22 to K22
  writeMergedCell(worksheet, "I22", "K22", pds.residential_city);

  // Province: L22 to N22
  writeMergedCell(worksheet, "L22", "N22", pds.residential_province);

  // ZIP Code: I24 to N24
  writeMergedCell(worksheet, "I24", "N24", pds.residential_zip_code);

  // PERMANENT ADDRESS (Row 25-31)
  // House/Block/Lot No: I26 to K26
  writeMergedCell(worksheet, "I26", "K26", pds.permanent_house_no);

  // Street: L26 to N26
  writeMergedCell(worksheet, "L26", "N26", pds.permanent_street);

  // Subdivision/Village: I27 to K27
  writeMergedCell(worksheet, "I27", "K27", pds.permanent_subdivision);

  // Barangay: L27 to N27
  writeMergedCell(worksheet, "L27", "N27", pds.permanent_barangay);

  // City/Municipality: I28 to K28
  writeMergedCell(worksheet, "I28", "K28", pds.permanent_city);

  // Province: L28 to N28
  writeMergedCell(worksheet, "L28", "N28", pds.permanent_province);

  // ZIP Code: G31 to H31
  writeMergedCell(worksheet, "G31", "H31", pds.permanent_zip_code);

  // CONTACT INFORMATION
  // Telephone No: I32 to N32
  writeMergedCell(worksheet, "I32", "N32", pds.telephone_no);

  // Mobile No: I33 to N33
  writeMergedCell(worksheet, "I33", "N33", pds.mobile_no);

  // Email Address: I34 to N34
  writeMergedCell(worksheet, "I34", "N34", pds.email_address);

  // FAMILY BACKGROUND
  // Spouse Surname: D36 to H36
  writeMergedCell(worksheet, "D36", "H36", pds.spouse_surname);

  // Spouse First Name: D37 to F37
  writeMergedCell(worksheet, "D37", "F37", pds.spouse_first_name);

  // Spouse Name Extension: G37 to H37
  writeMergedCell(worksheet, "G37", "H37", pds.spouse_name_ext);

  // Spouse Middle Name: D38 to H38
  writeMergedCell(worksheet, "D38", "H38", pds.spouse_middle_name);

  // Spouse Occupation: D39 to H39
  writeMergedCell(worksheet, "D39", "H39", pds.spouse_occupation);

  // Spouse Employer: D40 to H40
  writeMergedCell(worksheet, "D40", "H40", pds.spouse_employer);

  // Spouse Business Address: D41 to H41
  writeMergedCell(worksheet, "D41", "H41", pds.spouse_business_address);

  // Spouse Telephone: D42 to H42
  writeMergedCell(worksheet, "D42", "H42", pds.spouse_telephone);

  // Father Surname: D43 to H43
  writeMergedCell(worksheet, "D43", "H43", pds.father_surname);

  // Father First Name: D44 to F44
  writeMergedCell(worksheet, "D44", "F44", pds.father_first_name);

  // Father Name Extension: G44 to H44
  writeMergedCell(worksheet, "G44", "H44", pds.father_name_ext);

  // Father Middle Name: D45 to H45
  writeMergedCell(worksheet, "D45", "H45", pds.father_middle_name);

  // Mother Surname: D47 to H47
  writeMergedCell(worksheet, "D47", "H47", pds.mother_surname);

  // Mother First Name: D48 to H48
  writeMergedCell(worksheet, "D48", "H48", pds.mother_first_name);

  // Mother Middle Name: D49 to H49
  writeMergedCell(worksheet, "D49", "H49", pds.mother_middle_name);

  // CHILDREN (starting at row 37, columns I:L for name, M:N for date)
  if (pds.children && pds.children.length > 0) {
    const maxChildren = Math.min(pds.children.length, 12);
    for (let i = 0; i < maxChildren; i++) {
      const child = pds.children[i];
      const row = 37 + i;
      // Child name: I to L
      writeMergedCell(worksheet, `I${row}`, `L${row}`, child.name || "");
      // Child date of birth: M to N
      writeMergedCell(
        worksheet,
        `M${row}`,
        `N${row}`,
        formatDate(child.date_of_birth),
      );
    }
  }

  // EDUCATIONAL BACKGROUND (Row 54-58)
  if (pds.education && pds.education.length > 0) {
    const educationByLevel = {
      ELEMENTARY: 54,
      SECONDARY: 55,
      VOCATIONAL: 56,
      COLLEGE: 57,
      "GRADUATE STUDIES": 58,
    };

    pds.education.forEach((edu) => {
      const row = educationByLevel[edu.level];
      if (row) {
        // School Name: D to F (merged)
        writeMergedCell(worksheet, `D${row}`, `F${row}`, edu.school_name || "");
        // Degree/Course: G to I (merged)
        writeMergedCell(
          worksheet,
          `G${row}`,
          `I${row}`,
          edu.degree_course || "",
        );
        // Period From: J
        worksheet[`J${row}`] = { v: edu.period_from || "", t: "s" };
        // Period To: K
        worksheet[`K${row}`] = { v: edu.period_to || "", t: "s" };
        // Highest Level/Units Earned: L
        worksheet[`L${row}`] = { v: edu.highest_level_earned || "", t: "s" };
        // Year Graduated: M
        worksheet[`M${row}`] = { v: edu.year_graduated || "", t: "s" };
        // Scholarship/Honors: N
        worksheet[`N${row}`] = { v: edu.scholarship_honors || "", t: "s" };
      }
    });
  }

  // Signature: D60 to I60
  writeMergedCell(worksheet, "D60", "I60", "");

  // Date: J60 to K60
  writeMergedCell(worksheet, "J60", "K60", formatDate(new Date()));

  // CIVIL SERVICE ELIGIBILITY (starting at row 61)
  if (pds.eligibilities && pds.eligibilities.length > 0) {
    const maxEligibilities = Math.min(pds.eligibilities.length, 7);
    for (let i = 0; i < maxEligibilities; i++) {
      const eligibility = pds.eligibilities[i];
      const row = 61 + i;
      // Career Service (Column D)
      worksheet[`D${row}`] = { v: eligibility.career_service || "", t: "s" };
      // Rating (Column F)
      worksheet[`F${row}`] = { v: eligibility.rating || "", t: "s" };
      // Date of Examination (Column G)
      worksheet[`G${row}`] = {
        v: formatDate(eligibility.date_of_examination),
        t: "s",
      };
      // Place of Examination (Column I)
      worksheet[`I${row}`] = {
        v: eligibility.place_of_examination || "",
        t: "s",
      };
      // License Number (Column K)
      worksheet[`K${row}`] = { v: eligibility.license_number || "", t: "s" };
      // License Validity (Column M)
      worksheet[`M${row}`] = {
        v: formatDate(eligibility.license_validity),
        t: "s",
      };
    }
  }

  // WORK EXPERIENCE (starting at row 69)
  if (pds.work_experiences && pds.work_experiences.length > 0) {
    const maxWorkExperiences = Math.min(pds.work_experiences.length, 28);
    for (let i = 0; i < maxWorkExperiences; i++) {
      const work = pds.work_experiences[i];
      const row = 69 + i;
      // Date From (Column D)
      worksheet[`D${row}`] = { v: formatDate(work.date_from), t: "s" };
      // Date To (Column E)
      worksheet[`E${row}`] = { v: formatDate(work.date_to), t: "s" };
      // Position Title (Column F)
      worksheet[`F${row}`] = { v: work.position_title || "", t: "s" };
      // Department/Agency (Column G)
      worksheet[`G${row}`] = { v: work.department_agency || "", t: "s" };
      // Monthly Salary (Column H)
      worksheet[`H${row}`] = {
        v: work.monthly_salary
          ? parseFloat(work.monthly_salary).toFixed(2)
          : "",
        t: "s",
      };
      // Salary Grade (Column J)
      worksheet[`J${row}`] = { v: work.salary_grade || "", t: "s" };
      // Status of Appointment (Column K)
      worksheet[`K${row}`] = { v: work.status_of_appointment || "", t: "s" };
      // Government Service (Column L)
      worksheet[`L${row}`] = {
        v: work.is_government_service ? "Y" : "N",
        t: "s",
      };
    }
  }

  // LEARNING AND DEVELOPMENT (starting at row 98)
  if (pds.trainings && pds.trainings.length > 0) {
    const maxTrainings = Math.min(pds.trainings.length, 21);
    for (let i = 0; i < maxTrainings; i++) {
      const training = pds.trainings[i];
      const row = 98 + i;
      // Title (Column D)
      worksheet[`D${row}`] = { v: training.title || "", t: "s" };
      // Date From (Column F)
      worksheet[`F${row}`] = { v: formatDate(training.date_from), t: "s" };
      // Date To (Column G)
      worksheet[`G${row}`] = { v: formatDate(training.date_to), t: "s" };
      // Number of Hours (Column H)
      worksheet[`H${row}`] = { v: training.number_of_hours || "", t: "s" };
      // Type of LD (Column I)
      worksheet[`I${row}`] = { v: training.type_of_ld || "", t: "s" };
      // Conducted By (Column J)
      worksheet[`J${row}`] = { v: training.conducted_by || "", t: "s" };
    }
  }

  // VOLUNTARY WORK (starting at row 120)
  if (pds.voluntary_works && pds.voluntary_works.length > 0) {
    const maxVoluntaryWorks = Math.min(pds.voluntary_works.length, 7);
    for (let i = 0; i < maxVoluntaryWorks; i++) {
      const voluntary = pds.voluntary_works[i];
      const row = 120 + i;
      // Organization Name & Address (Column D)
      const orgInfo = `${voluntary.organization_name || ""}${voluntary.organization_address ? " - " + voluntary.organization_address : ""}`;
      worksheet[`D${row}`] = { v: orgInfo, t: "s" };
      // Date From (Column F)
      worksheet[`F${row}`] = { v: formatDate(voluntary.date_from), t: "s" };
      // Date To (Column G)
      worksheet[`G${row}`] = { v: formatDate(voluntary.date_to), t: "s" };
      // Number of Hours (Column H)
      worksheet[`H${row}`] = { v: voluntary.number_of_hours || "", t: "s" };
      // Position/Nature of Work (Column I)
      worksheet[`I${row}`] = {
        v: voluntary.position_nature_of_work || "",
        t: "s",
      };
    }
  }

  // OTHER INFORMATION (starting at row 128)
  if (pds.other_info && pds.other_info.length > 0) {
    const skills = pds.other_info.filter((info) => info.info_type === "SKILL");
    const recognitions = pds.other_info.filter(
      (info) => info.info_type === "RECOGNITION",
    );
    const memberships = pds.other_info.filter(
      (info) => info.info_type === "MEMBERSHIP",
    );

    // Skills (Column D)
    const maxSkills = Math.min(skills.length, 7);
    for (let i = 0; i < maxSkills; i++) {
      const row = 128 + i;
      worksheet[`D${row}`] = { v: skills[i].details || "", t: "s" };
    }

    // Recognitions (Column F)
    const maxRecognitions = Math.min(recognitions.length, 7);
    for (let i = 0; i < maxRecognitions; i++) {
      const row = 128 + i;
      worksheet[`F${row}`] = { v: recognitions[i].details || "", t: "s" };
    }

    // Memberships (Column H)
    const maxMemberships = Math.min(memberships.length, 7);
    for (let i = 0; i < maxMemberships; i++) {
      const row = 128 + i;
      worksheet[`H${row}`] = { v: memberships[i].details || "", t: "s" };
    }
  }

  // REFERENCES (starting at row 136)
  if (pds.references && pds.references.length > 0) {
    const maxReferences = Math.min(pds.references.length, 3);
    for (let i = 0; i < maxReferences; i++) {
      const reference = pds.references[i];
      const row = 136 + i;
      // Name (Column D)
      worksheet[`D${row}`] = { v: reference.name || "", t: "s" };
      // Address (Column F)
      worksheet[`F${row}`] = { v: reference.address || "", t: "s" };
      // Telephone Number (Column H)
      worksheet[`H${row}`] = { v: reference.telephone_number || "", t: "s" };
    }
  }

  // QUESTIONNAIRE RESPONSES
  // Question 34a
  worksheet["D140"] = { v: boolToYesNo(pds.q34_a_answer), t: "s" };
  if (pds.q34_a_details) {
    worksheet["E140"] = { v: pds.q34_a_details, t: "s" };
  }

  // Question 34b
  worksheet["D141"] = { v: boolToYesNo(pds.q34_b_answer), t: "s" };
  if (pds.q34_b_details) {
    worksheet["E141"] = { v: pds.q34_b_details, t: "s" };
  }

  // Question 35a
  worksheet["D142"] = { v: boolToYesNo(pds.q35_a_answer), t: "s" };
  if (pds.q35_a_details) {
    worksheet["E142"] = { v: pds.q35_a_details, t: "s" };
  }

  // Question 35b
  worksheet["D143"] = { v: boolToYesNo(pds.q35_b_answer), t: "s" };
  if (pds.q35_b_details) {
    worksheet["E143"] = { v: pds.q35_b_details, t: "s" };
  }

  // Question 36
  worksheet["D144"] = { v: boolToYesNo(pds.q36_answer), t: "s" };
  if (pds.q36_details) {
    worksheet["E144"] = { v: pds.q36_details, t: "s" };
  }
  if (pds.q36_date_filed) {
    worksheet["F144"] = { v: formatDate(pds.q36_date_filed), t: "s" };
  }
  if (pds.q36_case_status) {
    worksheet["G144"] = { v: pds.q36_case_status, t: "s" };
  }

  // Question 37
  worksheet["D145"] = { v: boolToYesNo(pds.q37_answer), t: "s" };
  if (pds.q37_details) {
    worksheet["E145"] = { v: pds.q37_details, t: "s" };
  }

  // Question 38
  worksheet["D146"] = { v: boolToYesNo(pds.q38_answer), t: "s" };
  if (pds.q38_details) {
    worksheet["E146"] = { v: pds.q38_details, t: "s" };
  }

  // Question 39
  worksheet["D147"] = { v: boolToYesNo(pds.q39_answer), t: "s" };
  if (pds.q39_details) {
    worksheet["E147"] = { v: pds.q39_details, t: "s" };
  }

  // Question 40
  worksheet["D148"] = { v: boolToYesNo(pds.q40_answer), t: "s" };
  if (pds.q40_details) {
    worksheet["E148"] = { v: pds.q40_details, t: "s" };
  }

  // Question 41
  worksheet["D149"] = { v: boolToYesNo(pds.q41_answer), t: "s" };
  if (pds.q41_country) {
    worksheet["E149"] = { v: pds.q41_country, t: "s" };
  }

  // Question 42
  worksheet["D150"] = { v: boolToYesNo(pds.q42_answer), t: "s" };
  if (pds.q42_group) {
    worksheet["E150"] = { v: pds.q42_group, t: "s" };
  }

  // Question 43
  worksheet["D151"] = { v: boolToYesNo(pds.q43_answer), t: "s" };
  if (pds.q43_id_no) {
    worksheet["E151"] = { v: pds.q43_id_no, t: "s" };
  }

  // Question 44
  worksheet["D152"] = { v: boolToYesNo(pds.q44_answer), t: "s" };
  if (pds.q44_id_no) {
    worksheet["E152"] = { v: pds.q44_id_no, t: "s" };
  }

  return workbook;
}

module.exports = {
  exportFacultyPDSToExcel: exports.exportFacultyPDSToExcel,
  exportDeanPDSToExcel: exports.exportDeanPDSToExcel,
};
