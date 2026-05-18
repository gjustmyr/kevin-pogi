# PDS Excel Export Cell Mapping (ExcelJS Implementation)

## Overview

This document maps the Personal Data Sheet (PDS) CS Form 212 (Revised 2025) template cells to the database fields used in the ExcelJS export implementation.

**Template File:** `backend/public/templates/pds-template.xlsx`  
**Controller:** `backend/controllers/pds-excel-export.controller.js`  
**Library:** ExcelJS (preserves full Excel formatting)

---

## I. PERSONAL INFORMATION

### Basic Information

| Field          | Cell | Merge Range | Database Field       | Notes              |
| -------------- | ---- | ----------- | -------------------- | ------------------ |
| Surname        | D10  | D10:N10     | `pds.surname`        | Merged cell        |
| First Name     | D11  | D11:K11     | `pds.first_name`     | Merged cell        |
| Name Extension | N11  | N11         | `pds.name_extension` | JR., SR, etc.      |
| Middle Name    | D12  | D12:N12     | `pds.middle_name`    | Merged cell        |
| Date of Birth  | D13  | D13:F13     | `pds.date_of_birth`  | Format: MM/DD/YYYY |
| Place of Birth | D15  | D15:F15     | `pds.place_of_birth` |                    |

### Sex (Checkbox)

| Option | Cell | Database Value               |
| ------ | ---- | ---------------------------- |
| Male   | E16  | `pds.sex === "Male"` → "X"   |
| Female | F16  | `pds.sex === "Female"` → "X" |

### Civil Status (Checkbox)

| Option    | Cell | Database Value                           |
| --------- | ---- | ---------------------------------------- |
| Single    | E17  | `pds.civil_status === "Single"` → "X"    |
| Married   | P11  | `pds.civil_status === "Married"` → "X"   |
| Widowed   | P12  | `pds.civil_status === "Widowed"` → "X"   |
| Separated | P13  | `pds.civil_status === "Separated"` → "X" |

### Physical Attributes

| Field      | Cell | Merge Range | Database Field   | Format   |
| ---------- | ---- | ----------- | ---------------- | -------- |
| Height     | D22  | D22:F22     | `pds.height`     | "X.XX m" |
| Weight     | D24  | D24:F24     | `pds.weight`     | "XX kg"  |
| Blood Type | D25  | D25:F26     | `pds.blood_type` |          |

### Government IDs

| Field               | Cell | Merge Range | Database Field           |
| ------------------- | ---- | ----------- | ------------------------ |
| GSIS ID No.         | D27  | D27:F28     | `pds.gsis_id_no`         |
| Pag-IBIG ID No.     | D29  | D29:F30     | `pds.pag_ibig_id_no`     |
| PhilHealth No.      | D31  | D31:F31     | `pds.philhealth_no`      |
| SSS/PhilSys No.     | D32  | D32:F32     | `pds.sss_no`             |
| TIN No.             | D33  | D33:F33     | `pds.tin_no`             |
| Agency Employee No. | D34  | D34:F34     | `pds.agency_employee_no` |

---

## II. CITIZENSHIP

### Citizenship Type (Checkbox)

| Option           | Cell | Database Value                                      |
| ---------------- | ---- | --------------------------------------------------- |
| Filipino         | D16  | `pds.citizenship_type === "Filipino"` → "X"         |
| Dual Citizenship | G16  | `pds.citizenship_type === "Dual Citizenship"` → "X" |

### Dual Citizenship Details

| Field             | Cell | Database Value                                            |
| ----------------- | ---- | --------------------------------------------------------- |
| By Birth          | D17  | `pds.dual_citizenship_type === "by birth"` → "X"          |
| By Naturalization | G17  | `pds.dual_citizenship_type === "by naturalization"` → "X" |
| Country           | L16  | `pds.dual_citizenship_country`                            |

---

## III. RESIDENTIAL ADDRESS

| Field               | Cell | Row | Database Field                | Notes                                        |
| ------------------- | ---- | --- | ----------------------------- | -------------------------------------------- |
| House/Block/Lot No. | I19  | 19  | `pds.residential_house_no`    | Below "House/Block/Lot No." header in row 18 |
| Street              | L19  | 19  | `pds.residential_street`      | Below "Street" header in row 18              |
| Subdivision/Village | I22  | 22  | `pds.residential_subdivision` | Below "Subdivision/Village" header in row 21 |
| Barangay            | L22  | 22  | `pds.residential_barangay`    | Below "Barangay" header in row 21            |
| City/Municipality   | I25  | 25  | `pds.residential_city`        | Below "City/Municipality" header in row 24   |
| Province            | L25  | 25  | `pds.residential_province`    | Below "Province" header in row 24            |
| ZIP Code            | I26  | 26  | `pds.residential_zip_code`    | ZIP CODE row                                 |

