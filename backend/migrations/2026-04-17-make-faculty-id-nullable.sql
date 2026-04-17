-- Make faculty_id nullable in organizations table
ALTER TABLE organizations 
MODIFY COLUMN faculty_id INT NULL;
