# Quick Fix: Academic Year Archive Feature

## Problem
Error when loading academic years:
```
Unknown column 'academic_years.is_archived' in 'where clause'
```

## Cause
The `is_archived` column is defined in the code but doesn't exist in the database table yet.

## Solution
Run the migration to add the missing column.

## Quick Steps

### 1. Open Terminal
```bash
cd backend
```

### 2. Run Migration
```bash
node run-migration-add-is-archived.js
```

### 3. Restart Backend
```bash
# Stop the backend (Ctrl+C)
# Start it again
npm start
```

### 4. Test
- Go to Super Admin Portal
- Navigate to Academic Year Management
- Try archiving an academic year
- Click "Show Archived" to view archived years
- Try restoring an archived year

## That's It!
The academic year soft delete (archive) feature will now work perfectly! 🎉

## What Gets Added
- `is_archived` column (TINYINT, default 0)
- Index on `is_archived` for better performance
- All existing records set to not archived

## Files Created
1. `backend/migrations/add-is-archived-to-academic-years.sql`
2. `backend/run-migration-add-is-archived.js`
3. `ADD_IS_ARCHIVED_MIGRATION_GUIDE.md` (detailed guide)
4. `QUICK_FIX_ACADEMIC_YEAR_ARCHIVE.md` (this file)
