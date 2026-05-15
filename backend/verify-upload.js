const mysql = require('mysql2/promise');
require('dotenv').config();

async function verifySetup() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('🔍 Verifying Bulk Upload Setup...\n');
    console.log('═'.repeat(80));

    // Check 1: Table exists
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'organization_bulk_uploads'"
    );
    
    if (tables.length > 0) {
      console.log('✅ Table "organization_bulk_uploads" exists');
    } else {
      console.log('❌ Table "organization_bulk_uploads" does NOT exist');
      return;
    }

    // Check 2: Required columns
    const [columns] = await connection.query(
      "DESCRIBE organization_bulk_uploads"
    );
    
    const requiredColumns = [
      'upload_id',
      'organization_id',
      'file_name',
      'department',
      'academic_year_id',
      'term_start_date',
      'total_records',
      'inserted_count',
      'updated_count',
      'skipped_count',
      'uploaded_by',
      'upload_status',
      'createdAt',
      'updatedAt'
    ];

    const existingColumns = columns.map(col => col.Field);
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));

    if (missingColumns.length === 0) {
      console.log('✅ All required columns exist');
    } else {
      console.log('❌ Missing columns:', missingColumns.join(', '));
      return;
    }

    // Check 3: upload_status column type
    const statusColumn = columns.find(col => col.Field === 'upload_status');
    if (statusColumn && statusColumn.Type.includes('enum')) {
      console.log('✅ upload_status column has correct ENUM type');
    } else {
      console.log('❌ upload_status column type is incorrect');
    }

    // Check 4: Foreign keys
    const [foreignKeys] = await connection.query(`
      SELECT 
        CONSTRAINT_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = ? 
        AND TABLE_NAME = 'organization_bulk_uploads'
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `, [process.env.DB_NAME]);

    if (foreignKeys.length >= 3) {
      console.log('✅ Foreign key constraints are set up');
      foreignKeys.forEach(fk => {
        console.log(`   - ${fk.COLUMN_NAME} → ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`);
      });
    } else {
      console.log('⚠️  Some foreign keys may be missing');
    }

    // Check 5: Recent uploads
    const [uploads] = await connection.query(`
      SELECT COUNT(*) as count FROM organization_bulk_uploads
    `);

    console.log(`\n📊 Current upload records: ${uploads[0].count}`);

    if (uploads[0].count > 0) {
      const [recentUploads] = await connection.query(`
        SELECT 
          file_name,
          department,
          total_records,
          upload_status,
          createdAt
        FROM organization_bulk_uploads
        ORDER BY createdAt DESC
        LIMIT 3
      `);

      console.log('\n📋 Recent uploads:');
      recentUploads.forEach((upload, index) => {
        console.log(`   ${index + 1}. ${upload.file_name}`);
        console.log(`      Department: ${upload.department}`);
        console.log(`      Records: ${upload.total_records}`);
        console.log(`      Status: ${upload.upload_status}`);
        console.log(`      Date: ${upload.createdAt}`);
      });
    }

    console.log('\n' + '═'.repeat(80));
    console.log('✅ SETUP VERIFICATION COMPLETE');
    console.log('═'.repeat(80));
    console.log('\n🎉 Everything is ready! You can now use the bulk upload feature.\n');

  } catch (error) {
    console.error('❌ Verification Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

verifySetup();
