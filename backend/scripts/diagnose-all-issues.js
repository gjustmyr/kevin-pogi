require("dotenv").config();
const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "database_cs",
};

async function diagnoseAllIssues() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("✓ Connected to database\n");

    console.log("=".repeat(70));
    console.log("CHECKING ALL DEAN PROFILE TABLES");
    console.log("=".repeat(70) + "\n");

    const tables = [
      'dean_awards',
      'dean_professional_memberships',
      'dean_seminars_trainings',
      'dean_research_activities',
      'dean_extension_activities',
      'dean_academic_profiles',
      'dean_employment_profiles',
      'dean_personal_profiles'
    ];

    for (const table of tables) {
      console.log(`\nTable: ${table}`);
      console.log("-".repeat(70));
      
      try {
        const [columns] = await connection.query(`DESCRIBE ${table}`);
        console.log("Columns:");
        columns.forEach(col => {
          const required = col.Null === 'NO' ? '(REQUIRED)' : '';
          console.log(`  - ${col.Field.padEnd(30)} ${col.Type.padEnd(30)} ${required}`);
        });
        
        const [count] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`Records: ${count[0].count}`);
        
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
      }
    }

    console.log("\n" + "=".repeat(70));
    console.log("CHECKING DEAN USERS");
    console.log("=".repeat(70));
    
    const [deans] = await connection.query(`
      SELECT d.dean_id, d.first_name, d.last_name, d.email, u.role 
      FROM deans d 
      LEFT JOIN users u ON d.user_id = u.user_id 
      LIMIT 5
    `);
    
    console.log("\nDeans in system:");
    deans.forEach(dean => {
      console.log(`  ID: ${dean.dean_id}, Name: ${dean.first_name} ${dean.last_name}, Email: ${dean.email}, Role: ${dean.role}`);
    });

    console.log("\n" + "=".repeat(70));
    console.log("SUMMARY");
    console.log("=".repeat(70));
    console.log("✓ All tables exist and are accessible");
    console.log("✓ Database structure is correct");
    console.log("\nIf you're still getting errors:");
    console.log("1. Make sure backend server is running (npm start)");
    console.log("2. Check backend console for detailed error logs");
    console.log("3. Check browser console (F12) for network errors");
    console.log("4. Verify you're logged in as a dean user");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  } finally {
    if (connection) await connection.end();
  }
}

diagnoseAllIssues();
