# Fix Academic Year Error - Do This Now! 🚨

## The Error You're Seeing:
```
Unknown column 'academic_years.is_archived' in 'where clause'
```

## Why It Happens:
The database table is missing the `is_archived` column.

## Fix It Now - Choose ONE Method:

---

## ⭐ METHOD 1: Use phpMyAdmin (EASIEST)

1. **Open phpMyAdmin** in your browser (usually http://localhost/phpmyadmin)

2. **Click on `database_cs`** database in the left sidebar

3. **Click "SQL" tab** at the top

4. **Copy and paste this SQL:**
   ```sql
   ALTER TABLE `academic_years` 
   ADD COLUMN `is_archived` TINYINT(1) NOT NULL DEFAULT 0 
   AFTER `is_active`;

   CREATE INDEX `idx_is_archived` ON `academic_years` (`is_archived`);

   UPDATE `academic_years` SET `is_archived` = 0;
   ```

5. **Click "Go" button**

6. **You should see:** "Query executed successfully"

7. **Restart your backend server** (Ctrl+C then `npm start`)

8. **Done!** ✅

---

## METHOD 2: Use Node.js Script

1. **Open terminal in backend folder:**
   ```bash
   cd backend
   ```

2. **Run the migration:**
   ```bash
   node run-migration-add-is-archived.js
   ```

3. **Restart backend server**

---

## METHOD 3: Use MySQL Command Line

1. **Open MySQL command line**

2. **Run these commands:**
   ```sql
   USE database_cs;
   
   ALTER TABLE `academic_years` 
   ADD COLUMN `is_archived` TINYINT(1) NOT NULL DEFAULT 0 
   AFTER `is_active`;
   
   CREATE INDEX `idx_is_archived` ON `academic_years` (`is_archived`);
   
   UPDATE `academic_years` SET `is_archived` = 0;
   ```

3. **Restart backend server**

---

## How to Verify It Worked:

1. **In phpMyAdmin:**
   - Click `database_cs` database
   - Click `academic_years` table
   - Click "Structure" tab
   - You should see `is_archived` column

2. **In your application:**
   - Go to Super Admin Portal
   - Click Academic Year Management
   - No more errors! ✅

---

## After the Fix:

You'll be able to:
- ✅ Archive academic years (soft delete)
- ✅ View archived academic years
- ✅ Restore archived academic years
- ✅ All data is preserved when archiving

---

## Still Having Issues?

Make sure:
1. You're using the correct database: `database_cs`
2. Your MySQL server is running
3. You have permission to ALTER tables
4. You restarted the backend server after running the migration

---

## Quick Reference Files:

- **`RUN_THIS_IN_PHPMYADMIN.sql`** - Copy/paste SQL for phpMyAdmin
- **`backend/run-migration-add-is-archived.js`** - Node.js migration script
- **`backend/add-is-archived-column.bat`** - Windows batch file
- **`backend/migrations/add-is-archived-to-academic-years.sql`** - Raw SQL file
