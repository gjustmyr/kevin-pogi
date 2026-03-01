const db = require("./models");
const bcrypt = require("bcrypt");

const User = db.User;
const Admin = db.Admin;
const Dean = db.Dean;
const Faculty = db.Faculty;
const Organization = db.Organization;
const Department = db.Department;

async function seedDatabase() {
	try {
		console.log("Starting database seeding...");

		// Create departments first
		const csDepartment = await Department.create({
			department_name: "Computer Science",
			description: "Department of Computer Science",
		});

		const itDepartment = await Department.create({
			department_name: "Information Technology",
			description: "Department of Information Technology",
		});

		console.log("Departments created");

		// Hash password (same for all test accounts: "password123")
		const hashedPassword = await bcrypt.hash("password123", 10);

		// Create Superadmin user
		const superadminUser = await User.create({
			email: "superadmin@test.com",
			password: hashedPassword,
			role: "superadmin",
		});
		console.log("Superadmin created: superadmin@test.com / password123");

		// Create Admin user and profile
		const adminUser = await User.create({
			email: "admin@test.com",
			password: hashedPassword,
			role: "admin",
		});

		await Admin.create({
			first_name: "John",
			middle_name: "A",
			last_name: "Admin",
			email: "admin@test.com",
			contact_number: "09123456789",
			user_id: adminUser.user_id,
		});
		console.log("Admin created: admin@test.com / password123");

		// Create Dean user and profile
		const deanUser = await User.create({
			email: "dean@test.com",
			password: hashedPassword,
			role: "dean",
		});

		await Dean.create({
			first_name: "Jane",
			middle_name: "B",
			last_name: "Dean",
			email: "dean@test.com",
			contact_number: "09123456788",
			department_id: csDepartment.department_id,
			user_id: deanUser.user_id,
		});
		console.log("Dean created: dean@test.com / password123");

		// Create Faculty user and profile
		const facultyUser = await User.create({
			email: "faculty@test.com",
			password: hashedPassword,
			role: "faculty",
		});

		const faculty = await Faculty.create({
			first_name: "Bob",
			middle_name: "C",
			last_name: "Faculty",
			email: "faculty@test.com",
			contact_number: "09123456787",
			department_id: csDepartment.department_id,
			user_id: facultyUser.user_id,
		});
		console.log("Faculty created: faculty@test.com / password123");

		// Create Organization user and profile
		const orgUser = await User.create({
			email: "org@test.com",
			password: hashedPassword,
			role: "organization",
		});

		await Organization.create({
			organization_name: "Computer Society",
			description: "CS Department Student Organization",
			department_id: csDepartment.department_id,
			faculty_id: faculty.faculty_id,
			user_id: orgUser.user_id,
		});
		console.log("Organization created: org@test.com / password123");

		console.log("\n=== Database seeding completed! ===");
		console.log("\nTest accounts:");
		console.log("1. Superadmin: superadmin@test.com / password123");
		console.log("2. Admin: admin@test.com / password123");
		console.log("3. Dean: dean@test.com / password123");
		console.log("4. Faculty: faculty@test.com / password123");
		console.log("5. Organization: org@test.com / password123");

		process.exit(0);
	} catch (error) {
		console.error("Seeding error:", error);
		process.exit(1);
	}
}

// Sync database and seed
db.sequelize
	.sync({ alter: true })
	.then(() => {
		console.log("Database synced!");
		return seedDatabase();
	})
	.catch((err) => {
		console.error("Database sync error:", err);
		process.exit(1);
	});
