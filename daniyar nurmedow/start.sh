#!/bin/bash

# ============================================
# XSS Shield - Start Script
# Author: Daniyar Nurmedow
# ============================================

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              XSS Shield - Attack & Defense                    ║"
echo "║         Author: Daniyar Nurmedow                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"

# Install dependencies if needed
[ ! -d "$SCRIPT_DIR/backend/node_modules" ] && cd "$SCRIPT_DIR/backend" && npm install
[ ! -d "$SCRIPT_DIR/frontend/node_modules" ] && cd "$SCRIPT_DIR/frontend" && npm install

# Start backend
cd "$SCRIPT_DIR/backend" && npm start &
BACKEND_PID=$!

sleep 2

# Start frontend
cd "$SCRIPT_DIR/frontend" && npm run dev &
FRONTEND_PID=$!

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Frontend: http://localhost:7012                             ║"
echo "║  Backend:  http://localhost:7011                             ║"
echo "║  Press Ctrl+C to stop                                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
