const db = require("./models");

async function testPDSImport() {
  try {
    // Get dean
    const dean = await db.Dean.findOne({ where: { dean_id: 2 } });

    if (!dean) {
      console.log("Dean not found");
      return;
    }

    console.log(
      `Testing import for Dean ${dean.dean_id}: ${dean.first_name} ${dean.last_name}`,
    );

    // Get employment profiles
    const employmentProfiles = await db.DeanEmploymentProfile.findAll({
      where: { dean_id: dean.dean_id },
      order: [["date_from", "DESC"]],
    });

    console.log(`\nFound ${employmentProfiles.length} employment records:`);
    employmentProfiles.forEach((emp, index) => {
      console.log(`\n${index + 1}. Position: ${emp.position_title}`);
      console.log(`   Company: ${emp.company_name}`);
      console.log(`   From: ${emp.date_from}`);
      console.log(`   To: ${emp.date_to || "Present"}`);
      console.log(`   Status: ${emp.employment_status}`);
    });

    // Check if PDS exists
    const pds = await db.PersonalDataSheet.findOne({
      where: { dean_id: dean.dean_id },
    });

    if (pds) {
      console.log(`\nPDS exists (ID: ${pds.pds_id})`);

      // Check work experiences
      const workExperiences = await db.PDSWorkExperience.findAll({
        where: { pds_id: pds.pds_id },
      });

      console.log(
        `\nPDS has ${workExperiences.length} work experience records:`,
      );
      workExperiences.forEach((work, index) => {
        console.log(`\n${index + 1}. Position: ${work.position_title}`);
        console.log(`   Agency: ${work.department_agency}`);
        console.log(`   From: ${work.date_from}`);
        console.log(`   To: ${work.date_to || "Present"}`);
      });
    } else {
      console.log("\nNo PDS found for this dean");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit();
  }
}

testPDSImport();
