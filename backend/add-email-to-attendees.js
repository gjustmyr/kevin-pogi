const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

async function addEmailColumn() {
  let connection;

  try {
    console.log("\n===========================================");
    console.log("   ADD EMAIL COLUMN TO ATTENDEES");
    console.log("===========================================\n");

    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME,
      multipleStatements: true,
    });

    console.log("✓ Connected to database\n");

    // Check if column already exists
    const [columns] = await connection.query(
      `SHOW COLUMNS FROM organization_event_attendees LIKE 'email'`,
    );

    if (columns.length > 0) {
      console.log("⊘ Column 'email' already exists");
      console.log("✓ No changes needed\n");
      return;
    }

    console.log("📋 Adding email column...");

    // Add the column
    await connection.query(`
      ALTER TABLE organization_event_attendees 
      ADD COLUMN email VARCHAR(255) NULL 
      AFTER student_name
    `);

    console.log("✓ Column added successfully\n");

    // Verify
    const [verify] = await connection.query(
      `SHOW COLUMNS FROM organization_event_attendees LIKE 'email'`,
    );

    if (verify.length > 0) {
      console.log("===========================================");
      console.log("✅ MIGRATION COMPLETED SUCCESSFULLY!");
      console.log("===========================================");
      console.log(
        "\nColumn 'email' has been added to organization_event_attendees table.\n",
      );
    }
  } catch (error) {
    console.error("\n===========================================");
    console.error("❌ MIGRATION FAILED");
    console.error("===========================================");
    console.error(`Error: ${error.message}`);

    if (error.code === "ER_DUP_FIELDNAME") {
      console.error("\nThe column already exists in the table.");
    }

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed.");
    }
  }
}

// Run the migration
addEmailColumn();
