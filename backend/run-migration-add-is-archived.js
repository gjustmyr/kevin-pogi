const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'database_cs',
      multipleStatements: true
    });

    console.log('✅ Connected to database');

    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', 'add-is-archived-to-academic-years.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Running migration: add-is-archived-to-academic-years.sql');

    // Execute migration
    await connection.query(migrationSQL);

    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('Changes made:');
    console.log('  - Added is_archived column to academic_years table');
    console.log('  - Added index on is_archived column');
    console.log('  - Set all existing records to is_archived = 0');
    console.log('');
    console.log('🎉 Academic year soft delete (archive) feature is now ready!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  Column already exists. Migration skipped.');
    } else {
      throw error;
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Database connection closed');
    }
  }
}

// Run migration
runMigration()
  .then(() => {
    console.log('✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
