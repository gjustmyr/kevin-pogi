const db = require('./models');
require('dotenv').config();

async function checkDeanProfile() {
  try {
    console.log('🔍 Checking Dean Profiles...\n');
    console.log('═'.repeat(80));

    // Get all users with dean role
    const deanUsers = await db.User.findAll({
      where: { role: 'dean' },
      attributes: ['user_id', 'email', 'role', 'createdAt'],
    });

    console.log(`\n📊 Found ${deanUsers.length} dean user(s):\n`);

    for (const user of deanUsers) {
      console.log(`User ID: ${user.user_id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Created: ${user.createdAt}`);

      // Check if dean profile exists
      const deanProfile = await db.Dean.findOne({
        where: { user_id: user.user_id },
      });

      if (deanProfile) {
        console.log(`✅ Dean Profile EXISTS`);
        console.log(`   - Dean ID: ${deanProfile.dean_id}`);
        console.log(`   - Name: ${deanProfile.first_name} ${deanProfile.last_name}`);
        console.log(`   - Department: ${deanProfile.department}`);
        console.log(`   - Employee ID: ${deanProfile.employee_id}`);
      } else {
        console.log(`❌ Dean Profile MISSING!`);
        console.log(`   This user cannot create faculty or organizations.`);
      }
      console.log('─'.repeat(80));
    }

    // Summary
    const totalDeanUsers = deanUsers.length;
    const deansWithProfile = await db.Dean.count();
    const deansWithoutProfile = totalDeanUsers - deansWithProfile;

    console.log('\n📈 Summary:');
    console.log(`   Total Dean Users: ${totalDeanUsers}`);
    console.log(`   With Profile: ${deansWithProfile}`);
    console.log(`   Without Profile: ${deansWithoutProfile}`);

    if (deansWithoutProfile > 0) {
      console.log('\n⚠️  WARNING: Some dean users are missing their profiles!');
      console.log('   These users cannot create faculty or organizations.');
      console.log('\n💡 Solution: Create dean profiles for these users.');
    } else {
      console.log('\n✅ All dean users have profiles!');
    }

    console.log('\n═'.repeat(80));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.sequelize.close();
  }
}

checkDeanProfile();
