# PDS Excel Export - System Architecture

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  User Interface (Angular/React/Vue)                      │  │
│  │  - Export Button                                         │  │
│  │  - Loading Indicator                                     │  │
│  │  - Error Handling                                        │  │
│  └────────────────────┬─────────────────────────────────────┘  │
└─────────────────────────┼─────────────────────────────────────┘
                          │
                          │ HTTP GET Request
                          │ Authorization: Bearer {token}
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Routes                                              │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  /api/pds/export/excel        (Faculty)           │ │  │
│  │  │  /api/dean-pds/export/excel   (Dean)              │ │  │
│  │  └────────────────────┬───────────────────────────────┘ │  │
│  └─────────────────────────┼─────────────────────────────────┘  │
│                          │                                      │
│                          │ verifyToken()                        │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Authentication Middleware                               │  │
│  │  - Verify JWT Token                                      │  │
│  │  - Extract user_id                                       │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                          │                                      │
│                          │ Authenticated                        │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  PDS Excel Export Controller                             │  │
│  │  (pds-excel-export.controller.js)                        │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  exportFacultyPDSToExcel()                         │ │  │
│  │  │  exportDeanPDSToExcel()                            │ │  │
│  │  └────────────────────┬───────────────────────────────┘ │  │
│  └─────────────────────────┼─────────────────────────────────┘  │
│                          │                                      │
│                          │ 1. Get Faculty/Dean                  │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Database (MySQL/Sequelize)                              │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  Faculty/Dean Table                                │ │  │
│  │  │  PersonalDataSheet Table                           │ │  │
│  │  │  PDSChild, PDSEducation, PDSEligibility            │ │  │
│  │  │  PDSWorkExperience, PDSTraining                    │ │  │
│  │  │  PDSVoluntaryWork, PDSOtherInfo, PDSReference      │ │  │
│  │  └────────────────────┬───────────────────────────────┘ │  │
│  └─────────────────────────┼─────────────────────────────────┘  │
│                          │                                      │
│                          │ 2. Return PDS Data                   │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  generatePDSExcel(pds)                                   │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  3. Check for Template                             │ │  │
│  │  │     ├─ Exists: Load template                       │ │  │
│  │  │     └─ Not Exists: Create new workbook             │ │  │
│  │  │                                                     │ │  │
│  │  │  4. Map Data to Cells                              │ │  │
│  │  │     ├─ Personal Info (D10:N34)                     │ │  │
│  │  │     ├─ Addresses (I17:N31)                         │ │  │
│  │  │     ├─ Family (D36:H49)                            │ │  │
│  │  │     ├─ Education (Rows 54-58)                      │ │  │
│  │  │     ├─ Eligibility (Rows 61+)                      │ │  │
│  │  │     ├─ Work Experience (Rows 69+)                  │ │  │
│  │  │     ├─ Trainings (Rows 98+)                        │ │  │
│  │  │     ├─ Voluntary Work (Rows 120+)                  │ │  │
│  │  │     ├─ Other Info (Rows 128+)                      │ │  │
│  │  │     ├─ References (Rows 136+)                      │ │  │
│  │  │     ├─ Questionnaire (Rows 140+)                   │ │  │
│  │  │     └─ Signature (D60:I60, L60:M60)                │ │  │
│  │  │                                                     │ │  │
│  │  │  5. Format Data                                    │ │  │
│  │  │     ├─ Dates: MM/DD/YYYY                           │ │  │
│  │  │     ├─ Boolean: YES/NO                             │ │  │
│  │  │     ├─ Currency: 0.00                              │ │  │
│  │  │     └─ Units: m, kg                                │ │  │
│  │  │                                                     │ │  │
│  │  │  6. Generate Excel Buffer                          │ │  │
│  │  └────────────────────┬───────────────────────────────┘ │  │
│  └─────────────────────────┼─────────────────────────────────┘  │
│                          │                                      │
│                          │ 7. Return Buffer                     │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  HTTP Response                                           │  │
│  │  - Status: 200 OK                                        │  │
│  │  - Content-Type: application/vnd...spreadsheetml.sheet   │  │
│  │  - Content-Disposition: attachment; filename=PDS_...xlsx │  │
│  │  - Body: Excel file buffer                               │  │
│  └────────────────────┬─────────────────────────────────────┘  │
└─────────────────────────┼─────────────────────────────────────┘
                          │
                          │ Excel File Download
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Browser Download                                        │  │
│  │  - Create Blob from response                             │  │
│  │  - Create download link                                  │  │
│  │  - Trigger download                                      │  │
│  │  - Filename: PDS_{Surname}_{FirstName}_{Date}.xlsx      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### Step-by-Step Process

1. **User Action**
   - User clicks "Export to Excel" button
   - Frontend sends GET request with JWT token

2. **Authentication**
   - Middleware verifies JWT token
   - Extracts user_id from token
   - Passes to controller

