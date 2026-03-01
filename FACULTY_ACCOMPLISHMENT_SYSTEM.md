# Faculty Semester Accomplishment System - Complete Specification

## System Overview

A comprehensive system for tracking faculty semester accomplishments where deans assign courses to faculty, faculty submit required documents, and deans review/approve submissions.

## Database Schema

### 1. Course Assignments Table

```sql
CREATE TABLE course_assignments (
  assignment_id INT PRIMARY KEY AUTO_INCREMENT,
  faculty_id INT NOT NULL,
  course_id INT NOT NULL,
  section_id INT NOT NULL,
  academic_year_id INT NOT NULL,
  semester ENUM('1st Sem', '2nd Sem', 'Midterm 1', 'Midterm 2'),
  assigned_by INT NOT NULL, -- dean user_id
  assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'completed', 'archived') DEFAULT 'active',
  FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id),
  FOREIGN KEY (section_id) REFERENCES sections(section_id),
  FOREIGN KEY (academic_year_id) REFERENCES academic_years(academic_year_id),
  UNIQUE KEY unique_assignment (faculty_id, course_id, section_id, academic_year_id, semester)
);
```

### 2. Accomplishment Requirements Table

```sql
CREATE TABLE accomplishment_requirements (
  requirement_id INT PRIMARY KEY AUTO_INCREMENT,
  assignment_id INT NOT NULL,
  requirement_type ENUM(
    'instructional_materials',
    'attendance_sheet',
    'syllabus_receipt',
    'exam_receipt',
    'midterm_final_tos',
    'student_exam_scores',
    'exam_key',
    'report_of_grades',
    'class_record',
    'seminar_certificates'
  ) NOT NULL,
  file_path VARCHAR(500),
  file_name VARCHAR(255),
  file_type VARCHAR(50),
  file_size INT,
  uploaded_date DATETIME,
  status ENUM('pending', 'submitted', 'approved', 'rejected', 'revision_needed') DEFAULT 'pending',
  submitted_date DATETIME,
  reviewed_date DATETIME,
  reviewed_by INT, -- dean user_id
  dean_remarks TEXT,
  faculty_notes TEXT,
  version INT DEFAULT 1,
  FOREIGN KEY (assignment_id) REFERENCES course_assignments(assignment_id),
  FOREIGN KEY (reviewed_by) REFERENCES users(user_id)
);
```

### 3. Requirement History Table (Audit Trail)

```sql
CREATE TABLE requirement_history (
  history_id INT PRIMARY KEY AUTO_INCREMENT,
  requirement_id INT NOT NULL,
  action ENUM('submitted', 'approved', 'rejected', 'revision_requested', 'resubmitted'),
  performed_by INT NOT NULL,
  performed_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  remarks TEXT,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  FOREIGN KEY (requirement_id) REFERENCES accomplishment_requirements(requirement_id),
  FOREIGN KEY (performed_by) REFERENCES users(user_id)
);
```

## Features by Role

### DEAN PORTAL

#### 1. Course Assignment Management

**Location**: Dean Dashboard → Faculty → Assign Courses

**Features**:

- View all faculty in department
- Assign multiple courses/sections to faculty
- View faculty workload (total courses assigned)
- Filter by academic year, semester
- Bulk assignment capability
- Remove/reassign courses

**UI Components**:

- Faculty list with "Assign Courses" button
- Modal with:
  - Academic Year dropdown
  - Semester dropdown
  - Course multi-select (from department courses)
  - Section multi-select (filtered by selected courses)
  - Assignment summary
- Faculty workload dashboard showing:
  - Total courses assigned
  - Courses per semester
  - Section distribution

#### 2. Accomplishment Review & Approval

**Location**: Dean Dashboard → Accomplishment Review

**Features**:

- View all faculty submissions
- Filter by:
  - Faculty
  - Course
  - Semester
  - Status (pending, submitted, approved, rejected)
  - Requirement type
- Review submitted documents
- Approve/Reject with remarks
- Request revisions
- Download submitted files
- View submission history
- Bulk approval for multiple requirements
- Dashboard showing:
  - Pending reviews count
  - Completion rate per faculty
  - Overdue submissions

**UI Components**:

- Table showing:
  - Faculty Name
  - Course/Section
  - Requirement Type
  - Status
  - Submission Date
  - Actions (View, Approve, Reject)
- Review Modal:
  - Document preview/download
  - Approval status selector
  - Remarks textarea
  - History timeline
  - Approve/Reject buttons

### FACULTY PORTAL

#### 1. My Course Assignments

**Location**: Faculty Dashboard → My Courses

**Features**:

- View all assigned courses/sections
- Filter by semester, academic year
- See course details (schedule, students, etc.)
- View accomplishment requirements per course
- Track completion status

**UI Components**:

- Card-based layout showing:
  - Course Code & Name
  - Section
  - Semester
  - Academic Year
  - Completion Progress (e.g., 7/10 requirements)
  - "Submit Requirements" button

#### 2. Semester Accomplishment Submission

**Location**: Faculty Dashboard → Submit Requirements

**Features**:

- View all requirements per course/section
- Upload documents (PDF, Excel, PPT)
- Add notes for dean
- Track submission status
- View dean remarks
- Resubmit after revision request
- Download previously submitted files
- View submission history

**UI Components**:

