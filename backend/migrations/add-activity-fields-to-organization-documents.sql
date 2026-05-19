-- Migration: Add activity fields to organization_documents table
-- This adds activity_date, venue, and participants fields

USE database_cs;

-- Make document_type_id nullable
ALTER TABLE `organization_documents` 
  MODIFY COLUMN `document_type_id` INT NULL;

-- Add new activity fields
ALTER TABLE `organization_documents` 
  ADD COLUMN `activity_date` DATE NULL COMMENT 'Date of the activity' AFTER `document_title`,
  ADD COLUMN `venue` VARCHAR(255) NULL COMMENT 'Venue of the activity' AFTER `activity_date`,
  ADD COLUMN `participants` INT NULL COMMENT 'Number of participants' AFTER `venue`;
