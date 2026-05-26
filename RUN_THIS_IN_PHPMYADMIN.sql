-- ========================================
-- Add is_archived Column to academic_years
-- ========================================
-- Run this in phpMyAdmin or MySQL Workbench
-- Database: database_cs
-- ========================================

USE database_cs;

-- Add is_archived column
ALTER TABLE `academic_years` 
ADD COLUMN `is_archived` TINYINT(1) NOT NULL DEFAULT 0 
AFTER `is_active`;

-- Add index for better performance
CREATE INDEX `idx_is_archived` ON `academic_years` (`is_archived`);

-- Set all existing records to not archived
UPDATE `academic_years` SET `is_archived` = 0;

-- Verify the column was added
SELECT 'Column added successfully!' AS Status;
DESCRIBE academic_years;
