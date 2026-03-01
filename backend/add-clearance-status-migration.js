const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "faculty_accomplishment_db",
};

async function addClearanceStatusFields() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database");

    // Check if clearance_status already exists
    const [columns] = await connection.query(
      "SHOW COLUMNS FROM faculties LIKE 'clearance_status'"
    );

    if (columns.length === 0) {
      console.log("Adding clearance_status field...");
      await connection.query(`
        ALTER TABLE faculties 
        ADD COLUMN clearance_status ENUM('pending', 'cleared', 'withholding') 
        DEFAULT 'pending' 
        COMMENT 'pending=incomplete requirements, cleared=all requirements approved, withholding=has returned requirements'
        AFTER user_id
      `);
      console.log("✓ clearance_status field added");
    } else {
      console.log("clearance_status field already exists");
    }

    // Check if clearance_remarks already exists
    const [remarksColumns] = await connection.query(
      "SHOW COLUMNS FROM faculties LIKE 'clearance_remarks'"
    );

    if (remarksColumns.length === 0) {
      console.log("Adding clearance_remarks field...");
      await connection.query(`
        ALTER TABLE faculties 
        ADD COLUMN clearance_remarks TEXT NULL 
        COMMENT 'Dean''s remarks on faculty clearance status'
        AFTER clearance_status
      `);
      console.log("✓ clearance_remarks field added");
    } else {
      console.log("clearance_remarks field already exists");
    }

    // Check if clearance_date already exists
    const [dateColumns] = await connection.query(
      "SHOW COLUMNS FROM faculties LIKE 'clearance_date'"
    );

    if (dateColumns.length === 0) {
      console.log("Adding clearance_date field...");
      await connection.query(`
        ALTER TABLE faculties 
        ADD COLUMN clearance_date DATETIME NULL 
        COMMENT 'Date when faculty was cleared or status changed'
        AFTER clearance_remarks
      `);
      console.log("✓ clearance_date field added");
    } else {
      console.log("clearance_date field already exists");
    }

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addClearanceStatusFields();
