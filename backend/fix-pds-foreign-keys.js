require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: console.log,
  },
);

async function fixForeignKeys() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database...");

    // Drop existing foreign keys if they exist
    console.log("Dropping existing foreign keys...");
    try {
      await sequelize.query(`
				ALTER TABLE personal_data_sheets 
				DROP FOREIGN KEY IF EXISTS personal_data_sheets_ibfk_1;
			`);
    } catch (e) {
      console.log("No existing faculty foreign key to drop");
    }

    try {
      await sequelize.query(`
				ALTER TABLE personal_data_sheets 
				DROP FOREIGN KEY IF EXISTS personal_data_sheets_ibfk_2;
			`);
    } catch (e) {
      console.log("No existing dean foreign key to drop");
    }

    // Add foreign keys with proper constraints
    console.log("Adding faculty foreign key...");
    await sequelize.query(`
			ALTER TABLE personal_data_sheets 
			ADD CONSTRAINT fk_pds_faculty 
			FOREIGN KEY (faculty_id) 
			REFERENCES faculties(faculty_id) 
			ON DELETE CASCADE 
			ON UPDATE CASCADE;
		`);
    console.log("✓ Faculty foreign key added");

    console.log("Adding dean foreign key...");
    await sequelize.query(`
			ALTER TABLE personal_data_sheets 
			ADD CONSTRAINT fk_pds_dean 
			FOREIGN KEY (dean_id) 
			REFERENCES deans(dean_id) 
			ON DELETE CASCADE 
			ON UPDATE CASCADE;
		`);
    console.log("✓ Dean foreign key added");

    await sequelize.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

fixForeignKeys();
