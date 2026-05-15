require("dotenv").config();
const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "database_cs",
};

async function testAwardCreation() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("✓ Connected to database\n");

    // Test 1: Check table structure
    console.log("TEST 1: Checking table structure...");
    const [columns] = await connection.query("DESCRIBE dean_awards");
    console.log("Columns:", columns.map(c => c.Field).join(", "));
    
    // Test 2: Check if dean exists
    console.log("\nTEST 2: Checking for deans...");
    const [deans] = await connection.query("SELECT dean_id, first_name, last_name FROM deans LIMIT 1");
    if (deans.length === 0) {
      console.log("❌ No deans found in database!");
      return;
    }
    const testDeanId = deans[0].dean_id;
    console.log(`✓ Found dean: ${deans[0].first_name} ${deans[0].last_name} (ID: ${testDeanId})`);

    // Test 3: Try to insert an award
    console.log("\nTEST 3: Attempting to insert award...");
    const testData = {
      dean_id: testDeanId,
      award_title: "Test Award " + Date.now(),
      awarding_body: "Test Organization",
      date_received: "2024-01-15",
      level: "Institutional",
      description: "Test description",
      certificate_file: null,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    console.log("Test data:", JSON.stringify(testData, null, 2));
    
    const [result] = await connection.query(
      `INSERT INTO dean_awards (dean_id, award_title, awarding_body, date_received, level, description, certificate_file, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        testData.dean_id,
        testData.award_title,
        testData.awarding_body,
        testData.date_received,
        testData.level,
        testData.description,
        testData.certificate_file,
        testData.created_at,
        testData.updated_at
      ]
    );
    
    console.log("\n✓ Award inserted successfully!");
    console.log("Insert ID:", result.insertId);
    
    // Verify
    const [awards] = await connection.query("SELECT * FROM dean_awards WHERE id = ?", [result.insertId]);
    console.log("\nInserted award:", awards[0]);
    
    // Cleanup
    await connection.query("DELETE FROM dean_awards WHERE id = ?", [result.insertId]);
    console.log("\n✓ Test award deleted");
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ ALL TESTS PASSED - Database is working correctly!");
    console.log("=".repeat(60));
    console.log("\nThe issue must be in the backend API or frontend.");
    console.log("Please check:");
    console.log("1. Is the backend server running?");
    console.log("2. Check backend console for error messages");
    console.log("3. Check browser console for network errors");
    
  } catch (error) {
    console.error("\n❌ TEST FAILED:");
    console.error("Error:", error.message);
    console.error("SQL State:", error.sqlState);
    console.error("SQL Message:", error.sqlMessage);
  } finally {
    if (connection) await connection.end();
  }
}

testAwardCreation();
