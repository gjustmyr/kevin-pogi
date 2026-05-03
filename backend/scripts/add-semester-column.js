require("dotenv").config();
const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "faculty_management",
};

async function addSemesterColumn() {
  let connection;

  try {
    console.log("============================================================");
    console.log("ADD SEMESTER COLUMN TO organization_members");
    console.log(
      "============================================================\n",
    );

    connection = await mysql.createConnection(dbConfig);
    console.log("✓ Connected to database\n");

    // Check if column already exists
    const [columns] = await connection.query(
      `SHOW COLUMNS FROM organization_members LIKE 'semester'`,
    );

    if (columns.length > 0) {
      console.log("✓ Semester column already exists. No migration needed.");
      return;
    }

    console.log("Adding semester column...");

    // Add semester column
    await connection.query(`
      ALTER TABLE organization_members
      ADD COLUMN semester ENUM('1st Semester', '2nd Semester', 'Summer') NULL 
      COMMENT 'Semester within the academic year' 
      AFTER academic_year_id
    `);
    console.log("✓ Added semester column");

    console.log("\n✓ Migration completed successfully!");
    console.log(
      "\nNote: This allows tracking memberships per semester within an academic year.",
    );
    console.log(
      "Students can now have separate records for 1st sem, 2nd sem, and summer.\n",
    );
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
addSemesterColumn()
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
