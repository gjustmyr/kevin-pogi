@echo off
echo ========================================
echo Starting Development Servers
echo ========================================
echo.

echo [1/2] Starting Backend Server (Port 3000)...
start "Backend Server" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Server (Port 4200)...
start "Frontend Server" cmd /k "cd client && ng serve"

echo.
echo ========================================
echo Servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:4200
echo.
echo Two terminal windows will open.
echo DO NOT close them while using the app.
echo.
echo Wait for "Angular Live Development Server is listening"
echo then open: http://localhost:4200
echo.
pause
