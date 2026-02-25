#!/bin/bash

# ============================================
# GAN Attacks Analyzer - PM2 Start Script
# Author: Selbi Weliyyewa
# ============================================

APP_NAME="selbi-gan-attacks"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
MAGENTA='\033[0;35m'
NC='\033[0m'

echo -e "${MAGENTA}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              GAN Attacks Analyzer                             ║"
echo "║         Author: Selbi Weliyyewa                               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check pm2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Installing pm2 globally...${NC}"
    npm install -g pm2
fi

# Install dependencies if needed
if [ ! -d "$SCRIPT_DIR/backend/node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd "$SCRIPT_DIR/backend" && npm install
fi

if [ ! -d "$SCRIPT_DIR/frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd "$SCRIPT_DIR/frontend" && npm install
fi

# Stop existing processes
pm2 delete "${APP_NAME}-backend" 2>/dev/null
pm2 delete "${APP_NAME}-frontend" 2>/dev/null

# Start backend
echo -e "${GREEN}Starting backend on port 7005...${NC}"
cd "$SCRIPT_DIR/backend"
pm2 start npm --name "${APP_NAME}-backend" -- start

# Start frontend
echo -e "${GREEN}Starting frontend on port 7006...${NC}"
cd "$SCRIPT_DIR/frontend"
pm2 start npm --name "${APP_NAME}-frontend" -- run dev

pm2 save --force 2>/dev/null

echo ""
echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Application is running with PM2!                            ║"
echo "║                                                              ║"
echo "║  Frontend: http://localhost:7006                             ║"
echo "║  Backend:  http://localhost:7005                             ║"
echo "║                                                              ║"
echo "║  PM2: pm2 status | pm2 logs | pm2 stop all                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

pm2 status
