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
[ ! -d "$SCRIPT_DIR/target-site/node_modules" ] && cd "$SCRIPT_DIR/target-site" && npm install

# Start backend
cd "$SCRIPT_DIR/backend" && npm start &
BACKEND_PID=$!

# Start target site
cd "$SCRIPT_DIR/target-site" && npm start &
TARGET_PID=$!

sleep 2

# Start frontend
cd "$SCRIPT_DIR/frontend" && npm run dev &
FRONTEND_PID=$!

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Frontend:    http://localhost:7030                          ║"
echo "║  Backend:     http://localhost:7031                          ║"
echo "║  Target Site: http://localhost:7032                          ║"
echo "║  Press Ctrl+C to stop                                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"

trap "kill $BACKEND_PID $FRONTEND_PID $TARGET_PID 2>/dev/null; exit" INT TERM
wait
