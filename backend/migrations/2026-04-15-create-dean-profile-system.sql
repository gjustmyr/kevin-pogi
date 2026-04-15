-- ============================================
-- CREATE DEAN PROFILE SYSTEM
-- Date: 2026-04-15
-- Description: Creates profile tables for deans (similar to faculty profile system)
-- ============================================

-- Dean Personal Profile Table
CREATE TABLE IF NOT EXISTS dean_personal_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dean_id INT NOT NULL UNIQUE,
  profile_picture VARCHAR(500) NULL COMMENT 'Path to profile picture',
  passport_photo VARCHAR(500) NULL COMMENT 'Path to passport photo',
  title VARCHAR(50) NULL COMMENT 'Mr., Ms., Mrs., Dr., Prof., etc.',
  last_name VARCHAR(100) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100) NULL,
  extension_name VARCHAR(20) NULL COMMENT 'Jr., Sr., III, etc.',
  date_of_birth DATE NULL,
  place_of_birth VARCHAR(200) NULL,
  civil_status ENUM('Single', 'Married', 'Widowed', 'Separated', 'Divorced') NULL,
  sex ENUM('Male', 'Female') NULL,
  citizenship VARCHAR(100) NULL,
  mobile_number_primary VARCHAR(20) NOT NULL,
  mobile_number_secondary VARCHAR(20) NULL,
  email_primary VARCHAR(100) NOT NULL,
  email_secondary VARCHAR(100) NULL,
  home_country VARCHAR(100) NULL,
  home_region VARCHAR(100) NULL,
  home_province VARCHAR(100) NULL,
  home_barangay VARCHAR(200) NULL,
  home_street_subdivision VARCHAR(300) NULL,
  home_zip_code VARCHAR(20) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dean_id) REFERENCES deans(dean_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dean Academic Profile Table
CREATE TABLE IF NOT EXISTS dean_academic_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dean_id INT NOT NULL,
  level VARCHAR(50) NOT NULL COMMENT 'Elementary, Secondary, Vocational, College, Graduate Studies',
  school_name VARCHAR(200) NOT NULL,
  degree_course VARCHAR(200) NULL,
  year_graduated INT NULL,
  units_earned INT NULL,
  year_from INT NULL,
  year_to INT NULL,
  honors_received VARCHAR(200) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dean_id) REFERENCES deans(dean_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dean Employment Profile Table
CREATE TABLE IF NOT EXISTS dean_employment_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dean_id INT NOT NULL,
  position_title VARCHAR(200) NOT NULL,
  company_name VARCHAR(200) NOT NULL,
  employment_status VARCHAR(100) NULL COMMENT 'Permanent, Temporary, Contractual, Part-time',
  date_from DATE NOT NULL,
  date_to DATE NULL,
  is_current BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dean_id) REFERENCES deans(dean_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dean Professional Membership Table
CREATE TABLE IF NOT EXISTS dean_professional_memberships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dean_id INT NOT NULL,
  organization_name VARCHAR(200) NOT NULL,
  position VARCHAR(100) NULL,
  membership_type VARCHAR(100) NULL COMMENT 'Regular, Associate, Fellow, etc.',
  date_joined DATE NULL,
  date_ended DATE NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dean_id) REFERENCES deans(dean_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dean Awards Table
CREATE TABLE IF NOT EXISTS dean_awards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dean_id INT NOT NULL,
  award_title VARCHAR(200) NOT NULL,
  awarding_body VARCHAR(200) NOT NULL,
  date_received DATE NULL,
  description TEXT NULL,
  file_path VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dean_id) REFERENCES deans(dean_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dean Seminars/Trainings Table
CREATE TABLE IF NOT EXISTS dean_seminars_trainings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dean_id INT NOT NULL,
  title VARCHAR(300) NOT NULL,
  organizer VARCHAR(200) NULL,
  date_from DATE NULL,
  date_to DATE NULL,
  venue VARCHAR(300) NULL,
  type VARCHAR(100) NULL COMMENT 'Seminar, Training, Conference, Workshop',
  file_path VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dean_id) REFERENCES deans(dean_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dean Research Activities Table
CREATE TABLE IF NOT EXISTS dean_research_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dean_id INT NOT NULL,
  title VARCHAR(300) NOT NULL,
  type VARCHAR(100) NULL COMMENT 'Research, Publication, Presentation',
  date DATE NULL,
  venue VARCHAR(300) NULL,
  description TEXT NULL,
  file_path VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dean_id) REFERENCES deans(dean_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dean Extension Activities Table
CREATE TABLE IF NOT EXISTS dean_extension_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dean_id INT NOT NULL,
  title VARCHAR(300) NOT NULL,
  date_from DATE NULL,
  date_to DATE NULL,
  venue VARCHAR(300) NULL,
  description TEXT NULL,
  file_path VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (dean_id) REFERENCES deans(dean_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verification queries
-- SELECT * FROM dean_personal_profiles LIMIT 5;
-- SELECT * FROM dean_academic_profiles LIMIT 5;
-- SELECT * FROM dean_employment_profiles LIMIT 5;
