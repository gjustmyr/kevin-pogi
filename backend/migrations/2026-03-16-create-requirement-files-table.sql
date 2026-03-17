-- Migration: Support multiple files per requirement submission
-- Date: 2026-03-16
-- Description: Create requirement_files table to enable multiple file uploads per requirement

-- Create requirement_files table
CREATE TABLE IF NOT EXISTS requirement_files (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id INT NOT NULL,
    file_path VARCHAR(500) NOT NULL COMMENT 'Path to uploaded file',
    file_name VARCHAR(255) NOT NULL COMMENT 'Original file name',
    file_size INT COMMENT 'File size in bytes',
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES requirement_submissions(submission_id) ON DELETE CASCADE,
    INDEX idx_submission (submission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migrate existing files from requirement_submissions to requirement_files
INSERT INTO requirement_files (submission_id, file_path, file_name, file_size, upload_date)
SELECT submission_id, file_path, file_name, file_size, submission_date
FROM requirement_submissions
WHERE file_path IS NOT NULL;

-- Note: We keep file_path, file_name, file_size columns in requirement_submissions for now
-- to maintain backward compatibility. They will be deprecated in future versions.
-- New submissions will only use the requirement_files table.
