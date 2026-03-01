const db = require("./models");

async function addEmployeeIdColumns() {
  try {
    console.log("Starting migration to add employee_id columns...");

    // Add employee_id to deans table (without UNIQUE constraint first)
    try {
      await db.sequelize.query(`
        ALTER TABLE deans 
        ADD COLUMN employee_id VARCHAR(5) AFTER dean_id
      `);
      console.log("✓ Added employee_id column to deans table");
    } catch (error) {
      if (error.message.includes("Duplicate column name")) {
        console.log("✓ employee_id column already exists in deans table");
      } else {
        throw error;
      }
    }

    // Add employee_id to faculties table (without UNIQUE constraint first)
    try {
      await db.sequelize.query(`
        ALTER TABLE faculties 
        ADD COLUMN employee_id VARCHAR(5) AFTER faculty_id
      `);
      console.log("✓ Added employee_id column to faculties table");
    } catch (error) {
      if (error.message.includes("Duplicate column name")) {
        console.log("✓ employee_id column already exists in faculties table");
      } else {
        throw error;
      }
    }

    console.log("\n✓ Migration completed successfully!");
    console.log("\nNote: Existing records will have NULL employee_id.");
    console.log("You may need to update or recreate existing deans/faculty.");
    console.log("\nThe UNIQUE constraint will be enforced by the application.");

    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error.message);
    process.exit(1);
  }
}

// Run migration
addEmployeeIdColumns();
