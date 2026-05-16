const mysql = require('mysql2/promise');
require('dotenv').config();

async function addColumn() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Connected to database');
    console.log('Adding upload_status column...');

    const sql = `
      ALTER TABLE organization_bulk_uploads 
      ADD COLUMN upload_status ENUM('completed', 'partial', 'failed') 
      NOT NULL DEFAULT 'completed' 
      COMMENT 'Status of the bulk upload' 
      AFTER uploaded_by
    `;

    await connection.query(sql);

    console.log('✅ Column added successfully!');
    
    // Verify
    const [columns] = await connection.query(
      "DESCRIBE organization_bulk_uploads"
    );
    
    const statusColumn = columns.find(col => col.Field === 'upload_status');
    if (statusColumn) {
      console.log('\n✅ Verification: upload_status column exists');
      console.log(`   Type: ${statusColumn.Type}`);
      console.log(`   Default: ${statusColumn.Default}`);
    }

  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  Column already exists, skipping...');
    } else {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addColumn();
