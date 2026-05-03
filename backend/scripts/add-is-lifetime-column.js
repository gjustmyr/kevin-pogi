const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function addIsLifetimeColumn() {
  let connection;

  try {
    console.log("=".repeat(60));
    console.log("ADD is_lifetime COLUMN TO dean_professional_memberships");
    console.log("=".repeat(60));
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Host: ${process.env.DB_HOST}\n`);

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "capstone_staging",
    });

    console.log("✓ Connected to database\n");

    // Check if column exists
    const [columns] = await connection.query(
      "SHOW COLUMNS FROM dean_professional_memberships LIKE 'is_lifetime'",
    );

    if (columns.length > 0) {
      console.log("✓ Column 'is_lifetime' already exists");
    } else {
      console.log("Adding 'is_lifetime' column...");
      await connection.query(`
        ALTER TABLE dean_professional_memberships
        ADD COLUMN is_lifetime BOOLEAN DEFAULT FALSE AFTER date_joined
      `);
      console.log("✓ Column 'is_lifetime' added successfully");
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addIsLifetimeColumn();
