const db = require("../models");

async function removeEventApprovalColumns() {
  try {
    console.log("Starting removal of event approval columns...");

    // Remove approval_status, approved_by, approval_date, and rejection_reason columns
    await db.sequelize.query(`
      ALTER TABLE organization_events
      DROP COLUMN IF EXISTS approval_status,
      DROP COLUMN IF EXISTS approved_by,
      DROP COLUMN IF EXISTS approval_date,
      DROP COLUMN IF EXISTS rejection_reason
    `);

    console.log("✓ Successfully removed event approval columns");
    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

removeEventApprovalColumns();
