const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const path = require("path");
const readline = require("readline");
require("dotenv").config();

// Create readline interface for user confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function resetDatabase() {
  let connection;

  try {
    console.log("=".repeat(60));
    console.log("DATABASE RESET SCRIPT");
    console.log("=".repeat(60));
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log("=".repeat(60));
    console.log("\n⚠️  WARNING: This will DELETE ALL DATA in the database!");
    console.log("This action cannot be undone.\n");
    console.log("Options:");
    console.log("1. DROP DATABASE - Completely remove and recreate database");
    console.log("2. DROP TABLES - Remove all tables and recreate them");
    console.log("\n");

    // Ask for reset method
    const method = await askQuestion("Choose method (1 or 2): ");

    const useDropDatabase = method.trim() === "1";
    const useDropTables = method.trim() === "2";

    if (!useDropDatabase && !useDropTables) {
      console.log("\n✗ Invalid option. Database reset cancelled.");
      rl.close();
      process.exit(0);
    }

    // Ask for confirmation
    const answer = await askQuestion(
      'Type "RESET" to confirm database reset (or anything else to cancel): ',
    );

    if (answer.trim().toUpperCase() !== "RESET") {
      console.log("\n✗ Database reset cancelled.");
      rl.close();
      process.exit(0);
    }

    console.log("\n🔄 Starting database reset...\n");

    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      multipleStatements: true,
    });

    console.log("✓ Connected to MySQL server");

    if (useDropDatabase) {
      // Drop database if exists
      console.log(
        `\n🗑️  Dropping database '${process.env.DB_NAME}' if exists...`,
      );
      await connection.query(
        `DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\``,
      );
      console.log("✓ Database dropped");

      // Create database
      console.log(`\n🔨 Creating database '${process.env.DB_NAME}'...`);
      await connection.query(`CREATE DATABASE \`${process.env.DB_NAME}\``);
      console.log("✓ Database created");

      // Use the database
      await connection.query(`USE \`${process.env.DB_NAME}\``);
    } else if (useDropTables) {
      // Use the database
      await connection.query(`USE \`${process.env.DB_NAME}\``);

      // Disable foreign key checks
      console.log("\n🔓 Disabling foreign key checks...");
      await connection.query("SET FOREIGN_KEY_CHECKS = 0");

      // Get all tables
      const [tables] = await connection.query("SHOW TABLES");
      const tableKey = `Tables_in_${process.env.DB_NAME}`;

      if (tables.length > 0) {
        console.log(`\n🗑️  Dropping ${tables.length} tables...`);
        for (const row of tables) {
          const tableName = row[tableKey];
          console.log(`   Dropping: ${tableName}`);
          await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
        }
        console.log("✓ All tables dropped");
      } else {
        console.log("\n✓ No tables to drop");
      }

      // Re-enable foreign key checks
      console.log("\n🔒 Re-enabling foreign key checks...");
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    }

    // Get all migration files in order
    const migrationsDir = path.join(__dirname, "migrations");
    const files = await fs.readdir(migrationsDir);

    // Sort migration files (excluding seed-data.sql for now)
    const migrationFiles = files
      .filter((file) => file.endsWith(".sql") && file !== "seed-data.sql")
      .sort();

    // Run each migration
    console.log("\n📋 Running migrations...\n");
    for (const file of migrationFiles) {
      console.log(`   Running: ${file}`);
      const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
      await connection.query(sql);
      console.log(`   ✓ Completed: ${file}`);
    }

    // Run seed data if exists
    if (files.includes("seed-data.sql")) {
      console.log("\n🌱 Running seed data...");
      const seedSql = await fs.readFile(
        path.join(migrationsDir, "seed-data.sql"),
        "utf8",
      );
      await connection.query(seedSql);
      console.log("✓ Seed data inserted");
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ DATABASE RESET COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log(`\nDatabase '${process.env.DB_NAME}' has been reset.`);
    console.log("All tables have been recreated and seed data inserted.\n");
  } catch (error) {
    console.error("\n" + "=".repeat(60));
    console.error("❌ DATABASE RESET FAILED");
    console.error("=".repeat(60));
    console.error(`Error: ${error.message}`);
    console.error("\nStack trace:");
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed.");
    }
    rl.close();
  }
}

// Run the reset
resetDatabase();
