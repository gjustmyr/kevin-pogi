/**
 * Migration Script: Add training_provider column to dean_seminars_trainings table
 */

const db = require("../models");

async function addTrainingProviderColumn() {
  try {
    console.log("=".repeat(60));
    console.log("ADDING training_provider COLUMN");
    console.log("=".repeat(60));
    console.log();

    // Check if column already exists
    const [results] = await db.sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'dean_seminars_trainings'
        AND COLUMN_NAME = 'training_provider'
    `);

    if (results.length > 0) {
      console.log("✅ training_provider column already exists!");
      console.log("No action needed.");
    } else {
      console.log("Adding training_provider column to dean_seminars_trainings...");
      
      // Add the column
      await db.sequelize.query(`
        ALTER TABLE dean_seminars_trainings
        ADD COLUMN training_provider VARCHAR(255) NULL AFTER sponsoring_agency
      `);
      
      console.log("✅ training_provider column added successfully!");
      console.log();
      console.log("Column details:");
      console.log("  - Name: training_provider");
      console.log("  - Type: VARCHAR(255)");
      console.log("  - Nullable: YES");
      console.log("  - Position: After sponsoring_agency");
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

addTrainingProviderColumn();
