require("dotenv").config();
const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "faculty_management",
};

async function addDemographicsColumns() {
  let connection;

  try {
    console.log("============================================================");
    console.log("ADD DEMOGRAPHICS COLUMNS TO organization_members");
    console.log(
      "============================================================\n",
    );

    connection = await mysql.createConnection(dbConfig);
    console.log("✓ Connected to database\n");

    // Check if columns already exist
    const [columns] = await connection.query(
      `SHOW COLUMNS FROM organization_members LIKE 'gender'`,
    );

    if (columns.length > 0) {
      console.log("✓ Columns already exist. No migration needed.");
      return;
    }

    console.log("Adding demographics columns...");

    // Add gender column
    await connection.query(`
      ALTER TABLE organization_members
      ADD COLUMN gender ENUM('Male', 'Female') NULL AFTER contact_number
    `);
    console.log("✓ Added gender column");

    // Add program column
    await connection.query(`
      ALTER TABLE organization_members
      ADD COLUMN program VARCHAR(100) NULL COMMENT 'Degree program (e.g., BSIT, BSCS)' AFTER gender
    `);
    console.log("✓ Added program column");

    // Add section column
    await connection.query(`
      ALTER TABLE organization_members
      ADD COLUMN section VARCHAR(50) NULL AFTER program
    `);
    console.log("✓ Added section column");

    // Add department column
    await connection.query(`
      ALTER TABLE organization_members
      ADD COLUMN department VARCHAR(100) NULL AFTER section
    `);
    console.log("✓ Added department column");

    console.log("\n✓ Migration completed successfully!");
    console.log(
      "\nNote: Existing members will have NULL values for these fields.",
    );
    console.log("You can populate them by re-uploading member data via CSV.\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log("✓ Database connection closed");
    }
  }
}

// Run the migration
addDemographicsColumns()
  .then(() => {
    console.log(
      "\n============================================================",
    );
    console.log("MIGRATION COMPLETED");
    console.log("============================================================");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
