# Quick Fix Guide

## Problem: "Dean profile not found"

### Quick Solution
1. Log out from the application
2. Log back in
3. Try again

### If that doesn't work
```bash
cd backend
node check-dean-profile.js
```

---

## Problem: "Duplicate entry for key 'email'"

### Quick Solution
✅ **Already Fixed!** The database has been updated.

Same email can now be used for:
- 1 Dean account
- 1 Faculty account  
- 1 Organization account

### Verify the fix
```bash
cd backend
node -e "const db = require('./models'); db.sequelize.query('SHOW INDEX FROM users WHERE Key_name = \"unique_email_role\"').then(([r]) => { console.log(r.length > 0 ? '✅ Fix applied' : '❌ Fix not applied'); process.exit(0); });"
```

---

## Diagnostic Commands

### Check dean profiles
```bash
cd backend
node check-dean-profile.js
```

### Check email usage
```bash
cd backend
node fix-dean-profile-issue.js
```

### Inspect JWT token
```bash
cd backend
node debug-dean-token.js "YOUR_JWT_TOKEN_HERE"
```

---

## Common Issues

### Issue: Can't create faculty with dean's email
**Status:** ✅ Fixed - Now allowed

### Issue: Can't create 2 faculty accounts with same email
**Expected:** This is correct behavior - one email per role

### Issue: Backend shows "Dean profile not found"
**Solution:** Check backend logs for detailed error with user_id

---

## Files to Check

- `backend/DEAN_PROFILE_NOT_FOUND_FIX.md` - Dean profile guide
- `backend/EMAIL_REUSE_FIX.md` - Email reuse guide
- `FIXES_APPLIED.md` - Complete summary

---

## Emergency Contacts

If issues persist:
1. Check backend console logs
2. Run diagnostic scripts
3. Review error messages carefully
4. Contact system administrator
