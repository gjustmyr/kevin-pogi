-- ============================================
-- ADD POSITION LEVEL TO FACULTY AND DEAN TABLES
-- Date: 2026-04-14
-- Description: Adds position_level field to track academic positions
-- ============================================

-- Add position_level to faculty table
ALTER TABLE faculties 
ADD COLUMN position_level VARCHAR(100) NULL 
COMMENT 'Academic position level (e.g., Lecturer 1, Professor 1, Associate Professor, etc.)';

-- Add position_level to dean table
ALTER TABLE deans 
ADD COLUMN position_level VARCHAR(100) NULL 
COMMENT 'Academic position level (e.g., Lecturer 1, Professor 1, Associate Professor, etc.)';

-- Verification queries
-- SELECT faculty_id, first_name, last_name, department, position_level FROM faculties LIMIT 5;
-- SELECT dean_id, first_name, last_name, department, position_level FROM deans LIMIT 5;
