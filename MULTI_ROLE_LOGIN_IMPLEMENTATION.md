# Multi-Role Login Implementation

## Overview
This system allows users to have multiple accounts with the same email address (up to 3: organization, faculty, and dean). When a user logs in with an email that has multiple accounts, the backend automatically detects this and prompts the user to select which account they want to access.

## How It Works

### Backend Detection (Automatic)
1. User enters email and password
2. Backend checks if multiple accounts exist with that email
3. If multiple accounts found:
   - Backend returns `multipleAccounts: true` with `availableRoles` array
   - No token is issued yet
4. If single account found:
   - Backend proceeds with normal login
   - Token is issued and user is logged in

### Frontend Flow (Two-Step)
1. **Initial Login Attempt**
   - User enters email and password
   - Frontend sends request to backend without role parameter
   
2. **Multiple Accounts Detected**
   - Backend responds with `multipleAccounts: true` and `availableRoles`
   - Frontend shows role selector dropdown dynamically
   - User selects their desired role
   
3. **Second Login Attempt**
   - User clicks login again with role selected
   - Frontend sends email, password, AND role
   - Backend authenticates and issues token for selected role

## Files Modified

### Backend
- **`backend/controllers/auth.controller.js`**
  - Modified `login()` function to detect multiple accounts
  - Returns special response when multiple accounts found
  - Validates role selection on second attempt

### Frontend
- **`client/src/app/shared/interface/auth.interface.ts`**
  - Added `MultipleAccountsResponse` interface
  - Kept `LoginCredentials` with optional `role` field

- **`client/src/app/services/auth/auth.ts`**
  - Updated `login()` to handle multiple accounts response
  - Only sets token/user when normal login succeeds
  - Skips navigation when multiple accounts detected

- **`client/src/app/features/auth/login/login.ts`**
  - Added `showRoleSelector` signal (default: false)
  - Added `availableRoles` signal (empty array)
  - Modified `onSubmit()` to detect multiple accounts response
  - Shows role selector only when backend indicates multiple accounts

- **`client/src/app/features/auth/login/login.html`**
  - Removed always-visible role dropdown
  - Added conditional role selector with `@if (showRoleSelector())`
  - Role selector only appears after backend detects multiple accounts
  - Shows available roles dynamically from backend response

## User Experience

### Single Account User
1. Enter email and password
2. Click "Sign In"
3. Immediately logged in and redirected to dashboard

### Multiple Account User
1. Enter email and password
2. Click "Sign In"
3. See message: "Multiple accounts found. Please select a role."
4. Role selector appears with available roles (e.g., Dean, Faculty)
5. Select desired role
6. Click "Sign In" again
7. Logged in and redirected to appropriate dashboard

## Password Synchronization
- All accounts with the same email should have the same password
- Use `backend/sync-email-passwords.js` to sync passwords across accounts
- This ensures users don't get confused about which password to use

## Database Schema
- `users` table has composite unique constraint on `(email, role)`
- Same email can exist multiple times with different roles
- Maximum 3 accounts per email: organization, faculty, dean

## Security Notes
- Password verification happens on first attempt
- Invalid credentials are rejected immediately
- Role selection only happens after password is verified
- JWT token includes role-specific IDs (faculty_id, dean_id, etc.)
- Token expires after 24 hours

## Testing
To test with a multi-role account:
1. Create two accounts with same email but different roles
2. Sync their passwords using `sync-email-passwords.js`
3. Try logging in with that email
4. Verify role selector appears
5. Select a role and complete login
6. Verify correct dashboard is shown

## Example Response Flow

### First Request (No Role)
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "multipleAccounts": true,
  "availableRoles": ["dean", "faculty"],
  "message": "Multiple accounts found. Please select a role."
}
```

### Second Request (With Role)
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123",
  "role": "faculty"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 33,
    "email": "user@example.com",
    "role": "faculty",
    "profile": { ... }
  },
  "redirectPath": "/faculty/dashboard"
}
```

## Status
✅ **COMPLETED** - Backend detection and frontend two-step flow fully implemented
