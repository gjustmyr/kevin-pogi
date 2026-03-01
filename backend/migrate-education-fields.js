const db = require("./models");
const sequelize = db.sequelize;

async function migrateEducationFields() {
  try {
    console.log("Starting migration for education fields...");

    // Add the new columns
    await sequelize.query(`
      ALTER TABLE faculty_credentials 
      ADD COLUMN education_obtained_where VARCHAR(255) NULL AFTER education,
      ADD COLUMN education_obtained_when VARCHAR(255) NULL AFTER education_obtained_where
    `);

    console.log("✓ Added new columns: education_obtained_where, education_obtained_when");

    // Update existing records if any - split the old education_obtained field if it exists
    // (This assumes the old field doesn't exist anymore, so we just set defaults)
    await sequelize.query(`
      UPDATE faculty_credentials 
      SET education_obtained_where = 'Not specified',
          education_obtained_when = 'Not specified'
      WHERE education_obtained_where IS NULL OR education_obtained_when IS NULL
    `);

    console.log("✓ Updated existing records with default values");

    // Make the columns NOT NULL now that they have values
    await sequelize.query(`
      ALTER TABLE faculty_credentials 
      MODIFY COLUMN education_obtained_where VARCHAR(255) NOT NULL,
      MODIFY COLUMN education_obtained_when VARCHAR(255) NOT NULL
    `);

    console.log("✓ Set columns to NOT NULL");
    console.log("Migration completed successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateEducationFields();
