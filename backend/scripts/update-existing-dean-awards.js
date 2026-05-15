require("dotenv").config();
const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "database_cs",
};

async function updateExistingDeanAwards() {
  let connection;

  try {
    console.log("============================================================");
    console.log("UPDATE EXISTING DEAN AWARDS WITH DEFAULT LEVEL");
    console.log("============================================================\n");

    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database\n");

    const [records] = await connection.query(
      `SELECT id, award_title FROM dean_awards WHERE level IS NULL OR level = ''`,
    );

    if (records.length === 0) {
      console.log("No records need updating. All awards have a level assigned.");
      return;
    }

    console.log(`Found ${records.length} award(s) without a level. Updating...`);

    await connection.query(`
      UPDATE dean_awards 
      SET level = 'Institutional' 
      WHERE level IS NULL OR level = ''
    `);

    console.log(`Updated ${records.length} award(s) with default level 'Institutional'`);
    console.log("\nUpdate completed successfully!");
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
}

updateExistingDeanAwards()
  .then(() => {
    console.log("\n============================================================");
    console.log("UPDATE COMPLETED");
    console.log("============================================================");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nUpdate failed:", error);
    process.exit(1);
  });
