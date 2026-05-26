# Faculty Account Management - Soft Delete Implementation

## Overview
Implement a comprehensive faculty account management system with soft deletion (disable) functionality and a separate "Disabled Accounts" tab for permanent deletion.

## Requirements

### 1. No Direct Deletion
- Remove the direct "Delete" button from the main faculty list
- Replace with "Disable Account" functionality
- Disabling sets `is_active = false` in the database

### 2. New "Disabled Accounts" Tab
- Add a new tab next to "Add Faculty" button
- Shows only disabled faculty members (`is_active = false`)
- Provides option to:
  - **Restore** account (set `is_active = true`)
  - **Permanently Delete** account (actual database deletion)

### 3. Visibility Filters
- **Main Faculty List**: Show only active faculty (`is_active = true`)
- **Disabled Accounts Tab**: Show only disabled faculty (`is_active = false`)
- Disabled faculty are automatically hidden from dean's view
- Disabled faculty cannot login

### 4. Permanent Deletion
- Only available in "Disabled Accounts" tab
- Requires confirmation
- Permanently removes faculty and associated user account from database

## Database Changes

### Add `is_active` Column to Faculty Table
```sql
ALTER TABLE faculties 
ADD COLUMN is_active BOOLEAN DEFAULT true 
COMMENT 'Account status: true=active, false=disabled';
```

### Update User Table Status
When faculty is disabled, also disable the associated user account:
```sql
UPDATE users SET is_active = false WHERE user_id = ?;
```

## Backend Changes

### 1. Update Faculty Model
- Add `is_active` field (BOOLEAN, default: true)

### 2. Update Faculty Controller
- **GET /api/dean/faculty**: Filter by `is_active = true`
- **GET /api/dean/faculty/disabled**: New endpoint for disabled faculty
- **PUT /api/dean/faculty/:id/disable**: Disable faculty account
- **PUT /api/dean/faculty/:id/restore**: Restore disabled account
- **DELETE /api/dean/faculty/:id**: Permanent deletion (only for disabled accounts)

### 3. Update Auth Middleware
- Check `is_active` status during login
- Block login for disabled accounts

## Frontend Changes

### 1. Faculty Management Component
- Remove "Delete" button from main list
- Add "Disable Account" button
- Add "Disabled Accounts" tab
- Implement tab switching logic
- Add restore and permanent delete functions

### 2. UI Layout
```
[Add Faculty] [Disabled Accounts (5)]
```

### 3. Main Faculty List Actions
- Edit
- Reset Password
- Download PDS
- Download Profile
- **Disable Account** (new)

### 4. Disabled Accounts Tab Actions
- **Restore Account**
- **Permanently Delete**

## Implementation Steps

1. ✅ Create migration script for `is_active` column
2. ✅ Update faculty model
3. ✅ Update backend controller with new endpoints
4. ✅ Update frontend service
5. ✅ Update frontend component (add tab, update UI)
6. ✅ Update auth middleware to check is_active
7. ✅ Test all functionality

## Security Considerations

- Only deans can disable/restore/delete faculty
- Disabled faculty cannot login
- Permanent deletion requires double confirmation
- Audit log for account status changes (future enhancement)

## User Experience

### Disabling an Account
1. Dean clicks "Disable Account" on faculty member
2. Confirmation dialog appears
3. Account is disabled (not deleted)
4. Faculty disappears from main list
5. Faculty appears in "Disabled Accounts" tab

### Restoring an Account
1. Dean opens "Disabled Accounts" tab
2. Clicks "Restore" on faculty member
3. Confirmation dialog appears
4. Account is restored
5. Faculty reappears in main list

### Permanent Deletion
1. Dean opens "Disabled Accounts" tab
2. Clicks "Permanently Delete" on faculty member
3. Strong warning dialog appears
4. Dean confirms deletion
5. Faculty and user account are permanently removed

## Benefits

- **Safety**: No accidental deletions
- **Reversibility**: Disabled accounts can be restored
- **Clean UI**: Disabled accounts don't clutter main list
- **Compliance**: Maintains data integrity
- **Audit Trail**: Can track disabled accounts before permanent deletion
