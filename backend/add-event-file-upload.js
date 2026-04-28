const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

async function addEventFileUpload() {
  let connection;

  try {
    console.log("\n===========================================");
    console.log("   ADD EVENT FILE UPLOAD COLUMNS");
    console.log("===========================================\n");

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME,
      multipleStatements: true,
    });

    console.log("✓ Connected to database\n");

    // Check if columns already exist
    const [columns] = await connection.query(
      `SHOW COLUMNS FROM organization_events LIKE 'file_path'`,
    );

    if (columns.length > 0) {
      console.log("⊘ Columns already exist");
      console.log("✓ No changes needed\n");
      return;
    }

    console.log("📋 Adding file upload columns...");

    await connection.query(`
      ALTER TABLE organization_events 
      ADD COLUMN file_path VARCHAR(500) NULL AFTER description,
      ADD COLUMN original_filename VARCHAR(255) NULL AFTER file_path,
      ADD COLUMN file_size INT NULL AFTER original_filename,
      ADD COLUMN uploaded_at TIMESTAMP NULL AFTER file_size
    `);

    console.log("✓ Columns added successfully\n");

    console.log("📋 Dropping attendees table...");
    await connection.query(`DROP TABLE IF EXISTS organization_event_attendees`);
    console.log("✓ Attendees table dropped\n");

    console.log("===========================================");
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY!");
    console.log("===========================================\n");
  } catch (error) {
    console.error("\n===========================================");
    console.error("❌ MIGRATION FAILED");
    console.error("===========================================");
    console.error(`Error: ${error.message}`);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed.");
    }
  }
}

addEventFileUpload();
