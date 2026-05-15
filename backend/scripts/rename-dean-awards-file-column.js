require("dotenv").config();
const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "database_cs",
};

async function renameFileColumn() {
  let connection;
  try {
    console.log("============================================================");
    console.log("RENAME file_path TO certificate_file IN dean_awards");
    console.log("============================================================\n");

    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database\n");

    // Check current columns
    const [columns] = await connection.query("SHOW COLUMNS FROM dean_awards");
    const columnNames = columns.map(col => col.Field);
    
    console.log("Current columns:", columnNames.join(", "));
    console.log("");

    if (columnNames.includes("file_path") && !columnNames.includes("certificate_file")) {
      console.log("Renaming file_path to certificate_file...");
      await connection.query(`
        ALTER TABLE dean_awards
        CHANGE COLUMN file_path certificate_file VARCHAR(500)
      `);
      console.log("✓ Renamed file_path to certificate_file");
    } else if (columnNames.includes("certificate_file")) {
      console.log("✓ Column certificate_file already exists. No changes needed.");
    } else {
      console.log("⚠ Neither file_path nor certificate_file found!");
    }

    console.log("\n✓ Migration completed successfully!\n");
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

renameFileColumn()
  .then(() => {
    console.log("\n============================================================");
    console.log("MIGRATION COMPLETED");
    console.log("============================================================");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });
