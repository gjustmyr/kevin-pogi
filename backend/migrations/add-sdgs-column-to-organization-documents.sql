-- Migration: Add SDGs column to organization_documents table
-- This stores the selected SDGs for each report/activity

USE database_cs;

-- Add SDGs column (JSON type to store array of SDG IDs)
ALTER TABLE `organization_documents` 
  ADD COLUMN `sdgs` JSON NULL COMMENT 'Array of SDG IDs that this activity addresses' AFTER `participants`;
