const mysql = require("mysql2/promise");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, ".env") });

async function createOrganizationEventsTables() {
  let connection;

  try {
    console.log("\n===========================================");
    console.log("   CREATE ORGANIZATION EVENTS TABLES");
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

    // Read the SQL migration file
    const sqlFile = path.join(
      __dirname,
      "migrations",
      "2026-04-28-create-organization-events.sql",
    );
    const sql = fs.readFileSync(sqlFile, "utf8");

    console.log("📋 Creating organization events tables...");

    // Execute the SQL
    await connection.query(sql);

    console.log("✓ Tables created successfully\n");

    // Verify tables exist
    const [tables] = await connection.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME IN (
        'organization_events',
        'organization_event_sdgs',
        'organization_event_guests',
        'organization_event_attendees'
      )
    `, [process.env.DB_NAME]);

    console.log("📊 Created tables:");
    tables.forEach((table) => {
      console.log(`   ✓ ${table.TABLE_NAME}`);
    });

    console.log("\n===========================================");
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY!");
    console.log("===========================================\n");
  } catch (error) {
    console.error("\n===========================================");
    console.error("❌ MIGRATION FAILED");
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

// Run the migration
createOrganizationEventsTables();
