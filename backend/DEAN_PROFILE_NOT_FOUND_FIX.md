# Dean Profile Not Found - Troubleshooting Guide

## Problem
When accessing `/api/dean/requirements/statistics`, you get:
```json
{"message": "Dean profile not found"}
```

## Root Cause
The JWT token contains a `user_id` that doesn't match any record in the `deans` table. This typically happens when:

1. **Stale JWT Token**: The user logged in before their dean profile was created
2. **Token Mismatch**: The token has the wrong `user_id`
3. **Missing Dean Profile**: The user account exists but the dean profile doesn't

## Quick Fix

### Solution 1: Log Out and Log Back In (Most Common)
1. Log out from the application
2. Log back in with your dean credentials
3. This will generate a fresh JWT token with the correct `user_id`

### Solution 2: Check Your Token
Run this command to inspect your JWT token:
```bash
node debug-dean-token.js "YOUR_JWT_TOKEN_HERE"
```

The token should contain:
```json
{
  "user_id": 22,
  "email": "dean@example.com",
  "role": "dean",
  "dean_id": 8
}
```

### Solution 3: Verify Dean Profile Exists
Run this diagnostic script:
```bash
node check-dean-profile.js
```

This will show:
- All dean users in the system
- Which ones have profiles
- Which ones are missing profiles

## Detailed Diagnostics

### Check Backend Logs
After adding debug logging, the backend will now show:
```
🔍 getDepartmentStatistics - Looking for dean with user_id: 22
🔍 Token data: { user_id: 22, email: 'dean@example.com', role: 'dean' }
✅ Found dean: John Doe Department: College of Engineering
```

Or if there's an error:
```
❌ Dean profile not found for user_id: 22
Available dean user_ids in database:
Dean ID: 8, User ID: 22, Name: John Doe
Dean ID: 9, User ID: 29, Name: Jane Smith
```

### Check Database Directly
```sql
-- Check if user exists
SELECT * FROM users WHERE role = 'dean';

-- Check if dean profile exists
SELECT d.dean_id, d.user_id, d.first_name, d.last_name, d.department, u.email
FROM deans d
LEFT JOIN users u ON d.user_id = u.user_id;

-- Find mismatches
SELECT u.user_id, u.email, u.role
FROM users u
LEFT JOIN deans d ON u.user_id = d.user_id
WHERE u.role = 'dean' AND d.dean_id IS NULL;
```

## Prevention

### For Developers
1. Always create the dean profile immediately after creating the user account
2. Use transactions to ensure both user and profile are created together
3. Add database constraints to enforce referential integrity

### For Users
1. If you're a new dean, make sure your profile has been set up by the admin
2. After any account changes, log out and log back in
3. Clear browser cache if issues persist

## Code Changes Made

### Enhanced Error Logging
Added detailed logging to `dean-requirement.controller.js`:
- Logs the user_id being searched
- Logs all available dean profiles if not found
- Provides helpful error messages with debugging hints

### Debug Tools
Created two diagnostic scripts:
1. `check-dean-profile.js` - Checks all dean profiles
2. `debug-dean-token.js` - Inspects JWT token contents

## Related Files
- `backend/controllers/dean-requirement.controller.js` - Main controller with the fix
- `backend/controllers/auth.controller.js` - Login logic that generates tokens
- `backend/models/dean.model.js` - Dean model definition
- `backend/middleware/auth.middleware.js` - Token verification
- `backend/check-dean-profile.js` - Diagnostic script
- `backend/debug-dean-token.js` - Token debugging script

## Testing the Fix

1. Start the backend server:
```bash
cd backend
npm start
```

2. Check the console logs when accessing the statistics endpoint

3. The logs will now show exactly what's happening:
   - What user_id is being searched
   - Whether a dean profile was found
   - If not found, what dean profiles exist in the database

## Next Steps

If the issue persists after logging out and back in:
1. Run `node check-dean-profile.js` to verify the profile exists
2. Check the backend console logs for detailed error information
3. Run `node debug-dean-token.js "YOUR_TOKEN"` to inspect the token
4. Contact the system administrator if the profile is missing
