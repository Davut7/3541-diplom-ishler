#!/bin/bash

# ============================================
# WAF Behavioral Analysis - Start Script
# Author: Batyr Akyýew
# ============================================

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       WAF with Behavioral Analysis                           ║"
echo "║         Author: Batyr Akyýew                                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"

[ ! -d "$SCRIPT_DIR/backend/node_modules" ] && cd "$SCRIPT_DIR/backend" && npm install
[ ! -d "$SCRIPT_DIR/frontend/node_modules" ] && cd "$SCRIPT_DIR/frontend" && npm install
[ ! -d "$SCRIPT_DIR/target-site/node_modules" ] && cd "$SCRIPT_DIR/target-site" && npm install

# 1. Start vulnerable target site
cd "$SCRIPT_DIR/target-site" && npm start &
TARGET_PID=$!
sleep 1

# 2. Start WAF backend
cd "$SCRIPT_DIR/backend" && npm start &
BACKEND_PID=$!
sleep 2

# 3. Start WAF frontend
cd "$SCRIPT_DIR/frontend" && npm run dev &
FRONTEND_PID=$!

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Target Site (vulnerable): http://localhost:7012              ║"
echo "║  WAF Frontend:             http://localhost:7010              ║"
echo "║  WAF Backend:              http://localhost:7011              ║"
echo "║                                                               ║"
echo "║  1. Open target site → try attacks                            ║"
echo "║  2. Open WAF → see attacks blocked in real-time               ║"
echo "║  Press Ctrl+C to stop                                         ║"
echo "╚══════════════════════════════════════════════════════════════╝"

trap "kill $TARGET_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
