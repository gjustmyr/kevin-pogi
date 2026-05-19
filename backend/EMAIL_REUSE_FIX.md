# Email Reuse Across Roles - Fix Documentation

## Problem
When trying to create a faculty account with an email that's already used by a dean account, the system threw this error:

```
Error: Duplicate entry 'philip.geneta@g.batstate-u.edu.ph' for key 'email'
```

## Root Cause
The `users` table had a **unique constraint on the email column**, which prevented the same email from being used for multiple accounts, even if they had different roles.

However, the business logic (implemented in `email-validator.js`) was designed to **allow email reuse across roles**:
- 1 email can be used for up to **3 accounts**
- Maximum 1 organization account
- Maximum 1 faculty account  
- Maximum 1 dean account

This created a conflict between the database schema and the business logic.

## Solution
Changed the database constraint from:
- ❌ **Old**: Unique constraint on `email` column (prevents any email duplication)
- ✅ **New**: Composite unique constraint on `(email, role)` (allows same email for different roles)

## What Changed

### 1. User Model (`models/user.model.js`)
**Before:**
```javascript
email: {
  type: Sequelize.STRING,
  allowNull: false,
  unique: true,  // ❌ Prevents email reuse
  validate: {
    isEmail: true,
  },
}
```

**After:**
```javascript
email: {
  type: Sequelize.STRING,
  allowNull: false,
  // Removed unique: true to allow email reuse
  validate: {
    isEmail: true,
  },
},
// ... in model options:
indexes: [
  {
    unique: true,
    fields: ['email', 'role'],  // ✅ Allows same email for different roles
    name: 'unique_email_role'
  }
]
```

### 2. Database Schema
**Migration Applied:**
```sql
-- Remove old constraint
ALTER TABLE `users` DROP INDEX `email`;

-- Add new composite constraint
ALTER TABLE `users` ADD UNIQUE INDEX `unique_email_role` (`email`, `role`);
```

## How It Works Now

### Example Scenarios

#### ✅ Allowed: Same email, different roles
```javascript
// User 1: Dean account
{ email: 'john@example.com', role: 'dean' }

// User 2: Faculty account (ALLOWED - different role)
{ email: 'john@example.com', role: 'faculty' }

// User 3: Organization account (ALLOWED - different role)
{ email: 'john@example.com', role: 'organization' }
```

#### ❌ Blocked: Same email, same role
```javascript
// User 1: Faculty account
{ email: 'john@example.com', role: 'faculty' }

// User 2: Another faculty account (BLOCKED - duplicate role)
{ email: 'john@example.com', role: 'faculty' }
// Error: Duplicate entry for key 'unique_email_role'
```

#### ❌ Blocked: Exceeds 3 account limit
```javascript
// Already has 3 accounts (org, faculty, dean)
// Trying to create a 4th account (admin) - BLOCKED by email-validator.js
```

## Validation Flow

### 1. Application-Level Validation (`email-validator.js`)
- Checks if email already has an account with the same role
- Checks if email has reached the 3-account limit
- Returns helpful error messages

### 2. Database-Level Validation (Composite Unique Index)
- Enforces uniqueness of `(email, role)` combination
- Prevents duplicate role accounts at the database level
- Acts as a safety net if application validation is bypassed

## Testing the Fix

### Test Case 1: Create faculty with dean's email
```bash
# Philip is already a dean with philip.geneta@g.batstate-u.edu.ph
# Now create a faculty account with the same email
POST /api/dean/faculty
{
  "email": "philip.geneta@g.batstate-u.edu.ph",
  "first_name": "Philip",
  "last_name": "Geneta",
  "employee_id": "12345",
  ...
}

# Expected: ✅ Success - Faculty account created
```

### Test Case 2: Try to create duplicate faculty
```bash
# Philip already has a faculty account
# Try to create another faculty account with same email
POST /api/dean/faculty
{
  "email": "philip.geneta@g.batstate-u.edu.ph",
  "first_name": "Philip",
  "last_name": "Geneta",
  "employee_id": "67890",
  ...
}

# Expected: ❌ Error - "This email is already used for a faculty account"
```

### Test Case 3: Verify 3-account limit
```bash
# Email already has: 1 org + 1 faculty + 1 dean = 3 accounts
# Try to create an admin account
POST /api/auth/create-admin
{
  "email": "philip.geneta@g.batstate-u.edu.ph",
  ...
}

# Expected: ❌ Error - "This email has reached the maximum limit of 3 accounts"
```

## Migration Instructions

### Automatic Migration (Recommended)
```bash
cd backend
node run-email-constraint-migration.js
```

The script will:
1. Check current constraints
2. Detect potential conflicts
3. Apply the migration safely
4. Verify the changes

### Manual Migration (If needed)
```bash
# Connect to MySQL
mysql -u root -p

# Use your database
USE your_database_name;

# Run migration
ALTER TABLE `users` DROP INDEX `email`;
ALTER TABLE `users` ADD UNIQUE INDEX `unique_email_role` (`email`, `role`);

# Verify
SHOW INDEX FROM `users` WHERE Key_name = 'unique_email_role';
```

## Files Modified

1. **`models/user.model.js`** - Updated email constraint
2. **`migrations/fix-email-unique-constraint.sql`** - SQL migration script
3. **`run-email-constraint-migration.js`** - Automated migration script
4. **`EMAIL_REUSE_FIX.md`** - This documentation

## Related Files (No changes needed)

- **`utils/email-validator.js`** - Already implements the 3-account limit logic
- **`controllers/dean-faculty.controller.js`** - Already uses email validator
- **`controllers/dean-organization.controller.js`** - Already uses email validator

## Rollback (If needed)

If you need to revert to the old behavior:

```sql
-- Remove composite constraint
ALTER TABLE `users` DROP INDEX `unique_email_role`;

-- Add back simple unique constraint
ALTER TABLE `users` ADD UNIQUE INDEX `email` (`email`);
```

**Warning:** This will prevent email reuse and may cause issues if users already have multiple accounts with the same email.

## Benefits

1. ✅ **Flexibility**: Users can have multiple roles with one email
2. ✅ **Consistency**: Database schema matches business logic
3. ✅ **Safety**: Composite constraint prevents true duplicates
4. ✅ **Validation**: Two-layer validation (app + database)
5. ✅ **User-Friendly**: One email for all university roles

## Common Use Cases

### University Staff with Multiple Roles
```
Dr. John Smith (john.smith@university.edu)
├── Dean Account (manages College of Engineering)
├── Faculty Account (teaches courses)
└── Organization Adviser (advises student org)
```

### Department Head
```
Prof. Jane Doe (jane.doe@university.edu)
├── Dean Account (department head)
└── Faculty Account (teaching duties)
```

## Troubleshooting

### Issue: Migration fails with "Duplicate key name"
**Solution:** The migration was already applied. Check with:
```sql
SHOW INDEX FROM users WHERE Key_name = 'unique_email_role';
```

### Issue: Still getting duplicate email error
**Solution:** 
1. Restart the backend server to reload the model
2. Check if migration was applied successfully
3. Verify the email-validator is being called in the controller

### Issue: Can't create account even with different role
**Solution:**
1. Check if email already has 3 accounts (max limit)
2. Run diagnostic: `node fix-dean-profile-issue.js`
3. Check backend logs for detailed error messages

## Next Steps

After applying this fix:
1. ✅ Restart the backend server
2. ✅ Test creating faculty with dean's email
3. ✅ Verify error messages for duplicate roles
4. ✅ Update any documentation about email usage
5. ✅ Inform users about the email reuse capability