---

## IV. PERMANENT ADDRESS

| Field               | Cell | Row | Database Field              | Notes                            |
| ------------------- | ---- | --- | --------------------------- | -------------------------------- |
| House/Block/Lot No. | I29  | 29  | `pds.permanent_house_no`    | Estimated - verify with template |
| Street              | L29  | 29  | `pds.permanent_street`      | Estimated - verify with template |
| Subdivision/Village | I32  | 32  | `pds.permanent_subdivision` | Estimated - verify with template |
| Barangay            | L32  | 32  | `pds.permanent_barangay`    | Estimated - verify with template |
| City/Municipality   | I35  | 35  | `pds.permanent_city`        | Estimated - verify with template |
| Province            | L35  | 35  | `pds.permanent_province`    | Estimated - verify with template |
| ZIP Code            | I36  | 36  | `pds.permanent_zip_code`    | Estimated - verify with template |

---

## V. CONTACT INFORMATION

| Field         | Cell | Merge Range | Database Field      |
| ------------- | ---- | ----------- | ------------------- |
| Telephone No. | I32  | I32:N32     | `pds.telephone_no`  |
| Mobile No.    | I33  | I33:N33     | `pds.mobile_no`     |
| Email Address | I34  | I34:N34     | `pds.email_address` |

---

## VI. FAMILY BACKGROUND

### Spouse Information

| Field                  | Cell | Merge Range | Database Field                |
| ---------------------- | ---- | ----------- | ----------------------------- |
| Surname                | D36  | D36:H36     | `pds.spouse_surname`          |
| First Name             | D37  | D37:F37     | `pds.spouse_first_name`       |
| Name Extension         | G37  | G37:H37     | `pds.spouse_name_ext`         |
| Middle Name            | D38  | D38:H38     | `pds.spouse_middle_name`      |
| Occupation             | D39  | D39:H39     | `pds.spouse_occupation`       |
| Employer/Business Name | D40  | D40:H40     | `pds.spouse_employer`         |
| Business Address       | D41  | D41:H41     | `pds.spouse_business_address` |
| Telephone No.          | D42  | D42:H42     | `pds.spouse_telephone`        |

### Father's Information

| Field          | Cell | Merge Range | Database Field           |
| -------------- | ---- | ----------- | ------------------------ |
| Surname        | D43  | D43:H43     | `pds.father_surname`     |
| First Name     | D44  | D44:F44     | `pds.father_first_name`  |
| Name Extension | G44  | G44:H44     | `pds.father_name_ext`    |
| Middle Name    | D45  | D45:H45     | `pds.father_middle_name` |

### Mother's Maiden Name

| Field       | Cell | Merge Range | Database Field           |
| ----------- | ---- | ----------- | ------------------------ |
| Surname     | D47  | D47:H47     | `pds.mother_surname`     |
| First Name  | D48  | D48:H48     | `pds.mother_first_name`  |
| Middle Name | D49  | D49:H49     | `pds.mother_middle_name` |

### Children (Starting Row 37, Max 12)

| Field         | Cell Pattern | Database Field                  |
| ------------- | ------------ | ------------------------------- |
| Name          | I{37-48}     | `pds.children[i].name`          |
| Date of Birth | M{37-48}     | `pds.children[i].date_of_birth` |

---

## VII. EDUCATIONAL BACKGROUND (Rows 54-58)

| Level            | Row | School Name | Degree/Course | Period From | Period To | Highest Level | Year Graduated | Honors |
| ---------------- | --- | ----------- | ------------- | ----------- | --------- | ------------- | -------------- | ------ |
| ELEMENTARY       | 54  | D54         | G54           | J54         | K54       | L54           | M54            | N54    |
| SECONDARY        | 55  | D55         | G55           | J55         | K55       | L55           | M55            | N55    |
| VOCATIONAL       | 56  | D56         | G56           | J56         | K56       | L56           | M56            | N56    |
| COLLEGE          | 57  | D57         | G57           | J57         | K57       | L57           | M57            | N57    |
| GRADUATE STUDIES | 58  | D58         | G58           | J58         | K58       | L58           | M58            | N58    |

**Database:** `pds.education[]` filtered by `level` field

---

## VIII. CIVIL SERVICE ELIGIBILITY (Starting Row 61, Max 7)

