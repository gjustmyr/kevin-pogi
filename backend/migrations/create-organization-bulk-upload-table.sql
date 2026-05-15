-- Migration: Create organization_bulk_uploads table
-- Description: Stores metadata about bulk upload files (file name and department only, not individual names)
-- Date: 2026-05-15

CREATE TABLE IF NOT EXISTS organization_bulk_uploads (
  upload_id INT AUTO_INCREMENT PRIMARY KEY,
  organization_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL COMMENT 'Original name of the uploaded CSV/Excel file',
  department VARCHAR(100) NOT NULL COMMENT 'Department to which the uploaded members belong',
  academic_year_id INT NOT NULL COMMENT 'Academic year for the bulk upload',
  term_start_date DATE NOT NULL COMMENT 'Term start date for the uploaded members',
  total_records INT NOT NULL DEFAULT 0 COMMENT 'Total number of records in the file',
  inserted_count INT NOT NULL DEFAULT 0 COMMENT 'Number of records successfully inserted',
  updated_count INT NOT NULL DEFAULT 0 COMMENT 'Number of records updated',
  skipped_count INT NOT NULL DEFAULT 0 COMMENT 'Number of records skipped',
  uploaded_by INT NOT NULL COMMENT 'User ID who performed the upload',
  upload_status ENUM('completed', 'partial', 'failed') NOT NULL DEFAULT 'completed' COMMENT 'Status of the bulk upload',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  
  FOREIGN KEY (organization_id) REFERENCES organizations(organization_id) ON DELETE CASCADE,
  FOREIGN KEY (academic_year_id) REFERENCES academic_years(academic_year_id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(user_id) ON DELETE CASCADE,
  
  INDEX idx_organization_id (organization_id),
  INDEX idx_academic_year_id (academic_year_id),
  INDEX idx_uploaded_by (uploaded_by),
  INDEX idx_created_at (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
