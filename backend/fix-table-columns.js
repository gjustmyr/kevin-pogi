const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixColumns() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Connected to database');
    console.log('Checking table columns...\n');

    // Get current columns
    const [columns] = await connection.query(
      "DESCRIBE organization_bulk_uploads"
    );

    const hasUploadDate = columns.some(col => col.Field === 'upload_date');
    const hasCreatedAt = columns.some(col => col.Field === 'createdAt');
    const hasUpdatedAt = columns.some(col => col.Field === 'updatedAt');

    console.log(`upload_date exists: ${hasUploadDate}`);
    console.log(`createdAt exists: ${hasCreatedAt}`);
    console.log(`updatedAt exists: ${hasUpdatedAt}\n`);

    // Remove upload_date if it exists (we use createdAt instead)
    if (hasUploadDate) {
      console.log('Removing redundant upload_date column...');
      await connection.query('ALTER TABLE organization_bulk_uploads DROP COLUMN upload_date');
      console.log('✅ upload_date column removed');
    }

    console.log('\n✅ Table structure is now correct!');
    console.log('\nFinal table structure:');
    console.log('─'.repeat(80));

    const [finalColumns] = await connection.query(
      "DESCRIBE organization_bulk_uploads"
    );

    finalColumns.forEach(col => {
      console.log(`${col.Field.padEnd(20)} | ${col.Type.padEnd(25)} | ${col.Null.padEnd(5)}`);
    });

    console.log('─'.repeat(80));

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixColumns();
