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
      database: process.env.DB_NAME || "capstone_db",
      multipleStatements: true,
    });

    console.log("Connected to database...");

    // Read migration file
    const sql = await fs.readFile(
      path.join(
        __dirname,
        "migrations",
        "2026-04-14-create-faculty-profile-system.sql",
      ),
      "utf8",
    );

    console.log("Running faculty profile system migration...");
    await connection.query(sql);

    console.log("✓ Migration completed successfully!");
    console.log("✓ Tables created:");
    console.log("  - faculty_personal_profile");
    console.log("  - faculty_academic_profile");
    console.log("  - faculty_employment_profile");
    console.log("  - faculty_professional_membership");
    console.log("  - faculty_awards");
    console.log("  - faculty_seminars_trainings");
    console.log("  - faculty_research_activities");
    console.log("  - faculty_extension_activities");
  } catch (error) {
    console.error("✗ Migration failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed.");
    }
  }
}

runMigration();
