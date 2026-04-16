-- Migration to update faculty and dean activity tables to match PDF structure
-- Date: 2026-04-17

-- Update faculty_seminars_trainings table
ALTER TABLE faculty_seminars_trainings
  DROP COLUMN IF EXISTS type,
  DROP COLUMN IF EXISTS organizer,
  DROP COLUMN IF EXISTS venue,
  DROP COLUMN IF EXISTS date_from,
  DROP COLUMN IF EXISTS date_to,
  DROP COLUMN IF EXISTS number_of_hours,
  DROP COLUMN IF EXISTS role;

ALTER TABLE faculty_seminars_trainings
  ADD COLUMN IF NOT EXISTS category ENUM('Local', 'National', 'International') NOT NULL DEFAULT 'Local' AFTER title,
  ADD COLUMN IF NOT EXISTS date DATE NOT NULL DEFAULT CURRENT_DATE AFTER category,
  ADD COLUMN IF NOT EXISTS sponsoring_agency VARCHAR(300) NOT NULL DEFAULT '' AFTER date;

-- Update faculty_research_activities table
ALTER TABLE faculty_research_activities
  DROP COLUMN IF EXISTS activity_title,
  DROP COLUMN IF EXISTS activity_type,
  DROP COLUMN IF EXISTS organizer,
  DROP COLUMN IF EXISTS venue,
  DROP COLUMN IF EXISTS date_from,
  DROP COLUMN IF EXISTS date_to,
  DROP COLUMN IF EXISTS role;

ALTER TABLE faculty_research_activities
  CHANGE COLUMN research_title research_title VARCHAR(500) NOT NULL FIRST AFTER faculty_id,
  ADD COLUMN IF NOT EXISTS category VARCHAR(200) NOT NULL DEFAULT '' AFTER research_title,
  ADD COLUMN IF NOT EXISTS date DATE NOT NULL DEFAULT CURRENT_DATE AFTER category,
  ADD COLUMN IF NOT EXISTS sponsoring_agency VARCHAR(300) NOT NULL DEFAULT '' AFTER date;

-- Update faculty_extension_activities table
ALTER TABLE faculty_extension_activities
  DROP COLUMN IF EXISTS activity_title,
  DROP COLUMN IF EXISTS activity_type,
  DROP COLUMN IF EXISTS venue,
  DROP COLUMN IF EXISTS date_from,
  DROP COLUMN IF EXISTS date_to,
  DROP COLUMN IF EXISTS number_of_hours,
  DROP COLUMN IF EXISTS role,
  DROP COLUMN IF EXISTS number_of_beneficiaries,
  DROP COLUMN IF EXISTS description;

ALTER TABLE faculty_extension_activities
  ADD COLUMN IF NOT EXISTS extension_title VARCHAR(500) NOT NULL DEFAULT '' FIRST AFTER faculty_id,
  ADD COLUMN IF NOT EXISTS date_of_implementation DATE NOT NULL DEFAULT CURRENT_DATE AFTER extension_title,
  CHANGE COLUMN beneficiary beneficiary VARCHAR(300) NOT NULL AFTER date_of_implementation,
  ADD COLUMN IF NOT EXISTS location VARCHAR(300) NOT NULL DEFAULT '' AFTER beneficiary;

-- Update dean_seminars_trainings table
ALTER TABLE dean_seminars_trainings
  DROP COLUMN IF EXISTS type,
  DROP COLUMN IF EXISTS organizer,
  DROP COLUMN IF EXISTS venue,
  DROP COLUMN IF EXISTS date_from,
  DROP COLUMN IF EXISTS date_to,
  DROP COLUMN IF EXISTS file_path;

ALTER TABLE dean_seminars_trainings
  ADD COLUMN IF NOT EXISTS category ENUM('Local', 'National', 'International') NOT NULL DEFAULT 'Local' AFTER title,
  ADD COLUMN IF NOT EXISTS date DATE NOT NULL DEFAULT CURRENT_DATE AFTER category,
  ADD COLUMN IF NOT EXISTS sponsoring_agency VARCHAR(300) NOT NULL DEFAULT '' AFTER date,
  ADD COLUMN IF NOT EXISTS certificate_file VARCHAR(500) AFTER sponsoring_agency;

-- Update dean_research_activities table
ALTER TABLE dean_research_activities
  DROP COLUMN IF EXISTS title,
  DROP COLUMN IF EXISTS type,
  DROP COLUMN IF EXISTS venue,
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS file_path;

ALTER TABLE dean_research_activities
  ADD COLUMN IF NOT EXISTS research_title VARCHAR(500) NOT NULL DEFAULT '' FIRST AFTER dean_id,
  ADD COLUMN IF NOT EXISTS category VARCHAR(200) NOT NULL DEFAULT '' AFTER research_title,
  CHANGE COLUMN date date DATE NOT NULL AFTER category,
  ADD COLUMN IF NOT EXISTS sponsoring_agency VARCHAR(300) NOT NULL DEFAULT '' AFTER date,
  ADD COLUMN IF NOT EXISTS certificate_file VARCHAR(500) AFTER sponsoring_agency;

-- Update dean_extension_activities table
ALTER TABLE dean_extension_activities
  DROP COLUMN IF EXISTS title,
  DROP COLUMN IF EXISTS date_from,
  DROP COLUMN IF EXISTS date_to,
  DROP COLUMN IF EXISTS venue,
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS file_path;

ALTER TABLE dean_extension_activities
  ADD COLUMN IF NOT EXISTS extension_title VARCHAR(500) NOT NULL DEFAULT '' FIRST AFTER dean_id,
  ADD COLUMN IF NOT EXISTS date_of_implementation DATE NOT NULL DEFAULT CURRENT_DATE AFTER extension_title,
  ADD COLUMN IF NOT EXISTS beneficiary VARCHAR(300) NOT NULL DEFAULT '' AFTER date_of_implementation,
  ADD COLUMN IF NOT EXISTS location VARCHAR(300) NOT NULL DEFAULT '' AFTER beneficiary,
  ADD COLUMN IF NOT EXISTS documentation_file VARCHAR(500) AFTER location;
