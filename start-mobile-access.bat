@echo off
echo ========================================
echo   Mobile Access Setup
echo ========================================
echo.
echo Starting backend server and ngrok tunnel...
echo.

REM Start backend server in background
start "Backend Server" cmd /k "cd backend && node index.js"

REM Wait for server to start
echo Waiting for backend server to start...
timeout /t 5 /nobreak

echo.
echo ========================================
echo   NGROK TUNNEL STARTING...
echo ========================================
echo.
echo INSTRUCTIONS:
echo 1. Copy the HTTPS URL that appears below
echo 2. Paste it in your phone's browser
echo 3. Keep this window OPEN while using!
echo.
echo ========================================
echo.

REM Start ngrok and keep window open
ngrok http 3000

REM If ngrok closes, pause to see error
echo.
echo Ngrok stopped. Press any key to close...
pause > nul
