# Faculty Soft Delete - Setup and Testing Guide

## Overview
This guide will help you set up and test the new faculty account management system with soft deletion (disable) functionality.

## Step 1: Run the Database Migration

### Option A: Using the Migration Script (Recommended)
```bash
cd backend
node run-migration-add-is-active.js
```

This will:
- Add `is_active` column to `faculties` table
- Add `is_active` column to `users` table (if not exists)
- Set all existing records to active (`is_active = true`)
- Create indexes for better query performance

### Option B: Manual SQL Execution
If you prefer to run the SQL manually:

```bash
cd backend
mysql -u your_username -p your_database < migrations/add-is-active-to-faculty.sql
```

## Step 2: Restart the Backend Server

After running the migration, restart your backend server:

```bash
cd backend
node index.js
```

Or if using nodemon:
```bash
npm run dev
```

## Step 3: Update Frontend (Coming Next)

The frontend changes will be implemented to add:
- "Disabled Accounts" tab
- "Disable Account" button (replaces "Delete")
- "Restore Account" functionality
- "Permanently Delete" functionality (only for disabled accounts)

## API Endpoints

### Get Active Faculty
```
GET /api/dean/faculty
```
Returns only active faculty (`is_active = true`)

### Get Disabled Faculty
```
GET /api/dean/faculty/disabled
```
Returns only disabled faculty (`is_active = false`)

### Disable Faculty Account
```
PUT /api/dean/faculty/:id/disable
```
Disables the faculty account (soft delete)

### Restore Faculty Account
```
PUT /api/dean/faculty/:id/restore
```
Restores a disabled faculty account

### Permanently Delete Faculty
```
DELETE /api/dean/faculty/:id
```
Permanently deletes a faculty account (only works for disabled accounts)

## Testing the Backend

### 1. Test Getting Active Faculty
```bash
curl -X GET http://localhost:3000/api/dean/faculty \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Test Disabling a Faculty Account
```bash
curl -X PUT http://localhost:3000/api/dean/faculty/1/disable \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Test Getting Disabled Faculty
```bash
curl -X GET http://localhost:3000/api/dean/faculty/disabled \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Test Restoring a Faculty Account
```bash
curl -X PUT http://localhost:3000/api/dean/faculty/1/restore \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Test Permanent Deletion (only for disabled accounts)
```bash
# First disable the account
curl -X PUT http://localhost:3000/api/dean/faculty/1/disable \
  -H "Authorization: Bearer YOUR_TOKEN"

# Then permanently delete
curl -X DELETE http://localhost:3000/api/dean/faculty/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Database Schema Changes

### faculties table
```sql
ALTER TABLE faculties 
ADD COLUMN is_active BOOLEAN DEFAULT true 
COMMENT 'Account status: true=active (can login), false=disabled (cannot login)';
```

### users table
```sql
ALTER TABLE users 
ADD COLUMN is_active BOOLEAN DEFAULT true 
COMMENT 'Account status: true=active (can login), false=disabled (cannot login)';
```

## Security Features

1. **Login Prevention**: Disabled accounts cannot login
2. **Visibility Control**: Disabled faculty are hidden from main list
3. **Permanent Deletion Protection**: Can only permanently delete disabled accounts
4. **Department Isolation**: Deans can only manage faculty in their department

## Workflow

### Disabling an Account
1. Dean clicks "Disable Account" on a faculty member
2. System sets `is_active = false` for both faculty and user records
3. Faculty disappears from main list
4. Faculty appears in "Disabled Accounts" tab
5. Faculty cannot login anymore

### Restoring an Account
1. Dean opens "Disabled Accounts" tab
2. Dean clicks "Restore" on a faculty member
3. System sets `is_active = true` for both faculty and user records
4. Faculty reappears in main list
5. Faculty can login again

### Permanent Deletion
1. Account must be disabled first
2. Dean opens "Disabled Accounts" tab
3. Dean clicks "Permanently Delete"
4. System permanently removes faculty and user records
5. Action cannot be undone

## Troubleshooting

### Migration Fails
- Check database connection in `backend/config/db.config.js`
- Ensure you have proper database permissions
- Check if columns already exist

### Backend Errors
- Restart the backend server after migration
- Check console for error messages
- Verify all model files are updated

### Login Issues for Disabled Accounts
- This is expected behavior
- Disabled accounts should see: "Your account has been disabled"
- Contact administrator to restore the account

## Next Steps

1. ✅ Run the migration
2. ✅ Restart backend server
3. ⏳ Implement frontend changes (coming next)
4. ⏳ Test the complete workflow
5. ⏳ Deploy to production

## Support

If you encounter any issues:
1. Check the backend console for error messages
2. Verify the migration ran successfully
3. Ensure all model files are updated
4. Restart both backend and frontend servers
