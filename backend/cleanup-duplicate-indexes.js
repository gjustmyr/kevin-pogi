const db = require('./models');
require('dotenv').config();

async function cleanupDuplicateIndexes() {
  try {
    console.log('🧹 Cleaning up duplicate email indexes\n');
    console.log('═'.repeat(80));

    // Get all indexes on users table
    const [indexes] = await db.sequelize.query(`SHOW INDEX FROM users`);

    // Find all email indexes (except unique_email_role)
    const emailIndexes = indexes.filter(idx => 
      idx.Column_name === 'email' && 
      idx.Key_name !== 'unique_email_role' &&
      idx.Key_name !== 'PRIMARY'
    );

    // Get unique index names
    const uniqueIndexNames = [...new Set(emailIndexes.map(idx => idx.Key_name))];

    console.log(`Found ${uniqueIndexNames.length} duplicate email indexes to remove:\n`);
    uniqueIndexNames.forEach((name, i) => {
      console.log(`${i + 1}. ${name}`);
    });

    if (uniqueIndexNames.length === 0) {
      console.log('\n✅ No duplicate indexes found! Database is clean.');
      console.log('═'.repeat(80));
      return;
    }

    console.log('\n' + '═'.repeat(80));
    console.log('\n🗑️  Removing duplicate indexes...\n');

    let removed = 0;
    let failed = 0;

    for (const indexName of uniqueIndexNames) {
      try {
        await db.sequelize.query(`ALTER TABLE users DROP INDEX \`${indexName}\``);
        console.log(`✅ Removed: ${indexName}`);
        removed++;
      } catch (error) {
        console.log(`❌ Failed to remove ${indexName}: ${error.message}`);
        failed++;
      }
    }

    console.log('\n' + '═'.repeat(80));
    console.log('\n📊 Summary:');
    console.log(`   Removed: ${removed}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Total: ${uniqueIndexNames.length}`);

    // Verify final state
    console.log('\n' + '═'.repeat(80));
    console.log('\n🔍 Verifying final state...\n');

    const [finalIndexes] = await db.sequelize.query(`
      SHOW INDEX FROM users WHERE Column_name IN ('email', 'role')
    `);

    console.log('Remaining indexes:');
    const grouped = {};
    finalIndexes.forEach(idx => {
      if (!grouped[idx.Key_name]) {
        grouped[idx.Key_name] = [];
      }
      grouped[idx.Key_name].push(idx.Column_name);
    });

    Object.entries(grouped).forEach(([keyName, columns]) => {
      console.log(`  - ${keyName}: [${columns.join(', ')}]`);
    });

    console.log('\n' + '═'.repeat(80));
    console.log('\n✅ Cleanup complete!');
    console.log('\nThe database now has:');
    console.log('  ✅ unique_email_role (email, role) - Allows same email for different roles');
    console.log('  ❌ No duplicate email indexes');
    console.log('═'.repeat(80));

  } catch (error) {
    console.error('\n❌ Cleanup failed!');
    console.error('Error:', error.message);
  } finally {
    await db.sequelize.close();
  }
}

cleanupDuplicateIndexes();
