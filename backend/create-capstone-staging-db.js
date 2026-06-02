const mysql = require("mysql2/promise");

async function createDatabase() {
  try {
    console.log("Creating capstone_staging database...");
    
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
    });

    await connection.query("CREATE DATABASE IF NOT EXISTS capstone_staging");
    console.log("✅ Database 'capstone_staging' created successfully");
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createDatabase();
