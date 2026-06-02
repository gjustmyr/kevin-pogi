require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("./models");

async function createSuperAdmin() {
  try {
    console.log("=".repeat(60));
    console.log("QUICK SUPERADMIN CREATION");
    console.log("=".repeat(60));

    // Default credentials (you can change these)
    const email = "admin@example.com";
    const password = "Admin123!";
    const firstName = "Super";
    const lastName = "Admin";

    console.log("\n🔄 Connecting to database...");
    
    // Sync database
    await db.sequelize.sync();
    console.log("✅ Database connected");

    // Check if email already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      console.log("\n⚠️  A user with this email already exists!");
      console.log("Email:", email);
      console.log("\nOptions:");
      console.log("1. Use the existing credentials to login");
      console.log("2. Delete the user from database and run this script again");
      console.log("3. Use a different email by editing this script");
      process.exit(1);
    }

    console.log("\n🔄 Creating superadmin account...");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with superadmin role
    const user = await db.User.create({
      email,
      password: hashedPassword,
      role: "superadmin",
    });

    // Create admin profile
    await db.Admin.create({
      first_name: firstName,
      middle_name: null,
      last_name: lastName,
      email,
      contact_number: null,
      user_id: user.user_id,
    });

    console.log("\n" + "=".repeat(60));
    console.log("✅ SUPERADMIN CREATED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("\n📧 Email:", email);
    console.log("🔑 Password:", password);
    console.log("👤 Role: superadmin");
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");
    console.log("=".repeat(60));
    console.log("\n✅ You can now login at: http://localhost:3000");
    console.log();

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error creating superadmin:", error.message);
    console.error("\n💡 Troubleshooting:");
    console.error("   1. Make sure MySQL is running");
    console.error("   2. Check your .env file configuration");
    console.error("   3. Run: npm run init-db (to initialize database)");
    console.error("   4. Check if database exists");
    console.error("\nFull error:");
    console.error(error);
    process.exit(1);
  }
}

console.log("\n🚀 Starting superadmin creation...\n");
createSuperAdmin();
