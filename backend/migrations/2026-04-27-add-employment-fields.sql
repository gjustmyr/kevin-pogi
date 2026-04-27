-- Add missing fields to dean_employment_profiles table
ALTER TABLE dean_employment_profiles 
ADD COLUMN monthly_salary DECIMAL(10, 2) NULL AFTER is_current,
ADD COLUMN salary_grade VARCHAR(50) NULL AFTER monthly_salary,
ADD COLUMN is_government_service BOOLEAN DEFAULT TRUE AFTER salary_grade;

-- Update faculty employment table to match (rename government_service to is_government_service)
ALTER TABLE faculty_employment_profiles 
CHANGE COLUMN government_service is_government_service BOOLEAN DEFAULT FALSE;
