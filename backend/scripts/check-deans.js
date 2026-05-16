require("dotenv").config();
const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "database_cs",
};

async function checkDeans() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database\n");
    
    const [deans] = await connection.query("SELECT dean_id, first_name, last_name, email FROM deans LIMIT 5");
    console.log("Deans in database:");
    console.log("========================================");
    deans.forEach(dean => {
      console.log(`ID: ${dean.dean_id}, Name: ${dean.first_name} ${dean.last_name}, Email: ${dean.email}`);
    });
    
    if (deans.length === 0) {
      console.log("No deans found in database!");
    }
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    if (connection) await connection.end();
  }
}

checkDeans();
