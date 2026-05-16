const mysql = require('mysql2/promise');
require('dotenv').config();

async function verifyTable() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Checking table structure...\n');

    // Check if table exists
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'organization_bulk_uploads'"
    );

    if (tables.length === 0) {
      console.log('❌ Table does not exist!');
      return;
    }

    console.log('✅ Table exists!');
    console.log('\nTable structure:');
    console.log('─'.repeat(80));

    // Get table structure
    const [columns] = await connection.query(
      "DESCRIBE organization_bulk_uploads"
    );

    columns.forEach(col => {
      console.log(`${col.Field.padEnd(20)} | ${col.Type.padEnd(20)} | ${col.Null.padEnd(5)} | ${col.Key.padEnd(5)} | ${col.Default || 'NULL'}`);
    });

    console.log('─'.repeat(80));
    console.log('\n✅ Table is ready to use!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

verifyTable();
