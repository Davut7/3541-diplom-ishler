#!/bin/bash

# ============================================
# Android Security Analyzer - Start Script
# ============================================

echo "╔═══════════════════════════════════════════════════════╗"
echo "║        Android Security Analyzer                      ║"
echo "║        Starting Application...                        ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed.${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js found: $(node -v)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm found: $(npm -v)${NC}"
echo ""

# Install backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd "$SCRIPT_DIR/backend"
if [ ! -d "node_modules" ]; then
    npm install
else
    echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
fi

# Install frontend dependencies
echo ""
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd "$SCRIPT_DIR/frontend"
if [ ! -d "node_modules" ]; then
    npm install
else
    echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
fi

echo ""
echo -e "${GREEN}Starting servers...${NC}"
echo ""

# Start backend server in background
cd "$SCRIPT_DIR/backend"
echo -e "${YELLOW}Starting backend server on http://localhost:3000${NC}"
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend server
cd "$SCRIPT_DIR/frontend"
echo -e "${YELLOW}Starting frontend server on http://localhost:5173${NC}"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║  Application is running!                              ║"
echo "║                                                       ║"
echo "║  Frontend: http://localhost:5173                      ║"
echo "║  Backend:  http://localhost:3000                      ║"
echo "║                                                       ║"
echo "║  Press Ctrl+C to stop all servers                     ║"
echo "╚═══════════════════════════════════════════════════════╝"

# Handle Ctrl+C
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" SIGINT SIGTERM

# Wait for processes
wait
