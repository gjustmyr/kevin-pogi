require("dotenv").config();
const db = require("./models");

async function initializeDatabase() {
  try {
    console.log("🔄 Connecting to database...");
    
    // Test connection
    await db.sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    console.log("\n🔄 Creating/Updating database tables...");
    
    // Sync all models with database
    // alter: true will update existing tables without dropping them
    // force: true would drop and recreate all tables (use with caution!)
    await db.sequelize.sync({ alter: true });
    
    console.log("✅ All tables have been created/updated successfully!");
    
    // Display all created tables
    const [results] = await db.sequelize.query("SHOW TABLES");
    console.log("\n📋 Database Tables:");
    results.forEach((row, index) => {
      const tableName = Object.values(row)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });

    console.log("\n✅ Database initialization completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("   1. Create a superadmin account: npm run create-superadmin");
    console.log("   2. Start the server: npm start");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    console.error("\n💡 Troubleshooting:");
    console.error("   1. Make sure MySQL is running");
    console.error("   2. Check your .env file configuration");
    console.error("   3. Verify database exists: CREATE DATABASE database_cs;");
    console.error("   4. Check MySQL credentials");
    process.exit(1);
  }
}

// Run initialization
console.log("=".repeat(60));
console.log("🚀 DATABASE INITIALIZATION SCRIPT");
console.log("=".repeat(60));
console.log(`📊 Database: ${process.env.DB_NAME}`);
console.log(`🖥️  Host: ${process.env.DB_HOST}`);
console.log(`👤 User: ${process.env.DB_USER}`);
console.log("=".repeat(60));
console.log();

initializeDatabase();
