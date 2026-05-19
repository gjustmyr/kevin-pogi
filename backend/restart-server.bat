@echo off
echo ========================================
echo   Restarting Backend Server
echo   With Increased Memory (4GB)
echo ========================================
echo.

echo Stopping any running Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting server with increased memory...
echo.

node --max-old-space-size=4096 index.js
