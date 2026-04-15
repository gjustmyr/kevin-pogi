-- Faculty Profile System Migration
-- This replaces the old credentials system with a comprehensive profile system

-- Personal Profile Table
CREATE TABLE IF NOT EXISTS faculty_personal_profile (
  id INT PRIMARY KEY AUTO_INCREMENT,
  faculty_id INT NOT NULL UNIQUE,
  profile_picture VARCHAR(500),
  title VARCHAR(50),
  last_name VARCHAR(100) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  extension_name VARCHAR(20),
  date_of_birth DATE,
  place_of_birth VARCHAR(200),
  civil_status ENUM('Single', 'Married', 'Widowed', 'Separated', 'Divorced'),
  sex ENUM('Male', 'Female'),
  citizenship VARCHAR(100),
  mobile_number_primary VARCHAR(20) NOT NULL,
  mobile_number_secondary VARCHAR(20),
  email_primary VARCHAR(100) NOT NULL,
  email_secondary VARCHAR(100),
  -- Home Address
  home_country VARCHAR(100),
  home_region VARCHAR(100),
  home_province VARCHAR(100),
  home_barangay VARCHAR(200),
  home_street_subdivision VARCHAR(300),
  home_zip_code VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Academic Profile Table
CREATE TABLE IF NOT EXISTS faculty_academic_profile (
  id INT PRIMARY KEY AUTO_INCREMENT,
  faculty_id INT NOT NULL,
  level ENUM('Elementary', 'Secondary', 'Vocational', 'College', 'Graduate Studies') NOT NULL,
  school_name VARCHAR(300) NOT NULL,
  degree_course VARCHAR(300),
  year_graduated INT,
  units_earned VARCHAR(50),
  year_attended_from INT,
  year_attended_to INT,
  honors_received VARCHAR(300),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Employment Profile Table
CREATE TABLE IF NOT EXISTS faculty_employment_profile (
  id INT PRIMARY KEY AUTO_INCREMENT,
  faculty_id INT NOT NULL,
  position_title VARCHAR(300) NOT NULL,
  company_name VARCHAR(300) NOT NULL,
  employment_status ENUM('Permanent', 'Temporary', 'Contractual', 'Part-time') NOT NULL,
  salary_grade VARCHAR(50),
  monthly_salary DECIMAL(12,2),
  date_from DATE NOT NULL,
  date_to DATE,
  is_current BOOLEAN DEFAULT FALSE,
  appointment_status VARCHAR(100),
  government_service BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Professional Membership Table
CREATE TABLE IF NOT EXISTS faculty_professional_membership (
  id INT PRIMARY KEY AUTO_INCREMENT,
  faculty_id INT NOT NULL,
  organization_name VARCHAR(300) NOT NULL,
  position_held VARCHAR(200),
  membership_type ENUM('Regular', 'Associate', 'Fellow', 'Honorary', 'Student', 'Other'),
  date_joined DATE,
  date_ended DATE,
  is_active BOOLEAN DEFAULT TRUE,
  membership_id_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Awards Received Table
CREATE TABLE IF NOT EXISTS faculty_awards (
  id INT PRIMARY KEY AUTO_INCREMENT,
  faculty_id INT NOT NULL,
  award_title VARCHAR(300) NOT NULL,
  awarding_body VARCHAR(300) NOT NULL,
  date_received DATE NOT NULL,
  level ENUM('International', 'National', 'Regional', 'Local', 'Institutional') NOT NULL,
  description TEXT,
  certificate_file VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seminars/Trainings/Conferences Table
CREATE TABLE IF NOT EXISTS faculty_seminars_trainings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  faculty_id INT NOT NULL,
  title VARCHAR(500) NOT NULL,
  type ENUM('Seminar', 'Training', 'Conference', 'Workshop', 'Webinar', 'Symposium') NOT NULL,
  organizer VARCHAR(300) NOT NULL,
  venue VARCHAR(300),
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  number_of_hours DECIMAL(5,2),
  role ENUM('Participant', 'Speaker', 'Resource Person', 'Facilitator', 'Organizer') DEFAULT 'Participant',
  certificate_file VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Research-related Activities Table
CREATE TABLE IF NOT EXISTS faculty_research_activities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  faculty_id INT NOT NULL,
  activity_title VARCHAR(500) NOT NULL,
  activity_type ENUM('Research Seminar', 'Research Workshop', 'Research Training', 'Research Conference', 'Research Presentation') NOT NULL,
  organizer VARCHAR(300) NOT NULL,
  venue VARCHAR(300),
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  role ENUM('Participant', 'Presenter', 'Researcher', 'Facilitator', 'Organizer') DEFAULT 'Participant',
  research_title VARCHAR(500),
  certificate_file VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Extension Activities Table
CREATE TABLE IF NOT EXISTS faculty_extension_activities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  faculty_id INT NOT NULL,
  activity_title VARCHAR(500) NOT NULL,
  activity_type ENUM('Community Service', 'Outreach Program', 'Training/Seminar', 'Consultancy', 'Technical Assistance', 'Other') NOT NULL,
  beneficiary VARCHAR(300) NOT NULL,
  venue VARCHAR(300),
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  number_of_hours DECIMAL(5,2),
  role ENUM('Coordinator', 'Member', 'Resource Person', 'Facilitator', 'Participant') DEFAULT 'Participant',
  number_of_beneficiaries INT,
  description TEXT,
  documentation_file VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create indexes for better performance
CREATE INDEX idx_faculty_personal_profile_faculty_id ON faculty_personal_profile(faculty_id);
CREATE INDEX idx_faculty_academic_profile_faculty_id ON faculty_academic_profile(faculty_id);
CREATE INDEX idx_faculty_employment_profile_faculty_id ON faculty_employment_profile(faculty_id);
CREATE INDEX idx_faculty_professional_membership_faculty_id ON faculty_professional_membership(faculty_id);
CREATE INDEX idx_faculty_awards_faculty_id ON faculty_awards(faculty_id);
CREATE INDEX idx_faculty_seminars_trainings_faculty_id ON faculty_seminars_trainings(faculty_id);
CREATE INDEX idx_faculty_research_activities_faculty_id ON faculty_research_activities(faculty_id);
CREATE INDEX idx_faculty_extension_activities_faculty_id ON faculty_extension_activities(faculty_id);