| Field                | Cell Pattern | Database Field                              |
| -------------------- | ------------ | ------------------------------------------- |
| Career Service       | D{61-67}     | `pds.eligibilities[i].career_service`       |
| Rating               | F{61-67}     | `pds.eligibilities[i].rating`               |
| Date of Examination  | G{61-67}     | `pds.eligibilities[i].date_of_examination`  |
| Place of Examination | I{61-67}     | `pds.eligibilities[i].place_of_examination` |
| License Number       | K{61-67}     | `pds.eligibilities[i].license_number`       |
| License Validity     | M{61-67}     | `pds.eligibilities[i].license_validity`     |

---

## IX. WORK EXPERIENCE (Starting Row 69, Max 28)

| Field                 | Cell Pattern | Database Field                                  |
| --------------------- | ------------ | ----------------------------------------------- |
| Date From             | D{69-96}     | `pds.work_experiences[i].date_from`             |
| Date To               | E{69-96}     | `pds.work_experiences[i].date_to`               |
| Position Title        | F{69-96}     | `pds.work_experiences[i].position_title`        |
| Department/Agency     | G{69-96}     | `pds.work_experiences[i].department_agency`     |
| Monthly Salary        | H{69-96}     | `pds.work_experiences[i].monthly_salary`        |
| Salary Grade          | J{69-96}     | `pds.work_experiences[i].salary_grade`          |
| Status of Appointment | K{69-96}     | `pds.work_experiences[i].status_of_appointment` |
| Gov't Service (Y/N)   | L{69-96}     | `pds.work_experiences[i].is_government_service` |

---

## X. LEARNING AND DEVELOPMENT (Starting Row 98, Max 21)

| Field           | Cell Pattern | Database Field                     |
| --------------- | ------------ | ---------------------------------- |
| Title           | D{98-118}    | `pds.trainings[i].title`           |
| Date From       | F{98-118}    | `pds.trainings[i].date_from`       |
| Date To         | G{98-118}    | `pds.trainings[i].date_to`         |
| Number of Hours | H{98-118}    | `pds.trainings[i].number_of_hours` |
| Type of LD      | I{98-118}    | `pds.trainings[i].type_of_ld`      |
| Conducted By    | J{98-118}    | `pds.trainings[i].conducted_by`    |

---

## XI. VOLUNTARY WORK (Starting Row 120, Max 7)

| Field                   | Cell Pattern | Database Field                                                    |
| ----------------------- | ------------ | ----------------------------------------------------------------- |
| Organization & Address  | D{120-126}   | `pds.voluntary_works[i].organization_name + organization_address` |
| Date From               | F{120-126}   | `pds.voluntary_works[i].date_from`                                |
| Date To                 | G{120-126}   | `pds.voluntary_works[i].date_to`                                  |
| Number of Hours         | H{120-126}   | `pds.voluntary_works[i].number_of_hours`                          |
| Position/Nature of Work | I{120-126}   | `pds.voluntary_works[i].position_nature_of_work`                  |

---

## XII. OTHER INFORMATION (Starting Row 128, Max 7 each)

| Type           | Cell Pattern | Database Filter                                    |
| -------------- | ------------ | -------------------------------------------------- |
| Skills/Hobbies | D{128-134}   | `pds.other_info[] WHERE info_type = 'SKILL'`       |
| Recognition    | F{128-134}   | `pds.other_info[] WHERE info_type = 'RECOGNITION'` |
| Membership     | H{128-134}   | `pds.other_info[] WHERE info_type = 'MEMBERSHIP'`  |

---

## XIII. REFERENCES (Starting Row 136, Max 3)

| Field            | Cell Pattern | Database Field                       |
| ---------------- | ------------ | ------------------------------------ |
| Name             | D{136-138}   | `pds.references[i].name`             |
| Address          | F{136-138}   | `pds.references[i].address`          |
| Telephone Number | H{136-138}   | `pds.references[i].telephone_number` |

---

## XIV. QUESTIONNAIRE (Rows 140-152)

| Question | Answer Cell | Details Cell     | Database Fields                                                                  |
| -------- | ----------- | ---------------- | -------------------------------------------------------------------------------- |
| 34a      | D140        | E140             | `pds.q34_a_answer`, `pds.q34_a_details`                                          |
| 34b      | D141        | E141             | `pds.q34_b_answer`, `pds.q34_b_details`                                          |
| 35a      | D142        | E142             | `pds.q35_a_answer`, `pds.q35_a_details`                                          |
| 35b      | D143        | E143             | `pds.q35_b_answer`, `pds.q35_b_details`                                          |
| 36       | D144        | E144, F144, G144 | `pds.q36_answer`, `pds.q36_details`, `pds.q36_date_filed`, `pds.q36_case_status` |
| 37       | D145        | E145             | `pds.q37_answer`, `pds.q37_details`                                              |
| 38       | D146        | E146             | `pds.q38_answer`, `pds.q38_details`                                              |
| 39       | D147        | E147             | `pds.q39_answer`, `pds.q39_details`                                              |
| 40       | D148        | E148             | `pds.q40_answer`, `pds.q40_details`                                              |
| 41       | D149        | E149             | `pds.q41_answer`, `pds.q41_country`                                              |
| 42       | D150        | E150             | `pds.q42_answer`, `pds.q42_group`                                                |
| 43       | D151        | E151             | `pds.q43_answer`, `pds.q43_id_no`                                                |
| 44       | D152        | E152             | `pds.q44_answer`, `pds.q44_id_no`                                                |

