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
    console.log("Checking faculty_employment_profiles table...\n");

    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'faculty_employment_profiles'"
    );

    if (tables.length === 0) {
      console.log("❌ Table 'faculty_employment_profiles' does NOT exist!");
      const [allTables] = await connection.query(
        "SHOW TABLES LIKE '%employment%'"
      );
      console.log(allTables);
    } else {
      console.log("✓ Table 'faculty_employment_profiles' exists\n");
      const [columns] = await connection.query(
        "DESCRIBE faculty_employment_profiles"
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
