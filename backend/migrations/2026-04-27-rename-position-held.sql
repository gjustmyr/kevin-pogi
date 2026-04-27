-- Rename position_held to position in professional membership tables
-- Migration Date: 2026-04-27

-- Faculty professional membership
ALTER TABLE faculty_professional_memberships 
CHANGE COLUMN position_held position VARCHAR(200);

-- Dean professional membership
ALTER TABLE dean_professional_memberships 
CHANGE COLUMN position_held position VARCHAR(100);
