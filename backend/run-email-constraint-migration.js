const db = require('./models');
require('dotenv').config();

async function runMigration() {
  try {
    console.log('🔧 Email Constraint Migration\n');
    console.log('═'.repeat(80));
    console.log('This migration will:');
    console.log('1. Remove the unique constraint on email column');
    console.log('2. Add a composite unique constraint on (email, role)');
    console.log('3. Allow same email for different roles (max 3: org, faculty, dean)');
    console.log('═'.repeat(80));
    console.log('\n⚠️  WARNING: This will modify the database schema!');
    console.log('Make sure you have a backup before proceeding.\n');

    // Check current constraints
    console.log('📋 Step 1: Checking current constraints...\n');
    
    const [indexes] = await db.sequelize.query(`
      SHOW INDEX FROM users WHERE Key_name = 'email'
    `);

    if (indexes.length > 0) {
      console.log('✅ Found existing unique constraint on email column');
      console.log('   This needs to be removed to allow email reuse across roles.\n');
    } else {
      console.log('ℹ️  No unique constraint found on email column');
      console.log('   It may have been already removed.\n');
    }

    // Check if new constraint already exists
    const [newIndexes] = await db.sequelize.query(`
      SHOW INDEX FROM users WHERE Key_name = 'unique_email_role'
    `);

    if (newIndexes.length > 0) {
      console.log('ℹ️  Composite unique constraint (email, role) already exists!');
      console.log('   Migration may have already been applied.\n');
      console.log('═'.repeat(80));
      console.log('✅ Database schema is already up to date!');
      return;
    }

    // Check for potential conflicts
    console.log('📋 Step 2: Checking for potential conflicts...\n');
    
    const [duplicates] = await db.sequelize.query(`
      SELECT email, role, COUNT(*) as count
      FROM users
      GROUP BY email, role
      HAVING count > 1
    `);

    if (duplicates.length > 0) {
      console.log('❌ Found duplicate (email, role) combinations:');
      duplicates.forEach(dup => {
        console.log(`   - ${dup.email} (${dup.role}): ${dup.count} accounts`);
      });
      console.log('\n⚠️  Cannot proceed with migration until duplicates are resolved!');
      console.log('   Please manually resolve these duplicates first.');
      return;
    }

    console.log('✅ No conflicts found. Safe to proceed.\n');

    // Run migration
    console.log('📋 Step 3: Running migration...\n');

    // Drop old constraint if it exists
    try {
      await db.sequelize.query(`ALTER TABLE users DROP INDEX email`);
      console.log('✅ Removed unique constraint on email column');
    } catch (error) {
      if (error.message.includes("check that column/key exists")) {
        console.log('ℹ️  Email constraint already removed (skipping)');
      } else {
        throw error;
      }
    }

    // Add new composite constraint
    try {
      await db.sequelize.query(`
        ALTER TABLE users ADD UNIQUE INDEX unique_email_role (email, role)
      `);
      console.log('✅ Added composite unique constraint (email, role)');
    } catch (error) {
      if (error.message.includes("Duplicate key name")) {
        console.log('ℹ️  Composite constraint already exists (skipping)');
      } else {
        throw error;
      }
    }

    // Verify changes
    console.log('\n📋 Step 4: Verifying changes...\n');
    
    const [finalIndexes] = await db.sequelize.query(`
      SHOW INDEX FROM users WHERE Key_name = 'unique_email_role'
    `);

    if (finalIndexes.length > 0) {
      console.log('✅ Composite unique constraint verified:');
      finalIndexes.forEach(idx => {
        console.log(`   - Column: ${idx.Column_name}, Seq: ${idx.Seq_in_index}`);
      });
    }

    console.log('\n═'.repeat(80));
    console.log('✅ Migration completed successfully!');
    console.log('\nWhat this means:');
    console.log('- Same email can now be used for different roles');
    console.log('- Each email can have: 1 organization + 1 faculty + 1 dean account');
    console.log('- Example: john@example.com can be both a dean AND a faculty');
    console.log('═'.repeat(80));

  } catch (error) {
    console.error('\n❌ Migration failed!');
    console.error('Error:', error.message);
    console.error('\nPlease check the error and try again.');
    console.error('If the issue persists, you may need to run the SQL migration manually.');
  } finally {
    await db.sequelize.close();
  }
}

runMigration();