- Accordion/Tabs per course
- Checklist of requirements:
  1. ✅ Instructional Materials (PPT/PDF)
  2. ⏳ Student Class Attendance Sheet (ISO Form)
  3. ❌ Acknowledgement Receipt of Syllabus (ISO Form)
  4. ... (all 10 requirements)
- Upload interface:
  - Drag & drop file upload
  - File type validation
  - File size limit (e.g., 10MB)
  - Notes textarea
  - Submit button
- Status badges:
  - 🟡 Pending (not submitted)
  - 🔵 Submitted (awaiting review)
  - 🟢 Approved
  - 🔴 Rejected (with remarks)
  - 🟠 Revision Needed

#### 3. Submission History & Feedback

**Features**:

- View all submissions with timeline
- Read dean remarks
- Download approved documents
- Track revision requests
- Notification system for status changes

## API Endpoints

### Dean APIs

```
POST   /api/dean/course-assignments          - Assign courses to faculty
GET    /api/dean/course-assignments          - Get all assignments
PUT    /api/dean/course-assignments/:id      - Update assignment
DELETE /api/dean/course-assignments/:id      - Remove assignment
GET    /api/dean/faculty/:id/workload        - Get faculty workload

GET    /api/dean/accomplishments              - Get all submissions
GET    /api/dean/accomplishments/:id          - Get specific submission
PUT    /api/dean/accomplishments/:id/review   - Approve/Reject submission
GET    /api/dean/accomplishments/stats        - Get dashboard statistics
```

### Faculty APIs

```
GET    /api/faculty/my-courses                - Get assigned courses
GET    /api/faculty/my-courses/:id            - Get course details
GET    /api/faculty/requirements              - Get all requirements
POST   /api/faculty/requirements/upload       - Upload requirement
PUT    /api/faculty/requirements/:id          - Update/Resubmit requirement
GET    /api/faculty/requirements/:id/history  - Get submission history
GET    /api/faculty/requirements/stats        - Get completion statistics
```

## File Storage Structure

```
uploads/
├── accomplishments/
│   ├── {academic_year}/
│   │   ├── {semester}/
│   │   │   ├── {faculty_id}/
│   │   │   │   ├── {course_id}/
│   │   │   │   │   ├── {section_id}/
│   │   │   │   │   │   ├── instructional_materials/
│   │   │   │   │   │   ├── attendance_sheet/
│   │   │   │   │   │   ├── syllabus_receipt/
│   │   │   │   │   │   ├── exam_receipt/
│   │   │   │   │   │   ├── midterm_final_tos/
│   │   │   │   │   │   ├── student_exam_scores/
│   │   │   │   │   │   ├── exam_key/
│   │   │   │   │   │   ├── report_of_grades/
│   │   │   │   │   │   ├── class_record/
│   │   │   │   │   │   └── seminar_certificates/
```

## Requirement Types (Based on Checklist)

1. **Instructional Materials** - PPT/PDF
2. **Student Class Attendance Sheet** - ISO Form (PDF)
3. **Acknowledgement Receipt of Syllabus** - ISO Form (PDF)
4. **Acknowledgement Receipt of Exam** - ISO Form (PDF)
5. **Midterm, Final Exam, and TOS** - With signatures (PDF)
6. **Student Exam (Highest-Middle-Lowest)** - PDF
7. **Key to Correction of Midterm and Final Exam** - PDF
8. **Report of Grades** - With signature, from system (PDF)
9. **Class Record** - Excel file
10. **Certificates of Seminars/Trainings** - PDF (Jan-May)

## Notification System

### Email Notifications:

- Faculty: Course assigned
- Faculty: Submission approved
- Faculty: Submission rejected (with remarks)
- Faculty: Revision requested
- Dean: New submission received
- Dean: Resubmission after revision

### In-App Notifications:

- Real-time notification bell
- Notification list with read/unread status
- Click to view details

## Dashboard Widgets

### Dean Dashboard:

- Pending Reviews Count
- Faculty Completion Rate (%)
- Overdue Submissions
- Recent Submissions
- Faculty Workload Chart
- Completion Timeline

### Faculty Dashboard:

- My Courses Count
- Total Requirements
- Completed Requirements
- Pending Submissions
- Rejected Items (need attention)
- Completion Progress Bar

## Implementation Priority

### Phase 1 (Current Sprint):

1. ✅ Course model (already created)
2. ✅ Section model (already created)
3. ✅ Faculty model (already created)
4. ⏳ Course Assignment model & CRUD
5. ⏳ Dean: Assign Courses UI

### Phase 2:

1. Accomplishment Requirements model
2. File upload infrastructure
3. Faculty Portal: View Assignments
4. Faculty Portal: Submit Requirements

### Phase 3:

1. Dean: Review & Approve UI
2. Notification system
3. History & audit trail
4. Dashboard statistics

### Phase 4:

1. Bulk operations
2. Advanced filtering
3. Reports & analytics
4. Email notifications

## Security Considerations

- File type validation (whitelist: PDF, Excel, PPT)
- File size limits (10MB per file)
- Virus scanning for uploads
- Access control (faculty can only see their own)
- Dean can only see their department
- Secure file storage with hashed filenames
- Audit trail for all actions

## Next Steps

1. Create database migration for new tables
2. Create Course Assignment model
3. Create Accomplishment Requirements model
4. Build Dean Course Assignment UI
5. Build Faculty Portal structure
6. Implement file upload system
7. Build submission workflow
8. Build review/approval workflow

Would you like me to start implementing Phase 1?