3. **Data Retrieval**
   - Controller finds Faculty/Dean by user_id
   - Queries PersonalDataSheet with all relations
   - Returns complete PDS object

4. **Excel Generation**
   - Check for template file
   - Create/load workbook
   - Map PDS data to specific cells
   - Format data (dates, currency, boolean)
   - Generate Excel buffer

5. **Response**
   - Set appropriate headers
   - Send Excel buffer
   - Browser triggers download

---

## 📦 Component Breakdown

### 1. Routes Layer
```javascript
// pds.routes.js
router.get("/export/excel", excelController.exportFacultyPDSToExcel);

// dean-pds.routes.js
router.get("/export/excel", excelController.exportDeanPDSToExcel);
```

**Responsibilities:**
- Define API endpoints
- Apply authentication middleware
- Route to appropriate controller

---

### 2. Controller Layer
```javascript
// pds-excel-export.controller.js
exports.exportFacultyPDSToExcel = async (req, res) => {
  // 1. Get faculty from user_id
  // 2. Get PDS with all relations
  // 3. Generate Excel workbook
  // 4. Send as download
}
```

**Responsibilities:**
- Handle HTTP request/response
- Retrieve user and PDS data
- Call Excel generation function
- Set response headers
- Send file buffer

---

### 3. Excel Generation Function
```javascript
async function generatePDSExcel(pds) {
  // 1. Load/create workbook
  // 2. Map data to cells
  // 3. Format data
  // 4. Return workbook
}
```

**Responsibilities:**
- Template management
- Cell mapping logic
- Data formatting
- Workbook generation

---

### 4. Helper Functions
```javascript
const formatDate = (date) => { /* MM/DD/YYYY */ }
const boolToYesNo = (value) => { /* YES/NO */ }
const writeMergedCell = (worksheet, start, end, value) => { /* Write */ }
```

**Responsibilities:**
- Date formatting
- Boolean conversion
- Cell writing utilities

---

## 🗂️ File Structure

```
backend/
├── controllers/
│   ├── pds.controller.js                    (Existing)
│   ├── dean-pds.controller.js               (Existing)
│   └── pds-excel-export.controller.js       ✨ NEW
│
├── routes/
│   ├── pds.routes.js                        🔧 MODIFIED
│   └── dean-pds.routes.js                   🔧 MODIFIED
│
├── models/
│   ├── personal-data-sheet.model.js         (Existing)
│   ├── pds-child.model.js                   (Existing)
│   ├── pds-education.model.js               (Existing)
│   ├── pds-eligibility.model.js             (Existing)
│   ├── pds-work-experience.model.js         (Existing)
│   ├── pds-training.model.js                (Existing)
│   ├── pds-voluntary-work.model.js          (Existing)
│   ├── pds-other-info.model.js              (Existing)
│   └── pds-reference.model.js               (Existing)
│
├── public/
│   └── templates/
│       └── pds-template.xlsx                (Optional)
│
├── middleware/
│   └── auth.middleware.js                   (Existing)
│
├── PDS_EXCEL_EXPORT_MAPPING.md              ✨ NEW
├── PDS_CELL_MAPPING_SUMMARY.md              ✨ NEW
├── PDS_EXPORT_IMPLEMENTATION_COMPLETE.md    ✨ NEW
├── PDS_EXPORT_ARCHITECTURE.md               ✨ NEW
└── test-pds-excel-export.js                 ✨ NEW
```

---

## 🔐 Security Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. Request with JWT Token                                  │
│     GET /api/pds/export/excel                               │
│     Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  2. verifyToken Middleware                                  │
│     ├─ Decode JWT                                           │
│     ├─ Verify signature                                     │
│     ├─ Check expiration                                     │
│     └─ Extract user_id                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├─ Valid ──────────────┐
                     │                      │
                     └─ Invalid ────────┐   │
                                        │   │
                                        ▼   ▼
                     ┌──────────────────────────────────────┐
                     │  401 Unauthorized                    │
                     └──────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Controller - Get Faculty/Dean                           │
│     WHERE user_id = req.user.user_id                        │
│     (User can only access their own data)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├─ Found ──────────────┐
                     │                      │
                     └─ Not Found ──────┐   │
                                        │   │
                                        ▼   ▼
                     ┌──────────────────────────────────────┐
                     │  404 Not Found                       │
                     └──────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Get PDS Data                                            │
