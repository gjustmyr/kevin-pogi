const db = require("../models");

async function addMemberPhotoColumn() {
  try {
    console.log("Adding photo_url column to organization_members table...");

    await db.sequelize.query(`
      ALTER TABLE organization_members 
      ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500) NULL 
      COMMENT 'Path to member photo'
    `);

    console.log("✓ Successfully added photo_url column");
    process.exit(0);
  } catch (error) {
    console.error("Error adding photo_url column:", error);
    process.exit(1);
  }
}

addMemberPhotoColumn();
