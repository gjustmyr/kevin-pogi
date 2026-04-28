-- Add email column to organization_event_attendees table
ALTER TABLE organization_event_attendees 
ADD COLUMN email VARCHAR(255) AFTER student_name;
