require("dotenv").config();
const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "database_cs",
};

async function checkTable() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database\n");
    
    const [columns] = await connection.query("DESCRIBE dean_awards");
    console.log("dean_awards table structure:");
    console.log("========================================");
    columns.forEach(col => {
      console.log(`${col.Field.padEnd(25)} ${col.Type.padEnd(30)} NULL:${col.Null} KEY:${col.Key} DEFAULT:${col.Default}`);
    });
    
    console.log("\n\nChecking for existing records:");
    const [records] = await connection.query("SELECT * FROM dean_awards LIMIT 5");
    console.log(`Found ${records.length} record(s)`);
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    if (connection) await connection.end();
  }
}

checkTable();
