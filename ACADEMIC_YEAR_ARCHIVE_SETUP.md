# Academic Year Archive Feature - Setup Guide

## Overview
The academic year archive feature has been implemented with **soft delete** functionality. When you "delete" an academic year, it's actually archived and can be restored later with all its data intact.

## Current Status
✅ **Backend Code**: Fully implemented
✅ **Frontend Code**: Fully implemented  
✅ **Migration Files**: Ready to run
❌ **Database Column**: **NEEDS TO BE ADDED** ← **YOU ARE HERE**

## What You Need to Do

### Step 1: Run the Database Migration

You have **TWO OPTIONS** to add the `is_archived` column:

#### Option A: Use the Batch File (Easiest)
1. Navigate to the `backend` folder
2. Double-click `add-is-archived-column.bat`
3. Press any key when prompted
4. Wait for the migration to complete

#### Option B: Run Manually
1. Open Command Prompt
2. Navigate to the backend folder:
   ```cmd
   cd c:\Users\Kevin Dizon\kevin-pogi\backend
   ```
3. Run the migration script:
   ```cmd
   node run-migration-add-is-archived.js
   ```

### Step 2: Restart Your Backend Server
After the migration completes:
1. Stop your backend server (Ctrl+C if running)
2. Start it again:
   ```cmd
   node index.js
   ```

### Step 3: Test the Feature
1. Log in to the **Super Admin Portal**
2. You should see TWO menu items in the sidebar:
   - **Academic Year** - Shows active/non-archived years
   - **Archived Years** - Shows archived years only
3. Test the workflow:
   - Create a new academic year
   - Archive it (click "Archive" button)
   - Go to "Archived Years" section
   - Restore it (click "Restore" button)
   - Verify it appears back in "Academic Year" section

## What the Migration Does

The migration script will:
1. ✅ Add `is_archived` column to `academic_years` table (TINYINT, default 0)
2. ✅ Create an index on `is_archived` for better performance
3. ✅ Set all existing academic years to `is_archived = 0` (not archived)

## Features Implemented

### Separate Sections
- **Academic Year**: Shows only non-archived years
  - Can create new academic years
  - Can edit existing years
  - Can archive years (soft delete)
  
- **Archived Years**: Shows only archived years
  - View-only for archived data
  - Can restore archived years
  - No create/edit buttons

### Soft Delete Benefits
- ✅ Data is preserved when "deleted"
- ✅ All files and relationships remain intact
- ✅ Can be restored at any time
- ✅ No data loss

## Technical Details

### Database Schema
```sql
ALTER TABLE `academic_years` 
ADD COLUMN `is_archived` TINYINT(1) NOT NULL DEFAULT 0 
AFTER `is_active`;

CREATE INDEX `idx_is_archived` ON `academic_years` (`is_archived`);
```

### API Endpoints
- `GET /superadmin/academic-years?includeArchived=false` - Get non-archived years
- `GET /superadmin/academic-years?includeArchived=true` - Get archived years
- `DELETE /superadmin/academic-years/:id` - Archive a year (soft delete)
- `POST /superadmin/academic-years/:id/restore` - Restore an archived year

### Frontend Components
- `academic-year-management.ts` - Main component with `@Input() showArchived`
- `superadmin.html` - Dashboard with separate menu items
- `superadmin-academic-year.service.ts` - API service

## Troubleshooting

### Error: "Unknown column 'academic_years.is_archived'"
**Solution**: You haven't run the migration yet. Follow Step 1 above.

### Error: "Column already exists"
**Solution**: Migration already ran successfully. Just restart your backend server.

### Archived years not showing
**Solution**: 
1. Make sure you've archived at least one academic year
2. Check that you're in the "Archived Years" section (not "Academic Year")
3. Verify the backend is using the correct database

### Cannot restore archived year
**Solution**:
1. Check browser console for errors
2. Verify the restore API endpoint is working: `POST /superadmin/academic-years/:id/restore`
3. Check backend logs for errors

## Files Modified/Created

### Backend
- ✅ `models/academic-year.model.js` - Added `is_archived` field
- ✅ `controllers/academic-year.controller.js` - Added archive/restore logic
- ✅ `routes/academic-year.routes.js` - Added restore endpoint
- ✅ `migrations/add-is-archived-to-academic-years.sql` - Migration SQL
- ✅ `run-migration-add-is-archived.js` - Migration runner
- ✅ `add-is-archived-column.bat` - Easy migration runner

### Frontend
- ✅ `features/superadmin/academic-year-management/academic-year-management.ts` - Added `@Input() showArchived`
- ✅ `features/superadmin/academic-year-management/academic-year-management.html` - Updated UI
- ✅ `features/dashboards/superadmin/superadmin.html` - Added "Archived Years" menu
- ✅ `features/dashboards/superadmin/superadmin.ts` - Added archived tab handling
- ✅ `services/superadmin-academic-year.service.ts` - Added `includeArchived` parameter

## Next Steps After Setup

Once the migration is complete and tested:
1. ✅ Academic year archive feature is fully functional
2. ✅ You can safely archive old academic years
3. ✅ All data is preserved and can be restored
4. ✅ The system is ready for production use

## Support

If you encounter any issues:
1. Check the backend console for error messages
2. Check the browser console for frontend errors
3. Verify the database connection in `.env` file
4. Ensure you're using the correct database: `database_cs`
