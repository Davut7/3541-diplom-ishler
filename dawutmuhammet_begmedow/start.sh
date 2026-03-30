#!/bin/bash

# VirusDetect Pro - Startup Script
# Author: Dawutmuhammet Begmedow

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "=========================================="
echo "       VirusDetect Pro"
echo "  Advanced Malware Detection Tool"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}Node.js version:${NC} $(node -v)"
echo -e "${GREEN}npm version:${NC} $(npm -v)"
echo ""

# Install dependencies if needed
echo -e "${YELLOW}Checking dependencies...${NC}"

if [ ! -d "$SCRIPT_DIR/backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd "$SCRIPT_DIR/backend" && npm install
fi

if [ ! -d "$SCRIPT_DIR/frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd "$SCRIPT_DIR/frontend" && npm install
fi

echo ""
echo -e "${GREEN}Starting servers...${NC}"
echo ""

# Start backend server
echo -e "${YELLOW}Starting Backend Server (Port 7041)...${NC}"
cd "$SCRIPT_DIR/backend" && npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start frontend server
echo -e "${YELLOW}Starting Frontend Server (Port 7040)...${NC}"
cd "$SCRIPT_DIR/frontend" && npm run dev &
FRONTEND_PID=$!

echo ""
echo "=========================================="
echo -e "${GREEN}Servers are running!${NC}"
echo ""
echo -e "Backend:  ${GREEN}http://localhost:7041${NC}"
echo -e "Frontend: ${GREEN}http://localhost:7040${NC}"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "=========================================="

# Handle shutdown
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}Servers stopped.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for processes
wait
