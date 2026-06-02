require("dotenv").config();
const mysql = require("mysql2/promise");

async function setupDatabase() {
  const dbName = process.env.DB_NAME || "database_cs";
  
  console.log("=".repeat(60));
  console.log("DATABASE SETUP");
  console.log("=".repeat(60));
  console.log(`Database: ${dbName}`);
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`User: ${process.env.DB_USER}`);
  console.log("=".repeat(60));
  console.log();

  try {
    // Connect to MySQL without specifying a database
    console.log("🔄 Connecting to MySQL...");
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
    });

    console.log("✅ Connected to MySQL");

    // Check if database exists
    console.log(`\n🔍 Checking if database '${dbName}' exists...`);
    const [databases] = await connection.query("SHOW DATABASES");
    const dbExists = databases.some((db) => db.Database === dbName);

    if (dbExists) {
      console.log(`✅ Database '${dbName}' already exists`);
    } else {
      console.log(`⚠️  Database '${dbName}' does not exist`);
      console.log(`🔄 Creating database '${dbName}'...`);
      
      await connection.query(`CREATE DATABASE \`${dbName}\``);
      console.log(`✅ Database '${dbName}' created successfully`);
    }

    await connection.end();

    console.log("\n" + "=".repeat(60));
    console.log("✅ DATABASE SETUP COMPLETED");
    console.log("=".repeat(60));
    console.log("\n📝 Next steps:");
    console.log("   1. Initialize tables: npm run init-db");
    console.log("   2. Create superadmin: npm run create-superadmin-quick");
    console.log("   3. Start server: npm start");
    console.log();

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error setting up database:", error.message);
    console.error("\n💡 Troubleshooting:");
    console.error("   1. Make sure MySQL is running");
    console.error("   2. Check your .env file configuration");
    console.error("   3. Verify MySQL credentials are correct");
    console.error("   4. Make sure MySQL user has CREATE DATABASE permission");
    console.error("\nFull error:");
    console.error(error);
    process.exit(1);
  }
}

setupDatabase();
