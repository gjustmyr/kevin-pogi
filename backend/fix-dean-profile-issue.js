const db = require('./models');
require('dotenv').config();

async function fixDeanProfileIssue() {
  try {
    console.log('🔧 Dean Profile Issue Fixer\n');
    console.log('═'.repeat(80));

    // Step 1: Check all dean users
    console.log('\n📋 Step 1: Checking all dean users...\n');
    const deanUsers = await db.User.findAll({
      where: { role: 'dean' },
      attributes: ['user_id', 'email', 'role'],
    });

    console.log(`Found ${deanUsers.length} dean user(s):\n`);

    const issues = [];

    for (const user of deanUsers) {
      console.log(`User ID: ${user.user_id} | Email: ${user.email}`);

      // Check if dean profile exists
      const deanProfile = await db.Dean.findOne({
        where: { user_id: user.user_id },
      });

      if (deanProfile) {
        console.log(`  ✅ Profile exists: ${deanProfile.first_name} ${deanProfile.last_name} (${deanProfile.department})`);
      } else {
        console.log(`  ❌ Profile MISSING!`);
        issues.push({
          user_id: user.user_id,
          email: user.email,
        });
      }
      console.log('');
    }

    // Step 2: Report issues
    console.log('═'.repeat(80));
    console.log('\n📊 Summary:\n');

    if (issues.length === 0) {
      console.log('✅ All dean users have profiles!');
      console.log('\n💡 If you\'re still getting "Dean profile not found" error:');
      console.log('   1. Log out and log back in to refresh your JWT token');
      console.log('   2. Clear your browser cache');
      console.log('   3. Check the backend console logs for detailed error info');
    } else {
      console.log(`❌ Found ${issues.length} dean user(s) without profiles:\n`);
      issues.forEach(issue => {
        console.log(`   - User ID: ${issue.user_id} | Email: ${issue.email}`);
      });

      console.log('\n💡 To fix this:');
      console.log('   1. Contact the system administrator');
      console.log('   2. The admin should create dean profiles for these users');
      console.log('   3. Or use the superadmin panel to create the profiles');
    }

    // Step 3: Check for orphaned dean profiles
    console.log('\n═'.repeat(80));
    console.log('\n📋 Step 2: Checking for orphaned dean profiles...\n');

    const allDeanProfiles = await db.Dean.findAll({
      attributes: ['dean_id', 'user_id', 'first_name', 'last_name', 'email'],
    });

    const orphanedProfiles = [];

    for (const profile of allDeanProfiles) {
      const user = await db.User.findOne({
        where: { user_id: profile.user_id },
      });

      if (!user) {
        console.log(`❌ Orphaned profile: ${profile.first_name} ${profile.last_name} (user_id: ${profile.user_id} doesn't exist)`);
        orphanedProfiles.push(profile);
      } else if (user.role !== 'dean') {
        console.log(`⚠️  Mismatched role: ${profile.first_name} ${profile.last_name} (user has role "${user.role}", not "dean")`);
      }
    }

    if (orphanedProfiles.length === 0 && allDeanProfiles.length > 0) {
      console.log('✅ No orphaned dean profiles found');
    }

    console.log('\n═'.repeat(80));
    console.log('\n✅ Diagnostic complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await db.sequelize.close();
  }
}

fixDeanProfileIssue();
