-- Add is_archived column to academic_years table for soft delete functionality
ALTER TABLE `academic_years` 
ADD COLUMN `is_archived` TINYINT(1) NOT NULL DEFAULT 0 
AFTER `is_active`;

-- Add index for better query performance
CREATE INDEX `idx_is_archived` ON `academic_years` (`is_archived`);

-- Update any existing records to ensure they are not archived
UPDATE `academic_years` SET `is_archived` = 0 WHERE `is_archived` IS NULL;
