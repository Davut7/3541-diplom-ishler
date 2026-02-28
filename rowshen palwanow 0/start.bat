@echo off
chcp 65001 >nul

REM ============================================
REM KeyGuard - Start Script for Windows
REM Author: Rowshen Orazmuhammedow
REM ============================================

set SCRIPT_DIR=%~dp0

echo ╔══════════════════════════════════════════════════════════════╗
echo ║              KeyGuard - Keylogger Detection                   ║
echo ║         Author: Rowshen Orazmuhammedow                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Install dependencies if needed
if not exist "%SCRIPT_DIR%node_modules" (
    echo Installing root dependencies...
    cd /d "%SCRIPT_DIR%"
    call npm install
)

if not exist "%SCRIPT_DIR%frontend\node_modules" (
    echo Installing frontend dependencies...
    cd /d "%SCRIPT_DIR%frontend"
    call npm install
)

if "%1"=="electron" (
    echo ╔══════════════════════════════════════════════════════════════╗
    echo ║  Starting in ELECTRON Desktop Mode                           ║
    echo ╚══════════════════════════════════════════════════════════════╝
    echo.

    echo Building frontend for production...
    cd /d "%SCRIPT_DIR%frontend"
    call npm run build

    echo.
    echo Launching KeyGuard Desktop App...
    cd /d "%SCRIPT_DIR%"
    call npm run electron
    goto end
)

if "%1"=="electron:dev" (
    echo ╔══════════════════════════════════════════════════════════════╗
    echo ║  Starting in ELECTRON Development Mode                       ║
    echo ╚══════════════════════════════════════════════════════════════╝
    echo.

    echo Starting frontend dev server...
    start "Frontend" cmd /c "cd /d "%SCRIPT_DIR%frontend" && npm run dev"
    timeout /t 3 >nul

    echo Starting Electron in dev mode...
    cd /d "%SCRIPT_DIR%"
    call npm run electron:dev
    goto end
)

REM Default: web development mode
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  Starting in WEB Development Mode                            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo   Frontend: http://localhost:7050
echo.
echo   To run as desktop app:
echo     start.bat electron      - Production mode
echo     start.bat electron:dev  - Development mode
echo.
echo   Press Ctrl+C to stop
echo.

cd /d "%SCRIPT_DIR%frontend"
call npm run dev

:end
