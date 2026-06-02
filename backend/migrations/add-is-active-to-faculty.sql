-- Add is_active column to faculties table for soft delete functionality
-- This allows disabling faculty accounts without permanent deletion

ALTER TABLE faculties 
ADD COLUMN is_active BOOLEAN DEFAULT true 
COMMENT 'Account status: true=active (can login), false=disabled (cannot login)';

-- Set all existing faculty to active
UPDATE faculties SET is_active = true WHERE is_active IS NULL;

-- Create index for better query performance
CREATE INDEX idx_faculties_is_active ON faculties(is_active);

-- Also add is_active to users table if not exists
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true 
COMMENT 'Account status: true=active (can login), false=disabled (cannot login)';

-- Set all existing users to active
UPDATE users SET is_active = true WHERE is_active IS NULL;

-- Create index for better query performance on users table
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