**Answer Format:** YES/NO (converted from boolean)

---

## XV. SIGNATURE AND DATE

| Field     | Cell | Merge Range | Database Field                 |
| --------- | ---- | ----------- | ------------------------------ |
| Signature | D60  | D60:I60     | (Empty - for manual signature) |
| Date      | J60  | J60:K60     | Current date (auto-filled)     |

---

## Change Log

### 2025-05-16 - Address Field Concatenation

- **Changed:** House/Block/Lot No. and Street are now concatenated into single cell
- **Residential Address:** I17 now contains `house_no + " " + street` (merged I17:N17)
- **Permanent Address:** I27 now contains `house_no + " " + street` (merged I27:N27)
- **Reason:** Template has single field for complete address line
- **Impact:** Full address displays in one cell instead of split across two
- **Files Modified:**
  - `backend/controllers/pds-excel-export.controller.js`
  - `backend/PDS_EXCELJS_CELL_MAPPING.md`

### 2025-05-16 - Address Cell Mapping Corrections

- **Changed:** Updated residential and permanent address cell references
- **Residential Address:**
  - House/Block/Lot: I18→I17, Street: L18→L17
  - Subdivision: I19→I18, Barangay: L19→L18
  - City: I22→I19, Province: L22→L19
  - ZIP Code: I24→I20
- **Permanent Address:**
  - House/Block/Lot: I26→I27, Street: L26→L27
  - Subdivision: I27→I28, Barangay: L27→L28
  - City: I28→I29, Province: L28→L29
  - ZIP Code: G31→I30
- **Reason:** Match actual template structure
- **Files Modified:**
  - `backend/controllers/pds-excel-export.controller.js`
  - `backend/PDS_EXCELJS_CELL_MAPPING.md`

### 2025-05-16 - ExcelJS Migration

- **Changed:** Migrated from `xlsx` library to `exceljs`
- **Reason:** Better preservation of Excel formatting (borders, colors, fonts, merged cells)
- **Impact:** Template design now fully preserved in exported files
- **Files Modified:**
  - `backend/controllers/pds-excel-export.controller.js` - Complete rewrite
  - `backend/package.json` - Added exceljs dependency

### 2025-05-16 - Cell Mapping Corrections

- **Changed:** Updated Name Extension cell from L11 to N11
- **Reason:** Match actual template structure
- **Impact:** Name extension now appears in correct cell
- **Files Modified:**
  - `backend/controllers/pds-excel-export.controller.js`

---

## Notes

1. **Merged Cells:** ExcelJS automatically handles merged cells. Writing to the top-left cell of a merged range fills the entire range.

2. **Date Format:** All dates are formatted as MM/DD/YYYY using the `formatDate()` helper function.

3. **Boolean Values:** Boolean database values are converted to "YES"/"NO" strings using the `boolToYesNo()` helper function.

4. **Checkboxes:** Checkboxes are marked with "X" character when the condition is true.

5. **Array Limits:** Arrays have maximum limits to prevent overflow:
   - Children: 12
   - Education: 5 (one per level)
   - Eligibilities: 7
   - Work Experience: 28
   - Trainings: 21
   - Voluntary Work: 7
   - Other Info: 7 per type
   - References: 3

6. **Template Preservation:** ExcelJS preserves all Excel features including:
   - Cell borders and styles
   - Background colors
   - Font formatting (size, color, bold, italic)
   - Merged cells
   - Row heights and column widths
   - Print settings

---

## Testing Checklist

- [ ] Personal information displays correctly
- [ ] Checkboxes marked with "X" in correct cells
- [ ] All merged cells display properly
- [ ] Date formats are MM/DD/YYYY
- [ ] Arrays don't exceed maximum limits
- [ ] Template formatting preserved (borders, colors, fonts)
- [ ] File downloads with correct filename
- [ ] Works for Faculty export
- [ ] Works for Dean export
- [ ] Works for Dean downloading Faculty PDS
