require("dotenv").config();
const mysql = require("mysql2/promise");

async function checkTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log("Checking faculty_seminars_trainings table...\n");

    // Check if table exists
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'faculty_seminars_trainings'"
    );

    if (tables.length === 0) {
      console.log("❌ Table 'faculty_seminars_trainings' does NOT exist!");
      console.log("\nChecking for similar table names:");
      const [allTables] = await connection.query(
        "SHOW TABLES LIKE '%seminar%'"
      );
      console.log(allTables);
    } else {
      console.log("✓ Table 'faculty_seminars_trainings' exists\n");

      // Show table structure
      const [columns] = await connection.query(
        "DESCRIBE faculty_seminars_trainings"
      );
      console.log("Table structure:");
      console.table(columns);
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await connection.end();
  }
}

checkTable();
