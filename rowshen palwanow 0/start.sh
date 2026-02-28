#!/bin/bash

# ============================================
# KeyGuard - Start Script
# Author: Rowshen Orazmuhammedow
# ============================================

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              KeyGuard - Keylogger Detection                   ║"
echo "║         Author: Rowshen Orazmuhammedow                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Install dependencies if needed
[ ! -d "$SCRIPT_DIR/node_modules" ] && echo "Installing root dependencies..." && cd "$SCRIPT_DIR" && npm install
[ ! -d "$SCRIPT_DIR/frontend/node_modules" ] && echo "Installing frontend dependencies..." && cd "$SCRIPT_DIR/frontend" && npm install

if [ "$1" == "electron" ]; then
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║  Starting in ELECTRON Desktop Mode                           ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""

    # Build frontend first
    echo "Building frontend for production..."
    cd "$SCRIPT_DIR/frontend" && npm run build

    # Start Electron
    echo ""
    echo "Launching KeyGuard Desktop App..."
    cd "$SCRIPT_DIR" && npm run electron

elif [ "$1" == "electron:dev" ]; then
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║  Starting in ELECTRON Development Mode                       ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""

    # Start frontend dev server
    cd "$SCRIPT_DIR/frontend" && npm run dev &
    FRONTEND_PID=$!
    sleep 3

    # Start Electron in dev mode
    cd "$SCRIPT_DIR" && npm run electron:dev &
    ELECTRON_PID=$!

    trap "kill $FRONTEND_PID $ELECTRON_PID 2>/dev/null; exit" INT TERM
    wait

else
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║  Starting in WEB Development Mode                            ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    echo "  Frontend: http://localhost:7050"
    echo ""
    echo "  To run as desktop app:"
    echo "    ./start.sh electron      - Production mode"
    echo "    ./start.sh electron:dev  - Development mode"
    echo ""
    echo "  Press Ctrl+C to stop"
    echo ""

    # Start frontend in development mode
    cd "$SCRIPT_DIR/frontend" && npm run dev
fi
