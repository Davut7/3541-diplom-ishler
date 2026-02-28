#!/bin/bash

# ============================================
# AI Firewall - Start Script
# Author: Shatlyk Rahmanov
# ============================================

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              AI Firewall - Intelligent Protection             ║"
echo "║         Author: Shatlyk Rahmanov                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"

[ ! -d "$SCRIPT_DIR/backend/node_modules" ] && cd "$SCRIPT_DIR/backend" && npm install
[ ! -d "$SCRIPT_DIR/frontend/node_modules" ] && cd "$SCRIPT_DIR/frontend" && npm install

cd "$SCRIPT_DIR/backend" && npm start &
BACKEND_PID=$!
sleep 2
cd "$SCRIPT_DIR/frontend" && npm run dev &
FRONTEND_PID=$!

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Frontend: http://localhost:7080                             ║"
echo "║  Backend:  http://localhost:7081                             ║"
echo "║  Press Ctrl+C to stop                                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
