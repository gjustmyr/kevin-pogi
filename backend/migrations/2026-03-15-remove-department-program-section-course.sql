-- Migration to remove Department, Program, Section, and Course tables
-- Date: 2026-03-15
-- Description: Removes CRUD functionality for Department, Program, Section, and Course
-- These entities will be managed through static/hardcoded values instead

-- Step 1: Drop foreign key constraints and tables that depend on these entities
-- Note: This will cascade delete all related data

-- Drop course_assignments table (depends on courses, sections, faculty, academic_years)
DROP TABLE IF EXISTS `course_assignments`;

-- Drop requirement_submissions table (depends on course_assignments)
DROP TABLE IF EXISTS `requirement_submissions`;

-- Drop courses table
DROP TABLE IF EXISTS `courses`;

-- Drop sections table
DROP TABLE IF EXISTS `sections`;

-- Drop programs table
DROP TABLE IF EXISTS `programs`;

-- Drop organizations table (depends on departments and faculty)
DROP TABLE IF EXISTS `organizations`;

-- Drop faculty table (depends on departments)
DROP TABLE IF EXISTS `faculty`;

-- Drop deans table (depends on departments)
DROP TABLE IF EXISTS `deans`;

-- Drop departments table
DROP TABLE IF EXISTS `departments`;

-- Note: After running this migration, you'll need to:
-- 1. Update the models to remove Department, Program, Section, Course
-- 2. Recreate tables without these foreign key dependencies
-- 3. Use Sequelize sync to recreate the modified tables
