require("dotenv").config();
const db = require("./models");

async function addApprovalFields() {
	try {
		await db.sequelize.sync();

		// Add approval fields to organization_events table
		await db.sequelize.query(`
			ALTER TABLE organization_events
			ADD COLUMN IF NOT EXISTS approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' AFTER status,
			ADD COLUMN IF NOT EXISTS approved_by INT NULL AFTER approval_status,
			ADD COLUMN IF NOT EXISTS approval_date DATETIME NULL AFTER approved_by,
			ADD COLUMN IF NOT EXISTS rejection_reason TEXT NULL AFTER approval_date;
		`);

		console.log("✓ Added approval fields to organization_events table");

		// Add foreign key constraint
		try {
			await db.sequelize.query(`
				ALTER TABLE organization_events
				ADD CONSTRAINT fk_event_approved_by 
				FOREIGN KEY (approved_by) REFERENCES deans(dean_id) ON DELETE SET NULL;
			`);
			console.log("✓ Added foreign key constraint");
		} catch (error) {
			if (error.message.includes("Duplicate key")) {
				console.log("- Foreign key constraint already exists");
			} else {
				throw error;
			}
		}

		// Add index
		try {
			await db.sequelize.query(`
				CREATE INDEX idx_approval_status ON organization_events(approval_status);
			`);
			console.log("✓ Added index on approval_status");
		} catch (error) {
			if (error.message.includes("Duplicate key")) {
				console.log("- Index already exists");
			} else {
				throw error;
			}
		}

		console.log("\n✓ Event approval system added successfully!");
		process.exit(0);
	} catch (error) {
		console.error("Error adding approval fields:", error);
		process.exit(1);
	}
}

addApprovalFields();
