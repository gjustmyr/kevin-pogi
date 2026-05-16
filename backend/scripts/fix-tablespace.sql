-- Fix tablespace issues by dropping and recreating the database
-- WARNING: This will delete ALL data in the database

-- Drop the database completely
DROP DATABASE IF EXISTS capstone_staging;

-- Recreate the database
CREATE DATABASE capstone_staging 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- Select the database
USE capstone_staging;

-- All tables will be recreated by Sequelize when the server starts
