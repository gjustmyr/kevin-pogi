const bcrypt = require("bcrypt");
const readline = require("readline");
const path = require("path");

// Load environment variables from backend/.env
require("dotenv").config({ path: path.join(__dirname, ".env") });

const db = require("./models");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createSuperadmin() {
  try {
    console.log("\n===========================================");
    console.log("   Create Superadmin Account");
    console.log("===========================================\n");

    // Test database connection
    await db.sequelize.authenticate();
    console.log("✓ Database connection established\n");

    // Get email
    const email = await question("Enter superadmin email: ");
    if (!email || !email.includes("@")) {
      console.error("✗ Invalid email address");
      process.exit(1);
    }

    // Check if email already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      console.error("✗ Email already exists in the system");
      process.exit(1);
    }

    // Get password
    const password = await question("Enter password (min 8 characters): ");
    if (!password || password.length < 8) {
      console.error("✗ Password must be at least 8 characters");
      process.exit(1);
    }

    // Confirm password
    const confirmPassword = await question("Confirm password: ");
    if (password !== confirmPassword) {
      console.error("✗ Passwords do not match");
      process.exit(1);
    }

    console.log("\nCreating superadmin account...");

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
    rl.close();
    await db.sequelize.close();
  }
}

// Run the script
createSuperadmin();
