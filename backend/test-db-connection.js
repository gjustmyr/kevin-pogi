require("dotenv").config();
const db = require("./models");

async function testConnection() {
  try {
    console.log("🔄 Testing database connection...");
    console.log(`📊 Database: ${process.env.DB_NAME}`);
    console.log(`🖥️  Host: ${process.env.DB_HOST}`);
    console.log(`👤 User: ${process.env.DB_USER}`);
    console.log();

    await db.sequelize.authenticate();
    console.log("✅ Database connection successful!");
    
    // Check if database exists and has tables
    const [results] = await db.sequelize.query("SHOW TABLES");
    
    if (results.length === 0) {
      console.log("\n⚠️  Database is empty. No tables found.");
      console.log("💡 Run: node init-database.js to create tables");
    } else {
      console.log(`\n✅ Found ${results.length} tables in database`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed!");
    console.error("Error:", error.message);
    console.log("\n💡 Troubleshooting:");
    console.log("   1. Check if MySQL is running");
    console.log("   2. Verify .env configuration");
    console.log("   3. Make sure database exists:");
    console.log(`      mysql -u root -p`);
    console.log(`      CREATE DATABASE ${process.env.DB_NAME};`);
    process.exit(1);
  }
}

testConnection();
