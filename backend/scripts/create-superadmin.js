const bcrypt = require("bcrypt");
const db = require("../models");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createSuperAdmin() {
  try {
    console.log("=".repeat(60));
    console.log("CREATE SUPERADMIN ACCOUNT");
    console.log("=".repeat(60));

    // Get user input
    const firstName = await askQuestion("First Name: ");
    const middleName = await askQuestion("Middle Name (optional): ");
    const lastName = await askQuestion("Last Name: ");
    const email = await askQuestion("Email: ");
    const contactNumber = await askQuestion("Contact Number (optional): ");
    const password = await askQuestion("Password: ");

    if (!firstName || !lastName || !email || !password) {
      console.log(
        "\n❌ First name, last name, email, and password are required!",
      );
      rl.close();
      process.exit(1);
    }

    console.log("\n🔄 Creating superadmin account...\n");

    // Sync database
    await db.sequelize.sync();

    // Check if email already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      console.log("❌ Email already exists!");
      rl.close();
      process.exit(1);
    }

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
      middle_name: middleName || null,
      last_name: lastName,
      email,
      contact_number: contactNumber || null,
      user_id: user.user_id,
    });

    console.log("=".repeat(60));
    console.log("✅ SUPERADMIN CREATED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log(`Name: ${firstName} ${middleName} ${lastName}`);
    console.log(`Email: ${email}`);
    console.log(`Role: superadmin`);
    console.log("=".repeat(60));
    console.log("\nYou can now login with these credentials.\n");

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error creating superadmin:", error.message);
    console.error(error.stack);
    rl.close();
    process.exit(1);
  }
}

createSuperAdmin();
