-- Add dean_id column to personal_data_sheets table and make faculty_id nullable
-- Migration Date: 2026-04-27

ALTER TABLE personal_data_sheets 
MODIFY COLUMN faculty_id INT NULL,
ADD COLUMN dean_id INT NULL AFTER faculty_id,
ADD CONSTRAINT fk_pds_dean FOREIGN KEY (dean_id) REFERENCES deans(dean_id) ON DELETE CASCADE;
