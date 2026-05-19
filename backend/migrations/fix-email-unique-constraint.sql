-- Migration: Fix email unique constraint to allow same email for different roles
-- This allows one email to be used for up to 3 accounts (1 org, 1 faculty, 1 dean)

-- Step 1: Drop the existing unique constraint on email
ALTER TABLE `users` DROP INDEX `email`;

-- Step 2: Add composite unique constraint on (email, role)
-- This ensures one email can only be used once per role
ALTER TABLE `users` ADD UNIQUE INDEX `unique_email_role` (`email`, `role`);

-- Verify the changes
SHOW INDEX FROM `users` WHERE Key_name = 'unique_email_role';
