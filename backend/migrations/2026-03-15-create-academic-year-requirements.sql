-- Migration to create academic year/semester based requirements
-- Date: 2026-03-15
-- Description: Creates requirement_submissions table tied to academic years and semesters
-- Faculty submit requirements per academic year/semester (not per course)

-- Create requirement_submissions table with new structure
CREATE TABLE IF NOT EXISTS `requirement_submissions` (
  `submission_id` INT(11) NOT NULL AUTO_INCREMENT,
  `faculty_id` INT(11) NOT NULL COMMENT 'Reference to faculty who submitted',
  `academic_year_id` INT(11) NOT NULL COMMENT 'Reference to academic_years table',
  `semester` ENUM('1st Semester', '2nd Semester', 'Midterm 1', 'Midterm 2') NOT NULL COMMENT 'Static semester options',
  `requirement_name` VARCHAR(255) NOT NULL COMMENT 'Faculty types the requirement name (follows original 15 requirements)',
  `file_path` VARCHAR(500) NOT NULL COMMENT 'Path to uploaded file',
  `file_name` VARCHAR(255) NOT NULL COMMENT 'Original file name',
  `file_size` INT(11) DEFAULT NULL COMMENT 'File size in bytes',
  `submission_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('pending', 'validated', 'returned') DEFAULT 'pending' COMMENT 'pending=awaiting review, validated=approved by dean, returned=needs revision',
  `dean_remarks` TEXT DEFAULT NULL COMMENT 'Dean comments when validating or returning',
  `validated_by` INT(11) DEFAULT NULL COMMENT 'Dean user_id who validated',
  `validated_date` DATETIME DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`submission_id`),
  KEY `idx_faculty_id` (`faculty_id`),
  KEY `idx_academic_year_id` (`academic_year_id`),
  KEY `idx_semester` (`semester`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_requirement_faculty` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`faculty_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_requirement_academic_year` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`academic_year_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Standard 15 requirement types for reference (faculty can type these):
-- 1. Instructional Materials
-- 2. Student Class Attendance Sheet
-- 3. Acknowledgement Receipt of Syllabus
-- 4. Acknowledgement Receipt of Exam
-- 5. Midterm Exam
-- 6. Final Exam
-- 7. TQS (Teaching Quality Survey)
-- 8. Student Exam (Highest)
-- 9. Student Exam (Middle)
-- 10. Student Exam (Lowest)
-- 11. Key to Correction of Midterm Exam
-- 12. Key to Correction of Final Exam
-- 13. Report of Grades
-- 14. Class Record
-- 15. Other Academic Documents

-- Note: Faculty will type requirement names as free text, but should follow this standard list
