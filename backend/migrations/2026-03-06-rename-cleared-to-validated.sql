-- Migration: Rename 'cleared' status to 'validated' for requirement_submissions
-- Date: March 6, 2026
-- Description: Changes the enum value from 'cleared' to 'validated' to better distinguish
--              between individual file validation status and faculty overall clearance status

-- Step 1: Add the new enum value 'validated' to the status column
ALTER TABLE requirement_submissions 
MODIFY COLUMN status ENUM('pending', 'cleared', 'validated', 'returned') 
DEFAULT 'pending'
COMMENT 'pending=awaiting review, validated=approved by dean, returned=needs revision';

-- Step 2: Update all existing 'cleared' records to 'validated'
UPDATE requirement_submissions 
SET status = 'validated' 
WHERE status = 'cleared';

-- Step 3: Remove the old 'cleared' enum value
ALTER TABLE requirement_submissions 
MODIFY COLUMN status ENUM('pending', 'validated', 'returned') 
DEFAULT 'pending'
COMMENT 'pending=awaiting review, validated=approved by dean, returned=needs revision';

-- Verification query (run after migration to confirm changes)
-- SELECT status, COUNT(*) as count 
-- FROM requirement_submissions 
-- GROUP BY status;
