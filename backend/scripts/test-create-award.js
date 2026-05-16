require("dotenv").config();
const db = require("../models");

async function testCreateAward() {
  try {
    console.log("Testing award creation...\n");
    
    // Test data
    const testAward = {
      dean_id: 1, // Assuming dean_id 1 exists
      award_title: "Test Award",
      awarding_body: "Test Organization",
      date_received: "2024-01-15",
      level: "Institutional",
      description: "Test description",
      file_path: null
    };
    
    console.log("Test data:", testAward);
    console.log("\nAttempting to create award...");
    
    const award = await db.DeanAwards.create(testAward);
    
    console.log("\n✓ Award created successfully!");
    console.log("Created award:", award.toJSON());
    
    // Clean up - delete the test award
    await award.destroy();
    console.log("\n✓ Test award deleted");
    
  } catch (error) {
    console.error("\n❌ Error creating award:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    
    if (error.errors) {
      console.error("\nValidation errors:");
      error.errors.forEach(err => {
        console.error(`  - Field: ${err.path}`);
        console.error(`    Message: ${err.message}`);
        console.error(`    Value: ${err.value}`);
        console.error(`    Type: ${err.type}`);
      });
    }
    
    if (error.sql) {
      console.error("\nSQL:", error.sql);
    }
  } finally {
    await db.sequelize.close();
  }
}

testCreateAward();
