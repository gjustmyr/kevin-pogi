const mysql = require("mysql2/promise");
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

async function clearData() {
  let connection;

  try {
    console.log("=".repeat(60));
    console.log("DATABASE CLEAR DATA SCRIPT");
    console.log("=".repeat(60));
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log("=".repeat(60));
    console.log("\n⚠️  WARNING: This will DELETE ALL DATA from all tables!");
    console.log("Table structures will remain intact.");
    console.log("This action cannot be undone.\n");

    // Ask for confirmation
    const answer = await askQuestion(
      'Type "CLEAR" to confirm data deletion (or anything else to cancel): ',
    );

    if (answer.trim().toUpperCase() !== "CLEAR") {
      console.log("\n✗ Data clearing cancelled.");
      rl.close();
      process.exit(0);
    }

    console.log("\n🔄 Starting data clearing...\n");

    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME,
      multipleStatements: true,
    });

    console.log("✓ Connected to database");

    // Disable foreign key checks
    console.log("\n🔓 Disabling foreign key checks...");
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");

    // Get all tables
    const [tables] = await connection.query("SHOW TABLES");
    const tableKey = `Tables_in_${process.env.DB_NAME}`;

    if (tables.length === 0) {
      console.log("\n✓ No tables found in database");
    } else {
      console.log(`\n🗑️  Clearing data from ${tables.length} tables...\n`);

      let clearedCount = 0;
      let skippedCount = 0;

      for (const row of tables) {
        const tableName = row[tableKey];

        try {
          // Get row count before truncate
          const [countResult] = await connection.query(
            `SELECT COUNT(*) as count FROM \`${tableName}\``,
          );
          const rowCount = countResult[0].count;

          if (rowCount > 0) {
            console.log(`   Clearing: ${tableName} (${rowCount} rows)`);
            await connection.query(`TRUNCATE TABLE \`${tableName}\``);
            clearedCount++;
          } else {
            console.log(`   Skipping: ${tableName} (already empty)`);
            skippedCount++;
          }
        } catch (error) {
          console.log(
            `   ⚠️  Warning: Could not clear ${tableName} - ${error.message}`,
          );
          skippedCount++;
        }
      }

      console.log(`\n✓ Data cleared from ${clearedCount} tables`);
      if (skippedCount > 0) {
        console.log(`  ${skippedCount} tables skipped (empty or error)`);
      }
    }

    // Re-enable foreign key checks
    console.log("\n🔒 Re-enabling foreign key checks...");
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("\n" + "=".repeat(60));
    console.log("✅ DATA CLEARING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log(`\nAll data has been removed from '${process.env.DB_NAME}'.`);
    console.log("Table structures remain intact.\n");
  } catch (error) {
    console.error("\n" + "=".repeat(60));
    console.error("❌ DATA CLEARING FAILED");
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

// Run the clear
clearData();
