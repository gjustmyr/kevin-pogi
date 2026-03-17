-- Migration: Create Organization Structure Tables
-- Date: 2026-03-17
-- Description: Creates tables for organization members, advisers, and document submissions

-- Table: organization_advisers
-- Purpose: Store faculty advisers for organizations (2 per organization)
CREATE TABLE IF NOT EXISTS organization_advisers (
    adviser_id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    faculty_id INT NOT NULL,
    assigned_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id) ON DELETE CASCADE,
    FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id) ON DELETE CASCADE,
    UNIQUE KEY unique_active_adviser (organization_id, faculty_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: organization_members
-- Purpose: Store student members and their positions in organizations
CREATE TABLE IF NOT EXISTS organization_members (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    sr_code VARCHAR(20) NOT NULL COMMENT 'Student Reference Code',
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    contact_number VARCHAR(20),
    year_level ENUM('1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year') NOT NULL,
    position VARCHAR(100) NOT NULL COMMENT 'President, Vice President, Secretary, etc.',
    parent_member_id INT NULL COMMENT 'ID of supervising member (for hierarchy)',
    academic_year_id INT NOT NULL COMMENT 'Links to academic year/term',
    is_active BOOLEAN DEFAULT TRUE,
    term_start_date DATE NOT NULL,
    term_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_member_id) REFERENCES organization_members(member_id) ON DELETE SET NULL,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(academic_year_id) ON DELETE CASCADE,
    INDEX idx_sr_code (sr_code),
    INDEX idx_organization_term (organization_id, academic_year_id),
    INDEX idx_active_members (organization_id, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: document_types
-- Purpose: Define types of documents organizations must submit
CREATE TABLE IF NOT EXISTS document_types (
    document_type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    required_per_semester BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default document types
INSERT INTO document_types (type_name, description, required_per_semester) VALUES
('Application for Committee Heads and Members', 'Application form for committee heads and members', TRUE),
('Application for Year Representatives', 'Application form for year representatives', TRUE),
('Recognition Documents', 'Documents for organization recognition', TRUE),
('Membership Fee Documentation', 'Documentation of membership fees', TRUE),
('Event Proposals', 'Proposals for organization events', FALSE),
('Acknowledgment or Accomplishment Reports', 'Reports of completed activities and accomplishments', FALSE);

-- Table: organization_documents
-- Purpose: Store documents submitted by organizations
CREATE TABLE IF NOT EXISTS organization_documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    document_type_id INT NOT NULL,
    academic_year_id INT NOT NULL,
    semester ENUM('1st Semester', '2nd Semester', 'Summer') NOT NULL,
    document_title VARCHAR(255) NOT NULL,
    document_path VARCHAR(500) NOT NULL COMMENT 'File path in server',
    original_filename VARCHAR(255) NOT NULL,
    file_size INT NOT NULL COMMENT 'File size in bytes',
    mime_type VARCHAR(100) NOT NULL,
    submitted_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    status ENUM('pending', 'approved', 'rejected', 'revision_needed') DEFAULT 'pending',
    reviewed_by INT NULL COMMENT 'Dean user_id who reviewed',
    review_date DATE NULL,
    review_comments TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id) ON DELETE CASCADE,
    FOREIGN KEY (document_type_id) REFERENCES document_types(document_type_id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(academic_year_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_org_semester (organization_id, academic_year_id, semester),
    INDEX idx_status (status),
    INDEX idx_document_type (document_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: organization_position_templates
-- Purpose: Define valid positions and their hierarchy level
CREATE TABLE IF NOT EXISTS organization_position_templates (
    position_id INT AUTO_INCREMENT PRIMARY KEY,
    position_name VARCHAR(100) NOT NULL UNIQUE,
    hierarchy_level INT NOT NULL COMMENT '1=President, 2=VP, 3=Officers, 4=Sub-officers, 5=Members',
    max_allowed INT DEFAULT 1 COMMENT 'Maximum number of this position per organization',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert position templates
INSERT INTO organization_position_templates (position_name, hierarchy_level, max_allowed, description) VALUES
('President', 1, 1, 'Organization President'),
('Vice President', 2, 1, 'Organization Vice President'),
('Secretary', 3, 1, 'Organization Secretary'),
('Treasurer', 3, 1, 'Organization Treasurer'),
('Auditor', 3, 1, 'Organization Auditor'),
('P.R.O.', 3, 2, 'Public Relations Officer'),
('Business Manager', 3, 1, 'Business Manager'),
('Multimedia Director', 3, 1, 'Multimedia Director'),
('COMDRRM Head', 3, 1, 'Committee on Disaster Risk Reduction Management Head'),
('Multimedia Member', 4, 999, 'Member under Multimedia Director'),
('COMDRRM Member', 4, 2, 'Member under COMDRRM Head'),
('1st Year Representative', 4, 999, 'First Year Representative'),
('2nd Year Representative', 4, 999, 'Second Year Representative'),
('3rd Year Representative', 4, 999, 'Third Year Representative'),
('General Member', 5, 999, 'General organization member');
