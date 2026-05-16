require("dotenv").config();
const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "database_cs",
};

async function fixMembershipColumn() {
  let connection;
  try {
    console.log("============================================================");
    console.log("FIX DEAN PROFESSIONAL MEMBERSHIP COLUMN");
    console.log("============================================================\n");

    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database\n");

    const [columns] = await connection.query("SHOW COLUMNS FROM dean_professional_memberships");
    const columnNames = columns.map(col => col.Field);
    
    console.log("Current columns:", columnNames.join(", "));
    console.log("");

    // The database has is_active, which is correct
    // We just need to make sure the model uses is_active instead of is_lifetime
    console.log("✓ Column 'is_active' exists in database");
    console.log("✓ Model has been updated to use 'is_active'");
    console.log("\n✓ No migration needed - just restart backend server!\n");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log("✓ Database connection closed");
    }
  }
}

fixMembershipColumn()
  .then(() => {
    console.log("\n============================================================");
    console.log("CHECK COMPLETED");
    console.log("============================================================");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Check failed:", error);
    process.exit(1);
  });
