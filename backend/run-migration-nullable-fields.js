const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function runMigration() {
  try {
    console.log('Connecting to database...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });

    console.log('Reading migration file...');
    const sql = fs.readFileSync('./migrations/make-organization-members-fields-nullable.sql', 'utf8');
    
    console.log('Executing migration...');
    await connection.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('The following fields are now nullable:');
    console.log('  - sr_code');
    console.log('  - first_name');
    console.log('  - last_name');
    console.log('  - year_level');
    console.log('  - position');
    console.log('  - academic_year_id');
    console.log('  - term_start_date');
    
    await connection.end();
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    process.exit(1);
  }
}

runMigration();
