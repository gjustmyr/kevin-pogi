/**
 * Migration Script: Add dean_id column to personal_data_sheets table
 * 
 * This script adds the dean_id column to support Dean PDS functionality
 */

const db = require("../models");

async function addDeanIdColumn() {
  try {
    console.log("=".repeat(60));
    console.log("ADDING dean_id COLUMN TO personal_data_sheets");
    console.log("=".repeat(60));
    console.log();

    // Check if column already exists
    const [results] = await db.sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'personal_data_sheets'
        AND COLUMN_NAME = 'dean_id'
    `);

    if (results.length > 0) {
      console.log("✅ dean_id column already exists!");
      console.log("No action needed.");
    } else {
      console.log("Adding dean_id column...");
      
      // Add the column
      await db.sequelize.query(`
        ALTER TABLE personal_data_sheets
        ADD COLUMN dean_id INT NULL AFTER faculty_id,
        ADD INDEX idx_dean_id (dean_id)
      `);
      
      console.log("✅ dean_id column added successfully!");
      console.log();
      console.log("Column details:");
      console.log("  - Name: dean_id");
      console.log("  - Type: INT");
      console.log("  - Nullable: YES");
      console.log("  - Position: After faculty_id");
      console.log("  - Index: Added");
    }

    console.log();
    console.log("=".repeat(60));
    console.log("MIGRATION COMPLETE");
    console.log("=".repeat(60));

  } catch (error) {
    console.error("❌ Migration failed!");
    console.error("Error:", error.message);
    console.error();
    console.error("Full error:");
    console.error(error);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
}

addDeanIdColumn();
