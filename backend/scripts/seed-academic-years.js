const db = require("../models");

async function seedAcademicYears() {
  try {
    console.log("=".repeat(60));
    console.log("SEED ACADEMIC YEARS");
    console.log("=".repeat(60));

    await db.sequelize.sync();

    const academicYears = [
      { year_start: 2023, year_end: 2024, is_active: 1 },
      { year_start: 2024, year_end: 2025, is_active: 1 },
      { year_start: 2025, year_end: 2026, is_active: 1 },
    ];

    console.log("\n🔄 Inserting academic years...\n");

    for (const year of academicYears) {
      const existing = await db.AcademicYear.findOne({
        where: {
          year_start: year.year_start,
          year_end: year.year_end,
        },
      });

      if (existing) {
        await existing.update({ is_active: year.is_active });
        console.log(
          `✓ Updated: ${year.year_start}-${year.year_end} (Active: ${year.is_active})`,
        );
      } else {
        await db.AcademicYear.create(year);
        console.log(
          `✓ Created: ${year.year_start}-${year.year_end} (Active: ${year.is_active})`,
        );
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ ACADEMIC YEARS SEEDED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("\nAll academic years are now active.\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding academic years:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

seedAcademicYears();
