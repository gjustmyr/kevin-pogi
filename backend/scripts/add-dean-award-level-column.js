require("dotenv").config();
const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "database_cs",
};

async function addDeanAwardLevelColumn() {
  let connection;

  try {
    console.log("============================================================");
    console.log("ADD LEVEL COLUMN TO dean_awards TABLE");
    console.log(
      "============================================================\n",
    );

    connection = await mysql.createConnection(dbConfig);
    console.log("✓ Connected to database\n");

    // Check if column already exists
    const [columns] = await connection.query(
      `SHOW COLUMNS FROM dean_awards LIKE 'level'`,
    );

    if (columns.length > 0) {
      console.log("✓ Level column already exists. No migration needed.");
      return;
    }

    console.log("Adding level column...");

    // Add level column
    await connection.query(`
      ALTER TABLE dean_awards
      ADD COLUMN level ENUM('International', 'National', 'Regional', 'Local', 'Institutional') NOT NULL
      COMMENT 'Level/scope of the award' 
      AFTER date_received
    `);
    console.log("✓ Added level column");

    // Update field lengths to match faculty_awards
    console.log("\nUpdating field lengths...");
    
    await connection.query(`
      ALTER TABLE dean_awards
      MODIFY COLUMN award_title VARCHAR(300) NOT NULL,
      MODIFY COLUMN awarding_body VARCHAR(300) NOT NULL
    `);
    console.log("✓ Updated award_title and awarding_body to VARCHAR(300)");

    // Make date_received required
    await connection.query(`
      ALTER TABLE dean_awards
      MODIFY COLUMN date_received DATE NOT NULL
    `);
    console.log("✓ Made date_received required (NOT NULL)");

    console.log("\n✓ Migration completed successfully!");
    console.log(
      "\nNote: The dean_awards table now matches the structure of faculty_awards.",
    );
    console.log(
      "All awards must now include a level (International, National, Regional, Local, or Institutional).\n",
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log("✓ Database connection closed");
    }
  }
}

// Run the migration
addDeanAwardLevelColumn()
  .then(() => {
    console.log(
      "\n============================================================",
    );
    console.log("MIGRATION COMPLETED");
    console.log("============================================================");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
