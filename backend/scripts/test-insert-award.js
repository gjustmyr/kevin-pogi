require("dotenv").config();
const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "database_cs",
};

async function testInsertAward() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database\n");
    
    console.log("Attempting to insert test award...");
    
    const testAward = {
      dean_id: 6,
      award_title: "Test Award",
      awarding_body: "Test Organization",
      date_received: "2024-01-15",
      level: "Institutional",
      description: "Test description",
      file_path: null,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    console.log("Test data:", testAward);
    
    const [result] = await connection.query(
      `INSERT INTO dean_awards (dean_id, award_title, awarding_body, date_received, level, description, file_path, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        testAward.dean_id,
        testAward.award_title,
        testAward.awarding_body,
        testAward.date_received,
        testAward.level,
        testAward.description,
        testAward.file_path,
        testAward.created_at,
        testAward.updated_at
      ]
    );
    
    console.log("\n✓ Award inserted successfully!");
    console.log("Insert ID:", result.insertId);
    
    // Verify the insert
    const [awards] = await connection.query("SELECT * FROM dean_awards WHERE id = ?", [result.insertId]);
    console.log("\nInserted award:", awards[0]);
    
    // Clean up
    await connection.query("DELETE FROM dean_awards WHERE id = ?", [result.insertId]);
    console.log("\n✓ Test award deleted");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("SQL State:", error.sqlState);
    console.error("SQL Message:", error.sqlMessage);
  } finally {
    if (connection) await connection.end();
  }
}

testInsertAward();
