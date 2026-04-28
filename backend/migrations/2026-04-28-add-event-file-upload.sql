-- Add file upload columns to organization_events table
ALTER TABLE organization_events 
ADD COLUMN file_path VARCHAR(500) NULL AFTER description,
ADD COLUMN original_filename VARCHAR(255) NULL AFTER file_path,
ADD COLUMN file_size INT NULL AFTER original_filename,
ADD COLUMN uploaded_at TIMESTAMP NULL AFTER file_size;

-- Drop attendees tables as they're being replaced
DROP TABLE IF EXISTS organization_event_attendees;
