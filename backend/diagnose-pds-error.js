/**
 * PDS Error Diagnostic Script
 * 
 * This script helps diagnose PDS save errors by checking:
 * 1. Database connection
 * 2. Model definitions
 * 3. Required fields
 * 4. Sample data insertion
 */

const db = require("./models");

console.log("=".repeat(60));
console.log("PDS ERROR DIAGNOSTIC");
console.log("=".repeat(60));
console.log();

async function diagnose() {
  try {
    // Test 1: Database Connection
    console.log("✓ Test 1: Database Connection");
    await db.sequelize.authenticate();
    console.log("  - Status: ✅ CONNECTED");
    console.log();

    // Test 2: Check PersonalDataSheet Model
    console.log("✓ Test 2: PersonalDataSheet Model");
    if (db.PersonalDataSheet) {
      console.log("  - Status: ✅ MODEL EXISTS");
      
      // Get model attributes
      const attributes = db.PersonalDataSheet.rawAttributes;
      const requiredFields = [];
      const optionalFields = [];
      
      for (const [field, config] of Object.entries(attributes)) {
        if (config.allowNull === false) {
          requiredFields.push(field);
        } else {
          optionalFields.push(field);
        }
      }
      
      console.log(`  - Total Fields: ${Object.keys(attributes).length}`);
      console.log(`  - Required Fields: ${requiredFields.length}`);
      console.log(`  - Optional Fields: ${optionalFields.length}`);
      console.log();
      
      console.log("  Required Fields:");
      requiredFields.forEach(field => {
        console.log(`    - ${field}`);
      });
      console.log();
    } else {
      console.log("  - Status: ❌ MODEL NOT FOUND");
      return;
    }

    // Test 3: Check Related Models
    console.log("✓ Test 3: Related Models");
    const relatedModels = [
      "PDSChild",
      "PDSEducation",
      "PDSEligibility",
      "PDSWorkExperience",
      "PDSVoluntaryWork",
      "PDSTraining",
      "PDSOtherInfo",
      "PDSReference",
    ];
    
    relatedModels.forEach(modelName => {
      if (db[modelName]) {
        console.log(`  - ${modelName}: ✅ EXISTS`);
      } else {
        console.log(`  - ${modelName}: ❌ NOT FOUND`);
      }
    });
    console.log();

    // Test 4: Try to create a minimal PDS record
    console.log("✓ Test 4: Minimal PDS Creation Test");
    
    // First, check if there's a faculty to test with
    const faculty = await db.Faculty.findOne();
    
    if (!faculty) {
      console.log("  - Status: ⚠️  NO FACULTY FOUND");
      console.log("  - Note: Cannot test PDS creation without a faculty record");
      console.log();
    } else {
      console.log(`  - Test Faculty ID: ${faculty.faculty_id}`);
      
      // Check if PDS already exists
      const existingPDS = await db.PersonalDataSheet.findOne({
        where: { faculty_id: faculty.faculty_id }
      });
      
      if (existingPDS) {
        console.log("  - Status: ✅ PDS ALREADY EXISTS");
        console.log(`  - PDS ID: ${existingPDS.pds_id}`);
        console.log(`  - Name: ${existingPDS.surname}, ${existingPDS.first_name}`);
      } else {
        console.log("  - Status: ℹ️  NO PDS EXISTS FOR THIS FACULTY");
        console.log("  - Attempting to create minimal PDS...");
        
        try {
          const minimalPDS = await db.PersonalDataSheet.create({
            faculty_id: faculty.faculty_id,
            surname: "TEST",
            first_name: "USER",
            middle_name: null,
            date_of_birth: new Date("1990-01-01"),
            place_of_birth: "TEST CITY",
            sex: "Male",
            civil_status: "Single",
            citizenship_type: "Filipino",
            residential_city: "TEST CITY",
            residential_province: "TEST PROVINCE",
            permanent_city: "TEST CITY",
            permanent_province: "TEST PROVINCE",
            mobile_no: "09123456789",
            email_address: "test@example.com",
            status: "draft",
          });
          
          console.log("  - Status: ✅ MINIMAL PDS CREATED SUCCESSFULLY");
          console.log(`  - PDS ID: ${minimalPDS.pds_id}`);
          
          // Clean up test record
          await minimalPDS.destroy();
          console.log("  - Test record cleaned up");
        } catch (createError) {
          console.log("  - Status: ❌ FAILED TO CREATE MINIMAL PDS");
          console.log(`  - Error: ${createError.message}`);
          console.log();
          console.log("  Detailed Error:");
          console.log(createError);
        }
      }
      console.log();
    }

    // Test 5: Check for common issues
    console.log("✓ Test 5: Common Issues Check");
    
    // Check for ENUM mismatches
    const sexEnum = db.PersonalDataSheet.rawAttributes.sex.values;
    const civilStatusEnum = db.PersonalDataSheet.rawAttributes.civil_status.values;
    const citizenshipEnum = db.PersonalDataSheet.rawAttributes.citizenship_type.values;
    
    console.log("  - Sex ENUM values:", sexEnum);
    console.log("  - Civil Status ENUM values:", civilStatusEnum);
    console.log("  - Citizenship ENUM values:", citizenshipEnum);
    console.log();

    console.log("=".repeat(60));
    console.log("DIAGNOSTIC COMPLETE");
    console.log("=".repeat(60));
    console.log();
    console.log("If you're still experiencing errors:");
    console.log("1. Check the backend console logs for detailed error messages");
    console.log("2. Verify all required fields are being sent from the frontend");
    console.log("3. Ensure ENUM values match exactly (case-sensitive)");
    console.log("4. Check for date format issues (should be YYYY-MM-DD)");
    console.log();

  } catch (error) {
    console.error("❌ DIAGNOSTIC FAILED");
    console.error("Error:", error.message);
    console.error();
    console.error("Full Error:");
    console.error(error);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
}

diagnose();
