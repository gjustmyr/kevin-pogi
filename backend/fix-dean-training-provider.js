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

async function fixTable() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database...");

    // Check if column exists
    const [results] = await sequelize.query(`
			SELECT COLUMN_NAME 
			FROM INFORMATION_SCHEMA.COLUMNS 
			WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' 
			AND TABLE_NAME = 'dean_seminars_trainings' 
			AND COLUMN_NAME = 'training_provider';
		`);

    if (results.length === 0) {
      console.log("Column 'training_provider' does not exist. Adding it...");
      await sequelize.query(`
				ALTER TABLE dean_seminars_trainings 
				ADD COLUMN training_provider VARCHAR(300) NULL AFTER sponsoring_agency;
			`);
      console.log("✓ Column added successfully!");
    } else {
      console.log("✓ Column 'training_provider' already exists.");
    }

    await sequelize.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

fixTable();
