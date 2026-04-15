-- ============================================
-- ADD PASSPORT PHOTO TO FACULTY PERSONAL PROFILE
-- Date: 2026-04-15
-- Description: Adds passport_photo field to store passport-sized photos
-- ============================================

-- Add passport_photo to faculty_personal_profiles table
ALTER TABLE faculty_personal_profiles 
ADD COLUMN passport_photo VARCHAR(500) NULL 
AFTER profile_picture
COMMENT 'Path to passport photo (2x2, white background)';

-- Verification query
-- SELECT id, faculty_id, profile_picture, passport_photo FROM faculty_personal_profiles LIMIT 5;
