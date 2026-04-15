const bcrypt = require("bcrypt");
const path = require("path");

// Load environment variables from backend/.env
require("dotenv").config({ path: path.join(__dirname, ".env") });

const db = require("./models");

async function createSuperadmin() {
  try {
    // Get email and password from command line arguments
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
      console.log("\n===========================================");
      console.log("   Create Superadmin Account (Quick)");
      console.log("===========================================\n");
      console.log(
        "Usage: node create-superadmin-quick.js <email> <password>\n",
      );
      console.log("Example:");
      console.log(
        "  node create-superadmin-quick.js admin@example.com MySecurePass123\n",
      );
      process.exit(1);
    }

    // Validate email
    if (!email.includes("@")) {
      console.error("✗ Invalid email address");
      process.exit(1);
    }

    // Validate password
    if (password.length < 8) {
      console.error("✗ Password must be at least 8 characters");
      process.exit(1);
    }

    console.log("\n===========================================");
    console.log("   Create Superadmin Account");
    console.log("===========================================\n");

    // Test database connection
    await db.sequelize.authenticate();
    console.log("✓ Database connection established");

    // Check if email already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      console.error("✗ Email already exists in the system");
      process.exit(1);
    }

    console.log("✓ Email is available");
    console.log("✓ Creating superadmin account...");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with superadmin role
    const user = await db.User.create({
      email,
      password: hashedPassword,
      role: "superadmin",
    });

    console.log("\n✓ Superadmin account created successfully!");
    console.log("\n===========================================");
    console.log("   Login Credentials");
    console.log("===========================================");
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     superadmin`);
    console.log(`User ID:  ${user.user_id}`);
    console.log("===========================================\n");

    console.log("You can now login with these credentials.\n");
  } catch (error) {
    console.error("\n✗ Error creating superadmin:", error.message);
    if (error.name === "SequelizeConnectionError") {
      console.error(
        "\nPlease check your database connection settings in .env file",
      );
    }
    process.exit(1);
  } finally {
    await db.sequelize.close();
  }
}

// Run the script
createSuperadmin();
