const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const path = require("path");
require("dotenv").config();

async function createDeanProfileTables() {
  let connection;

  try {
    console.log("\n===========================================");
    console.log("   CREATE DEAN PROFILE TABLES");
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

    // Read migration file
    const sql = await fs.readFile(
      path.join(
        __dirname,
        "migrations",
        "2026-04-15-create-dean-profile-system.sql",
      ),
      "utf8",
    );

    console.log("📋 Creating dean profile tables...\n");

    // Execute migration
    await connection.query(sql);

    console.log("✓ dean_personal_profiles");
    console.log("✓ dean_academic_profiles");
    console.log("✓ dean_employment_profiles");
    console.log("✓ dean_professional_memberships");
    console.log("✓ dean_awards");
    console.log("✓ dean_seminars_trainings");
    console.log("✓ dean_research_activities");
    console.log("✓ dean_extension_activities");

    console.log("\n===========================================");
    console.log("✅ TABLES CREATED SUCCESSFULLY!");
    console.log("===========================================");
    console.log("\nDean profile system tables have been created.\n");
  } catch (error) {
    console.error("\n===========================================");
    console.error("❌ TABLE CREATION FAILED");
    console.error("===========================================");
    console.error(`Error: ${error.message}`);

    if (error.code === "ER_TABLE_EXISTS_ERROR") {
      console.error("\nOne or more tables already exist.");
    }

    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed.");
    }
  }
}

// Run the script
createDeanProfileTables();