│     WHERE faculty_id/dean_id = user.id                      │
│     (Only user's own PDS)                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├─ Found ──────────────┐
                     │                      │
                     └─ Not Found ──────┐   │
                                        │   │
                                        ▼   ▼
                     ┌──────────────────────────────────────┐
                     │  404 PDS Not Found                   │
                     └──────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Generate Excel & Send                                   │
│     ✅ User authenticated                                   │
│     ✅ User authorized (own data only)                      │
│     ✅ Data exists                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema (Relevant Tables)

```
┌─────────────────────────────────────────────────────────────┐
│  users                                                      │
│  ├─ user_id (PK)                                            │
│  ├─ email                                                   │
│  └─ role                                                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├─────────────────────┐
                     │                     │
                     ▼                     ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│  faculties               │  │  deans                   │
│  ├─ faculty_id (PK)      │  │  ├─ dean_id (PK)        │
│  └─ user_id (FK)         │  │  └─ user_id (FK)        │
└────────────┬─────────────┘  └────────────┬─────────────┘
             │                             │
             └──────────┬──────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  personal_data_sheets                                       │
│  ├─ pds_id (PK)                                             │
│  ├─ faculty_id (FK, nullable)                               │
│  ├─ dean_id (FK, nullable)                                  │
│  ├─ surname, first_name, middle_name, name_extension        │
│  ├─ date_of_birth, place_of_birth, sex, civil_status       │
│  ├─ height, weight, blood_type                              │
│  ├─ gsis_id_no, pag_ibig_id_no, philhealth_no, sss_no      │
│  ├─ tin_no, agency_employee_no                              │
│  ├─ residential_*, permanent_*                              │
│  ├─ telephone_no, mobile_no, email_address                  │
│  ├─ spouse_*, father_*, mother_*                            │
│  └─ q34_a_answer, q34_a_details, ... (questionnaire)        │
└────────────┬────────────────────────────────────────────────┘
             │
             ├─────────────────────────────────────────┐
             │                                         │
             ▼                                         ▼
┌──────────────────────┐  ┌──────────────────────────────────┐
│  pds_children        │  │  pds_education                   │
│  ├─ child_id (PK)    │  │  ├─ education_id (PK)            │
│  ├─ pds_id (FK)      │  │  ├─ pds_id (FK)                  │
│  ├─ name             │  │  ├─ level                        │
│  └─ date_of_birth    │  │  ├─ school_name                  │
└──────────────────────┘  │  ├─ degree_course                │
                          │  ├─ period_from, period_to       │
                          │  ├─ highest_level_earned         │
                          │  ├─ year_graduated               │
                          │  └─ scholarship_honors            │
                          └──────────────────────────────────┘
             │
             ├─────────────────────────────────────────┐
             │                                         │
             ▼                                         ▼
┌──────────────────────┐  ┌──────────────────────────────────┐
│  pds_eligibility     │  │  pds_work_experiences            │
│  pds_trainings       │  │  pds_voluntary_works             │
│  pds_other_info      │  │  pds_references                  │
│  (and more...)       │  │  (and more...)                   │
└──────────────────────┘  └──────────────────────────────────┘
```

---

## 🎯 Cell Mapping Logic

### Example: Personal Information
```javascript
// Surname: D10 to N10
writeMergedCell(worksheet, "D10", "N10", pds.surname);

// First Name: D11 to K11
writeMergedCell(worksheet, "D11", "K11", pds.first_name);

// Name Extension: L11 to M11
writeMergedCell(worksheet, "L11", "M11", pds.name_extension);
```

### Example: Educational Background
```javascript
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
    worksheet[`G${row}`] = { v: edu.school_name || "", t: "s" };
    worksheet[`J${row}`] = { v: edu.period_from || "", t: "s" };
    worksheet[`K${row}`] = { v: edu.period_to || "", t: "s" };
    // ... more fields
  }
});
```

---

## 🚀 Performance Considerations

### Memory Management
- ✅ In-memory processing (no temp files)
- ✅ Automatic garbage collection
- ✅ Buffer streaming to client
- ✅ No file system I/O overhead

### Optimization
- ✅ Single database query with includes
- ✅ Efficient cell writing
- ✅ Minimal data transformation
- ✅ Direct buffer response

### Scalability
- ✅ Stateless operation
- ✅ Concurrent request support
- ✅ No shared resources
- ✅ Horizontal scaling ready

---

## 📈 Monitoring & Logging

### Success Logging
```javascript
console.log(`PDS exported for ${pds.surname}, ${pds.first_name}`);
```

### Error Logging
```javascript
console.error("Export PDS to Excel error:", error);
```

### Metrics to Track
- Export request count
- Success/failure rate
- Average generation time
- File size distribution
- Error types and frequency

---

## 🎓 Summary

This architecture provides:

✅ **Separation of Concerns**
- Routes handle HTTP
- Controllers handle business logic
- Functions handle Excel generation

✅ **Security**
- JWT authentication
- User authorization
- Data isolation

✅ **Maintainability**
- Clear structure
- Well-documented
- Easy to extend

✅ **Performance**
- In-memory processing
- Efficient queries
- Fast response times

✅ **Reliability**
- Error handling
- Input validation
- Graceful degradation

---

**Ready for Production! 🚀**
