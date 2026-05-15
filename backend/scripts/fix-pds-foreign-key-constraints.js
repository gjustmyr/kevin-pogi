/**
 * Migration Script: Fix PDS foreign key constraints
 * 
 * This script modifies the personal_data_sheets table to:
 * 1. Make faculty_id nullable (allow NULL)
 * 2. Make dean_id nullable (allow NULL)
 * 3. Ensure at least one of them must be set (handled by application logic)
 */

const db = require("../models");

async function fixForeignKeyConstraints() {
  try {
    console.log("=".repeat(60));
    console.log("FIXING PDS FOREIGN KEY CONSTRAINTS");
    console.log("=".repeat(60));
    console.log();

    // Step 1: Check current faculty_id column definition
    console.log("Step 1: Checking current column definitions...");
    const [facultyIdInfo] = await db.sequelize.query(`
      SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'personal_data_sheets'
        AND COLUMN_NAME = 'faculty_id'
    `);

    console.log("Current faculty_id:", facultyIdInfo[0]);

    // Step 2: Drop the existing foreign key constraint
    console.log();
    console.log("Step 2: Dropping existing foreign key constraint...");
    
    try {
      await db.sequelize.query(`
        ALTER TABLE personal_data_sheets
        DROP FOREIGN KEY personal_data_sheets_ibfk_1
      `);
      console.log("✅ Foreign key constraint dropped");
    } catch (error) {
      if (error.message.includes("check that column/key exists")) {
        console.log("⚠️  Foreign key constraint doesn't exist or already dropped");
      } else {
        throw error;
      }
    }

    // Step 3: Modify faculty_id to allow NULL
    console.log();
    console.log("Step 3: Modifying faculty_id to allow NULL...");
    await db.sequelize.query(`
      ALTER TABLE personal_data_sheets
      MODIFY COLUMN faculty_id INT NULL
    `);
    console.log("✅ faculty_id now allows NULL");

    // Step 4: Ensure dean_id allows NULL
    console.log();
    console.log("Step 4: Ensuring dean_id allows NULL...");
    await db.sequelize.query(`
      ALTER TABLE personal_data_sheets
      MODIFY COLUMN dean_id INT NULL
    `);
    console.log("✅ dean_id allows NULL");

    // Step 5: Re-add foreign key constraint with NULL support
    console.log();
    console.log("Step 5: Re-adding foreign key constraint...");
    await db.sequelize.query(`
      ALTER TABLE personal_data_sheets
      ADD CONSTRAINT personal_data_sheets_ibfk_1
      FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id)
      ON DELETE CASCADE ON UPDATE CASCADE
    `);
    console.log("✅ Foreign key constraint re-added (allows NULL)");

    // Step 6: Add foreign key for dean_id if not exists
    console.log();
    console.log("Step 6: Adding foreign key constraint for dean_id...");
    
    try {
      await db.sequelize.query(`
        ALTER TABLE personal_data_sheets
        ADD CONSTRAINT personal_data_sheets_ibfk_2
        FOREIGN KEY (dean_id) REFERENCES deans(dean_id)
        ON DELETE CASCADE ON UPDATE CASCADE
      `);
      console.log("✅ Dean foreign key constraint added");
    } catch (error) {
      if (error.message.includes("Duplicate key name")) {
        console.log("⚠️  Dean foreign key constraint already exists");
      } else {
        throw error;
      }
    }

    // Step 7: Verify the changes
    console.log();
    console.log("Step 7: Verifying changes...");
    const [finalCheck] = await db.sequelize.query(`
      SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'personal_data_sheets'
        AND COLUMN_NAME IN ('faculty_id', 'dean_id')
      ORDER BY COLUMN_NAME
    `);

    console.log();
    console.log("Final column definitions:");
    finalCheck.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME}: ${col.COLUMN_TYPE}, Nullable: ${col.IS_NULLABLE}`);
    });

    console.log();
    console.log("=".repeat(60));
    console.log("MIGRATION COMPLETE");
    console.log("=".repeat(60));
    console.log();
    console.log("✅ Both faculty_id and dean_id now allow NULL");
    console.log("✅ Foreign key constraints properly configured");
    console.log("✅ Faculty PDS records will have faculty_id, dean_id = NULL");
    console.log("✅ Dean PDS records will have dean_id, faculty_id = NULL");

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

fixForeignKeyConstraints();
