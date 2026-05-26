@echo off
echo ========================================
echo  Add is_archived Column Migration
echo ========================================
echo.
echo This will add the is_archived column to the academic_years table
echo for soft delete (archive) functionality.
echo.
pause

node run-migration-add-is-archived.js

echo.
echo ========================================
echo  Migration Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Restart your backend server (if running)
echo 2. The Academic Year and Archived Years sections should now work
echo.
pause
