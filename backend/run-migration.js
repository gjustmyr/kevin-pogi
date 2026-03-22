const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config();

async function runMigration() {
  let connection;

  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "dyasmir_clearance_system",
      multipleStatements: true,
    });

    console.log("Connected to database...");

    // Read migration file
    const sql = await fs.readFile(
      path.join(
        __dirname,
        "migrations",
        "2026-03-22-create-faculty-credentials-tables.sql",
      ),
      "utf8",
    );

    console.log("Running migration...");
    await connection.query(sql);

    console.log("✓ Migration completed successfully!");
    console.log(
      "✓ Tables created: faculty_credentials, credential_certificates",
    );
  } catch (error) {
    console.error("✗ Migration failed:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed.");
    }
  }
}

runMigration();
