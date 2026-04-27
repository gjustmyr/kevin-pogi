-- Remove membership_id_number column from faculty_professional_membership table
-- Remove is_active column from both faculty and dean professional membership tables
-- Migration Date: 2026-04-27

ALTER TABLE faculty_professional_membership 
DROP COLUMN IF EXISTS membership_id_number,
DROP COLUMN IF EXISTS is_active;

ALTER TABLE dean_professional_memberships
DROP COLUMN IF EXISTS is_active;
