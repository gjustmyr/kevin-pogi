const fs = require('fs');
const path = require('path');
const { dbConfig } = require('./config/db.config');
const mysql = require('mysql2/promise');

async function runMigration() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    connection = await mysql.createConnection({
      host: dbConfig.HOST,
      user: dbConfig.USER,
      password: dbConfig.PASSWORD,
      database: dbConfig.DB,
      multipleStatements: true
    });

    console.log('✅ Connected to database');

    // Read the migration file
    const migrationPath = path.join(__dirname, 'migrations', 'add-is-active-to-faculty.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('🔄 Running migration: add-is-active-to-faculty.sql');
    
    // Execute the migration
    await connection.query(migrationSQL);

    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('Summary:');
    console.log('  - Added is_active column to faculties table');
    console.log('  - Added is_active column to users table (if not exists)');
    console.log('  - Set all existing records to active (is_active = true)');
    console.log('  - Created indexes for better query performance');
    console.log('');
    console.log('✨ Faculty soft delete functionality is now ready!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('');
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the migration
runMigration();
