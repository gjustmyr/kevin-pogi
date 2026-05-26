# 🔧 FIX ACADEMIC YEAR ARCHIVE - RUN THIS NOW

## ⚠️ Current Problem
You're seeing this error:
```
Unknown column 'academic_years.is_archived' in 'where clause'
```

## ✅ Solution (Takes 1 Minute)

### Step 1: Run the Migration
Open Command Prompt and run:
```cmd
cd c:\Users\Kevin Dizon\kevin-pogi\backend
add-is-archived-column.bat
```

**OR** just double-click this file:
```
c:\Users\Kevin Dizon\kevin-pogi\backend\add-is-archived-column.bat
```

### Step 2: Restart Backend
After the migration completes, restart your backend server:
```cmd
cd c:\Users\Kevin Dizon\kevin-pogi\backend
node index.js
```

### Step 3: Test
1. Open Super Admin Portal
2. Look for TWO menu items:
   - **Academic Year** (shows active years)
   - **Archived Years** (shows archived years)
3. Try archiving a year
4. Check it appears in "Archived Years"
5. Try restoring it
6. Check it appears back in "Academic Year"

## ✅ Done!
The archive feature will now work perfectly with separate sections for active and archived academic years.

---

## What This Does
- Adds `is_archived` column to `academic_years` table
- Enables soft delete (archive) functionality
- Preserves all data when archiving
- Allows restoring archived years

## Need Help?
See `ACADEMIC_YEAR_ARCHIVE_SETUP.md` for detailed documentation.
