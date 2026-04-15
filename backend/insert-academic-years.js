const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const db = require("./models");

async function insertAcademicYears() {
  try {
    console.log("\n===========================================");
    console.log("   Insert Academic Years");
    console.log("===========================================\n");

    // Test database connection
    await db.sequelize.authenticate();
    console.log("✓ Database connection established\n");

    // Define academic years to insert
    const academicYears = [
      { year_start: 2020, year_end: 2021, is_active: false },
      { year_start: 2021, year_end: 2022, is_active: false },
      { year_start: 2022, year_end: 2023, is_active: false },
      { year_start: 2023, year_end: 2024, is_active: false },
      { year_start: 2024, year_end: 2025, is_active: false },
      { year_start: 2025, year_end: 2026, is_active: true },
      { year_start: 2026, year_end: 2027, is_active: false },
      { year_start: 2027, year_end: 2028, is_active: false },
    ];

    console.log("📅 Inserting academic years...\n");

    let insertedCount = 0;
    let skippedCount = 0;

    for (const ay of academicYears) {
      // Check if academic year already exists
      const existing = await db.AcademicYear.findOne({
        where: {
          year_start: ay.year_start,
          year_end: ay.year_end,
        },
      });

      if (existing) {
        console.log(
          `   ⊘ Skipped: ${ay.year_start}-${ay.year_end} (already exists)`,
        );
        skippedCount++;
      } else {
        await db.AcademicYear.create(ay);
        const status = ay.is_active ? "(ACTIVE)" : "";
        console.log(`   ✓ Inserted: ${ay.year_start}-${ay.year_end} ${status}`);
        insertedCount++;
      }
    }

    console.log("\n===========================================");
    console.log("   Summary");
    console.log("===========================================");
    console.log(`✓ Inserted: ${insertedCount} academic years`);
    console.log(`⊘ Skipped:  ${skippedCount} academic years (already exist)`);
    console.log("===========================================\n");

    if (insertedCount > 0) {
      console.log("Academic years have been successfully inserted!\n");
    } else {
      console.log("All academic years already exist in the database.\n");
    }
  } catch (error) {
    console.error("\n✗ Error inserting academic years:", error.message);
    if (error.name === "SequelizeConnectionError") {
      console.error(
        "\nPlease check your database connection settings in .env file",
      );
    }
    process.exit(1);
  } finally {
    await db.sequelize.close();
  }
}

// Run the script
insertAcademicYears();
