require("dotenv").config();
const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "database_cs",
};

async function fixDeanPersonalProfileColumns() {
  let connection;

  try {
    console.log("============================================================");
    console.log("FIX DEAN PERSONAL PROFILE COLUMN NAMES");
    console.log("============================================================\n");

    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database\n");

    // Check current columns
    const [columns] = await connection.query(
      `SHOW COLUMNS FROM dean_personal_profiles`,
    );
    
    const columnNames = columns.map(col => col.Field);
    console.log("Current columns:", columnNames.join(", "));
    console.log("");

    // Rename extension_name to extension
    if (columnNames.includes("extension_name") && !columnNames.includes("extension")) {
      console.log("Renaming extension_name to extension...");
      await connection.query(`
        ALTER TABLE dean_personal_profiles
        CHANGE COLUMN extension_name extension VARCHAR(20)
      `);
      console.log("✓ Renamed extension_name to extension");
    }

    // Rename mobile_number_primary to mobile_primary
    if (columnNames.includes("mobile_number_primary") && !columnNames.includes("mobile_primary")) {
      console.log("Renaming mobile_number_primary to mobile_primary...");
      await connection.query(`
        ALTER TABLE dean_personal_profiles
        CHANGE COLUMN mobile_number_primary mobile_primary VARCHAR(20) NOT NULL
      `);
      console.log("✓ Renamed mobile_number_primary to mobile_primary");
    }

    // Rename mobile_number_secondary to mobile_secondary
    if (columnNames.includes("mobile_number_secondary") && !columnNames.includes("mobile_secondary")) {
      console.log("Renaming mobile_number_secondary to mobile_secondary...");
      await connection.query(`
        ALTER TABLE dean_personal_profiles
        CHANGE COLUMN mobile_number_secondary mobile_secondary VARCHAR(20)
      `);
      console.log("✓ Renamed mobile_number_secondary to mobile_secondary");
    }

    // Rename home_country to country
    if (columnNames.includes("home_country") && !columnNames.includes("country")) {
      console.log("Renaming home_country to country...");
      await connection.query(`
        ALTER TABLE dean_personal_profiles
        CHANGE COLUMN home_country country VARCHAR(100)
      `);
      console.log("✓ Renamed home_country to country");
    }

    // Rename home_region to region
    if (columnNames.includes("home_region") && !columnNames.includes("region")) {
      console.log("Renaming home_region to region...");
      await connection.query(`
        ALTER TABLE dean_personal_profiles
        CHANGE COLUMN home_region region VARCHAR(100)
      `);
      console.log("✓ Renamed home_region to region");
    }

    // Rename home_province to province
    if (columnNames.includes("home_province") && !columnNames.includes("province")) {
      console.log("Renaming home_province to province...");
      await connection.query(`
        ALTER TABLE dean_personal_profiles
        CHANGE COLUMN home_province province VARCHAR(100)
      `);
      console.log("✓ Renamed home_province to province");
    }

    // Rename home_barangay to barangay
    if (columnNames.includes("home_barangay") && !columnNames.includes("barangay")) {
      console.log("Renaming home_barangay to barangay...");
      await connection.query(`
        ALTER TABLE dean_personal_profiles
        CHANGE COLUMN home_barangay barangay VARCHAR(200)
      `);
      console.log("✓ Renamed home_barangay to barangay");
    }

    // Rename home_street_subdivision to street_subdivision
    if (columnNames.includes("home_street_subdivision") && !columnNames.includes("street_subdivision")) {
      console.log("Renaming home_street_subdivision to street_subdivision...");
      await connection.query(`
        ALTER TABLE dean_personal_profiles
        CHANGE COLUMN home_street_subdivision street_subdivision VARCHAR(300)
      `);
      console.log("✓ Renamed home_street_subdivision to street_subdivision");
    }

    // Rename home_zip_code to zip_code
    if (columnNames.includes("home_zip_code") && !columnNames.includes("zip_code")) {
      console.log("Renaming home_zip_code to zip_code...");
      await connection.query(`
        ALTER TABLE dean_personal_profiles
        CHANGE COLUMN home_zip_code zip_code VARCHAR(20)
      `);
      console.log("✓ Renamed home_zip_code to zip_code");
    }

    console.log("\n✓ Migration completed successfully!");
    console.log("\nThe dean_personal_profiles table now matches the frontend field names.\n");
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

fixDeanPersonalProfileColumns()
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
