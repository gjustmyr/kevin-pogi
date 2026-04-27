const db = require("./models");

async function testEmploymentImport() {
  try {
    // Test for faculty
    console.log("Testing Faculty Employment Import...");
    const faculty = await db.Faculty.findOne();

    if (faculty) {
      console.log(`Found faculty: ${faculty.faculty_id}`);

      const employmentProfiles = await db.FacultyEmploymentProfile.findAll({
        where: { faculty_id: faculty.faculty_id },
        order: [["date_from", "DESC"]],
      });

      console.log(`Found ${employmentProfiles.length} employment records`);
      employmentProfiles.forEach((emp, index) => {
        console.log(`\nEmployment ${index + 1}:`);
        console.log(`  Position: ${emp.position_title}`);
        console.log(`  Company: ${emp.company_name}`);
        console.log(`  From: ${emp.date_from}`);
        console.log(`  To: ${emp.date_to || "Present"}`);
        console.log(`  Status: ${emp.employment_status}`);
      });
    } else {
      console.log("No faculty found");
    }

    // Test for dean
    console.log("\n\nTesting Dean Employment Import...");
    const dean = await db.Dean.findOne();

    if (dean) {
      console.log(`Found dean: ${dean.dean_id}`);

      const employmentProfiles = await db.DeanEmploymentProfile.findAll({
        where: { dean_id: dean.dean_id },
        order: [["date_from", "DESC"]],
      });

      console.log(`Found ${employmentProfiles.length} employment records`);
      employmentProfiles.forEach((emp, index) => {
        console.log(`\nEmployment ${index + 1}:`);
        console.log(`  Position: ${emp.position_title}`);
        console.log(`  Company: ${emp.company_name}`);
        console.log(`  From: ${emp.date_from}`);
        console.log(`  To: ${emp.date_to || "Present"}`);
        console.log(`  Status: ${emp.employment_status}`);
      });
    } else {
      console.log("No dean found");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit();
  }
}

testEmploymentImport();
