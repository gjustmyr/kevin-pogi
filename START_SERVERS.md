# How to Start the Application

## Problem
Ang webpage ay nag-loading lang kasi hindi running ang Angular dev server.

## Solution

Kailangan mong i-start ang **BOTH** backend at frontend servers:

### 1. Start Backend Server (Port 3000)

Open a terminal at run:
```cmd
cd backend
npm start
```

**Expected output:**
```
Server is running on port 3000
Database connection successful!
Database tables synced!
```

### 2. Start Frontend Server (Port 4200)

Open **ANOTHER** terminal at run:
```cmd
cd client
ng serve
```

or

```cmd
cd client
npm start
```

**Expected output:**
```
✔ Browser application bundle generation complete.
Initial chunk files | Names         |  Raw size
...
** Angular Live Development Server is listening on localhost:4200 **
```

### 3. Open Browser

Buksan ang browser at pumunta sa:
```
http://localhost:4200
```

## Important Notes

1. **Kailangan ng 2 terminals** - Isa para sa backend, isa para sa frontend
2. **Backend port:** 3000
3. **Frontend port:** 4200
4. **Huwag i-close ang terminals** habang gumagamit ng application
5. Kung may error, tingnan ang terminal output para sa error messages

## Troubleshooting

### Port already in use
Kung may error na "port already in use":

**For backend (port 3000):**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

**For frontend (port 4200):**
```cmd
netstat -ano | findstr :4200
taskkill /PID <PID_NUMBER> /F
```

### Angular CLI not found
Kung may error na "ng: command not found":
```cmd
npm install -g @angular/cli
```

### Dependencies not installed
Kung may error about missing modules:
```cmd
cd backend
npm install

cd ../client
npm install
```

## Quick Start Script

Para mas mabilis, pwede mong gamitin ang script na ito (save as `start-dev.bat`):

```batch
@echo off
echo Starting Backend Server...
start cmd /k "cd backend && npm start"

timeout /t 3

echo Starting Frontend Server...
start cmd /k "cd client && ng serve"

echo.
echo Servers are starting...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:4200
echo.
echo Press any key to exit (servers will continue running)
pause
```

Run: `start-dev.bat`
