const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

async function addPassportPhotoColumn() {
  let connection;

  try {
    console.log("\n===========================================");
    console.log("   ADD PASSPORT PHOTO COLUMN");
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
      `SHOW COLUMNS FROM faculty_personal_profiles LIKE 'passport_photo'`,
    );

    if (columns.length > 0) {
      console.log("⊘ Column 'passport_photo' already exists");
      console.log("✓ No changes needed\n");
      return;
    }

    console.log("📋 Adding passport_photo column...");

    // Add the column
    await connection.query(`
      ALTER TABLE faculty_personal_profiles 
      ADD COLUMN passport_photo VARCHAR(500) NULL 
      AFTER profile_picture
      COMMENT 'Path to passport photo (2x2, white background)'
    `);

    console.log("✓ Column added successfully\n");

    // Verify
    const [verify] = await connection.query(
      `SHOW COLUMNS FROM faculty_personal_profiles LIKE 'passport_photo'`,
    );

    if (verify.length > 0) {
      console.log("===========================================");
      console.log("✅ MIGRATION COMPLETED SUCCESSFULLY!");
      console.log("===========================================");
      console.log(
        "\nColumn 'passport_photo' has been added to faculty_personal_profiles table.\n",
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
addPassportPhotoColumn();
