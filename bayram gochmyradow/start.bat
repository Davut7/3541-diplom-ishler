@echo off
chcp 65001 >nul
title Android Security Analyzer

echo ╔═══════════════════════════════════════════════════════╗
echo ║        Android Security Analyzer                      ║
echo ║        Starting Application...                        ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%

:: Check npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm found: %NPM_VERSION%
echo.

:: Get script directory
set SCRIPT_DIR=%~dp0

:: Install backend dependencies
echo Installing backend dependencies...
cd /d "%SCRIPT_DIR%backend"
if not exist "node_modules" (
    call npm install
) else (
    echo [OK] Backend dependencies already installed
)

:: Install frontend dependencies
echo.
echo Installing frontend dependencies...
cd /d "%SCRIPT_DIR%frontend"
if not exist "node_modules" (
    call npm install
) else (
    echo [OK] Frontend dependencies already installed
)

echo.
echo Starting servers...
echo.

:: Start backend in new window
cd /d "%SCRIPT_DIR%backend"
start "Backend Server" cmd /c "npm start"

:: Wait for backend
timeout /t 2 /nobreak >nul

:: Start frontend in new window
cd /d "%SCRIPT_DIR%frontend"
start "Frontend Server" cmd /c "npm run dev"

echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║  Application is running!                              ║
echo ║                                                       ║
echo ║  Frontend: http://localhost:5173                      ║
echo ║  Backend:  http://localhost:3000                      ║
echo ║                                                       ║
echo ║  Close the server windows to stop                     ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

:: Open browser
timeout /t 3 /nobreak >nul
start http://localhost:5173

pause
