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
    const sql = fs.readFileSync('./migrations/add-activity-fields-to-organization-documents.sql', 'utf8');
    
    console.log('Executing migration...');
    await connection.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('Changes made to organization_documents table:');
    console.log('  - document_type_id is now nullable');
    console.log('  - Added activity_date field (DATE, nullable)');
    console.log('  - Added venue field (VARCHAR(255), nullable)');
    console.log('  - Added participants field (INT, nullable)');
    
    await connection.end();
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    process.exit(1);
  }
}

runMigration();
