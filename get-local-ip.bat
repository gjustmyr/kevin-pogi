@echo off
echo ========================================
echo   Your Computer's IP Address
echo ========================================
echo.
echo Use this IP address on your phone (same WiFi only):
echo.
ipconfig | findstr /i "IPv4"
echo.
echo Example: If IP is 192.168.1.100
echo Access on phone: http://192.168.1.100:3000
echo.
pause
