-- Add is_lifetime column to faculty_professional_membership table
ALTER TABLE faculty_professional_membership
ADD COLUMN is_lifetime BOOLEAN DEFAULT FALSE;

-- Add is_lifetime column to dean_professional_membership table
ALTER TABLE dean_professional_membership
ADD COLUMN is_lifetime BOOLEAN DEFAULT FALSE;
