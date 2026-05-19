-- Migration: Make organization_members fields nullable
-- This allows optional fields when adding officers

USE database_cs;

-- Make fields nullable
ALTER TABLE `organization_members` 
  MODIFY COLUMN `sr_code` VARCHAR(20) NULL COMMENT 'Student Reference Code',
  MODIFY COLUMN `first_name` VARCHAR(100) NULL,
  MODIFY COLUMN `last_name` VARCHAR(100) NULL,
  MODIFY COLUMN `year_level` ENUM('1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year') NULL,
  MODIFY COLUMN `position` VARCHAR(100) NULL COMMENT 'President, Vice President, Secretary, etc.',
  MODIFY COLUMN `academic_year_id` INT NULL COMMENT 'Links to academic year/term',
  MODIFY COLUMN `term_start_date` DATE NULL;

-- Note: The foreign key constraint will remain, but NULL values are now allowed
