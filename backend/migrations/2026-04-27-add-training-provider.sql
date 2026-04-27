-- Add training_provider column to seminar/training tables
-- Migration Date: 2026-04-27

ALTER TABLE faculty_seminars_trainings 
ADD COLUMN training_provider VARCHAR(300) NULL AFTER sponsoring_agency;

ALTER TABLE dean_seminars_training
ADD COLUMN training_provider VARCHAR(300) NULL AFTER sponsoring_agency;
