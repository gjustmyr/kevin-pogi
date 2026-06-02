# Add is_archived Column Migration Guide

## Issue
The `is_archived` column is defined in the model but doesn't exist in the database table yet.

**Error:**
```
Unknown column 'academic_years.is_archived' in 'where clause'
```

## Solution
Run the migration to add the `is_archived` column to the `academic_years` table.

## Migration Steps

### Option 1: Run Node.js Migration Script (Recommended)

1. **Open terminal in backend folder:**
   ```bash
   cd backend
   ```

2. **Run the migration script:**
   ```bash
   node run-migration-add-is-archived.js
   ```

3. **Expected output:**
   ```
   ✅ Connected to database
   📄 Running migration: add-is-archived-to-academic-years.sql
   ✅ Migration completed successfully!
   
   Changes made:
     - Added is_archived column to academic_years table
     - Added index on is_archived column
     - Set all existing records to is_archived = 0
   
   🎉 Academic year soft delete (archive) feature is now ready!
   ✅ Database connection closed
   ✅ Script completed
   ```

### Option 2: Run SQL Manually

1. **Open your MySQL client** (phpMyAdmin, MySQL Workbench, or command line)

2. **Select your database:**
   ```sql
   USE capstone_db;
   ```

3. **Run the migration SQL:**
   ```sql
   -- Add is_archived column to academic_years table
   ALTER TABLE `academic_years` 
   ADD COLUMN `is_archived` TINYINT(1) NOT NULL DEFAULT 0 
   AFTER `is_active`;

   -- Add index for better query performance
   CREATE INDEX `idx_is_archived` ON `academic_years` (`is_archived`);

   -- Update any existing records to ensure they are not archived
   UPDATE `academic_years` SET `is_archived` = 0 WHERE `is_archived` IS NULL;
   ```

4. **Verify the column was added:**
   ```sql
   DESCRIBE academic_years;
   ```

   You should see:
   ```
   +------------------+--------------+------+-----+---------+----------------+
   | Field            | Type         | Null | Key | Default | Extra          |
   +------------------+--------------+------+-----+---------+----------------+
   | academic_year_id | int          | NO   | PRI | NULL    | auto_increment |
   | year_start       | int          | NO   |     | NULL    |                |
   | year_end         | int          | NO   |     | NULL    |                |
   | is_active        | tinyint(1)   | YES  |     | 0       |                |
   | is_archived      | tinyint(1)   | NO   | MUL | 0       |                |
   | createdAt        | datetime     | NO   |     | NULL    |                |
   | updatedAt        | datetime     | NO   |     | NULL    |                |
   +------------------+--------------+------+-----+---------+----------------+
   ```

## What This Migration Does

1. **Adds `is_archived` column:**
   - Type: TINYINT(1) (boolean)
   - Default: 0 (false - not archived)
   - Position: After `is_active` column

2. **Creates index:**
   - Index name: `idx_is_archived`
   - Improves query performance when filtering by archived status

3. **Updates existing records:**
   - Sets all existing academic years to `is_archived = 0`
   - Ensures no null values

## After Migration

Once the migration is complete, the academic year soft delete feature will work:

### Features Available:
1. ✅ **Archive** - Soft delete academic years (sets is_archived = true)
2. ✅ **Restore** - Restore archived academic years (sets is_archived = false)
3. ✅ **Toggle View** - Show/hide archived academic years
4. ✅ **Data Preservation** - All related data remains intact

### Testing:
1. Go to Super Admin Portal
2. Navigate to Academic Year Management
3. Click "Archive" on any academic year
4. Click "Show Archived" button to view archived years
5. Click "Restore" to restore an archived year

## Troubleshooting

### Error: "Column already exists"
If you see this error, the column has already been added. No action needed.

### Error: "Access denied"
Make sure your database user has ALTER TABLE permissions.

### Error: "Table doesn't exist"
Make sure you're connected to the correct database and the `academic_years` table exists.

## Rollback (If Needed)

If you need to remove the column:

```sql
-- Remove index
DROP INDEX `idx_is_archived` ON `academic_years`;

-- Remove column
ALTER TABLE `academic_years` DROP COLUMN `is_archived`;
```

**⚠️ Warning:** This will permanently delete the archived status of all academic years.

## Files Created

1. `backend/migrations/add-is-archived-to-academic-years.sql` - SQL migration file
2. `backend/run-migration-add-is-archived.js` - Node.js migration script
3. `ADD_IS_ARCHIVED_MIGRATION_GUIDE.md` - This guide

## Summary

The code for soft delete (archive) functionality is already implemented in:
- ✅ Backend model
- ✅ Backend controller
- ✅ Backend routes
- ✅ Frontend component
- ✅ Frontend service

This migration adds the missing database column to make it all work!
