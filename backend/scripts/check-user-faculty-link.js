/**
 * Check User-Faculty Link
 * 
 * This script checks if a user has a linked faculty profile
 */

const db = require("../models");

async function checkUserFacultyLink() {
  try {
    console.log("=".repeat(60));
    console.log("USER-FACULTY LINK CHECKER");
    console.log("=".repeat(60));
    console.log();

    // Get all users
    const users = await db.User.findAll({
      attributes: ['user_id', 'email', 'role'],
      order: [['user_id', 'ASC']]
    });

    console.log(`Total Users: ${users.length}`);
    console.log();

    // Check each user for faculty link
    for (const user of users) {
      const faculty = await db.Faculty.findOne({
        where: { user_id: user.user_id },
        attributes: ['faculty_id', 'first_name', 'last_name']
      });

      const dean = await db.Dean.findOne({
        where: { user_id: user.user_id },
        attributes: ['dean_id', 'first_name', 'last_name']
      });

      console.log(`User ID: ${user.user_id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      
      if (faculty) {
        console.log(`  ✅ Faculty Profile: ID ${faculty.faculty_id} - ${faculty.first_name} ${faculty.last_name}`);
      } else {
        console.log(`  ❌ No Faculty Profile`);
      }

      if (dean) {
        console.log(`  ✅ Dean Profile: ID ${dean.dean_id} - ${dean.first_name} ${dean.last_name}`);
      } else {
        console.log(`  ❌ No Dean Profile`);
      }

      console.log();
    }

    // Summary
    const facultyCount = await db.Faculty.count();
    const deanCount = await db.Dean.count();
    const usersWithoutProfile = users.length - facultyCount - deanCount;

    console.log("=".repeat(60));
    console.log("SUMMARY");
    console.log("=".repeat(60));
    console.log(`Total Users: ${users.length}`);
    console.log(`Users with Faculty Profile: ${facultyCount}`);
    console.log(`Users with Dean Profile: ${deanCount}`);
    console.log(`Users without Profile: ${usersWithoutProfile}`);
    console.log();

    if (usersWithoutProfile > 0) {
      console.log("⚠️  WARNING: Some users don't have faculty or dean profiles!");
      console.log("These users cannot save PDS data.");
      console.log();
      console.log("Solution:");
      console.log("1. Create faculty/dean profiles for these users");
      console.log("2. Link the profiles to the user accounts via user_id");
      console.log();
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
}

checkUserFacultyLink();
