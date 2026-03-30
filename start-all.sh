#!/bin/bash

# ============================================
# Start All Diploma Projects
# ============================================

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Check for --install flag
FORCE_INSTALL=false
if [ "$1" == "--install" ] || [ "$1" == "-i" ]; then
    FORCE_INSTALL=true
fi

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                   DIPLOMA PROJECTS LAUNCHER                     ║${NC}"
echo -e "${CYAN}║                      All 9 Projects - Start                     ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}Node.js: $(node -v) | npm: $(npm -v)${NC}"
echo ""

# Store all PIDs
PIDS=()

# Project definitions: "dir|name|front_port|back_port"
PROJECTS=(
    "batyr akyýew 1|Batyr - WAF Analysis|7010|7011"
    "bayram gochmyradow 1|Bayram - Android Security|7020|7021"
    "daniyar nurmedow 1|Daniyar - XSS Shield|7030|7031"
    "dawutmuhammet begmedow 1|Dawutmuhammet - VirusDetect|7040|7041"
    "rowshen palwanow 0|Rowshen - KeyGuard|7050|7051"
    "selbi weliyyewa 1|Selbi - GAN Security|7060|7061"
    "shanur gulmyradow 1|Shanur - Wireshark Monitor|7070|7071"
    "shatlyk rahmanov 0|Shatlyk - AI Firewall|7080|7081"
    "suleyman akmuhammedow 0|Suleyman - OSINT.AI|7090|7091"
)

# ============================================
# STEP 1: Install all dependencies
# ============================================
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║              STEP 1: Installing Dependencies                   ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

install_count=0
skip_count=0

for entry in "${PROJECTS[@]}"; do
    IFS='|' read -r dir name front_port back_port <<< "$entry"

    if [ ! -d "$SCRIPT_DIR/$dir/backend" ] || [ ! -d "$SCRIPT_DIR/$dir/frontend" ]; then
        echo -e "${RED}  ✗ $name - not found ($dir)${NC}"
        continue
    fi

    need_backend=false
    need_frontend=false

    if [ ! -d "$SCRIPT_DIR/$dir/backend/node_modules" ] || [ "$FORCE_INSTALL" = true ]; then
        need_backend=true
    fi

    if [ ! -d "$SCRIPT_DIR/$dir/frontend/node_modules" ] || [ "$FORCE_INSTALL" = true ]; then
        need_frontend=true
    fi

    if [ "$need_backend" = true ] || [ "$need_frontend" = true ]; then
        echo -ne "${YELLOW}  Installing: ${name}...${NC}"

        if [ "$need_backend" = true ]; then
            cd "$SCRIPT_DIR/$dir/backend" && npm install --silent > /dev/null 2>&1
        fi

        if [ "$need_frontend" = true ]; then
            cd "$SCRIPT_DIR/$dir/frontend" && npm install --silent > /dev/null 2>&1
        fi

        echo -e "\r${GREEN}  ✓ ${name} - installed${NC}                    "
        ((install_count++))
    else
        echo -e "${BLUE}  ○ ${name} - already installed${NC}"
        ((skip_count++))
    fi
done

echo ""
if [ $install_count -gt 0 ]; then
    echo -e "${GREEN}Installed: $install_count projects${NC}"
fi
if [ $skip_count -gt 0 ]; then
    echo -e "${BLUE}Skipped (already installed): $skip_count projects${NC}"
fi
echo ""

# ============================================
# STEP 2: Start all projects
# ============================================
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║              STEP 2: Starting All Servers                      ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

ALL_PORTS=""

for entry in "${PROJECTS[@]}"; do
    IFS='|' read -r dir name front_port back_port <<< "$entry"

    if [ ! -d "$SCRIPT_DIR/$dir/backend" ] || [ ! -d "$SCRIPT_DIR/$dir/frontend" ]; then
        continue
    fi

    # Start backend
    cd "$SCRIPT_DIR/$dir/backend" && PORT=$back_port npm start > /dev/null 2>&1 &
    PIDS+=($!)

    # Start frontend
    cd "$SCRIPT_DIR/$dir/frontend" && npm run dev > /dev/null 2>&1 &
    PIDS+=($!)

    ALL_PORTS="$ALL_PORTS $front_port $back_port"

    echo -e "${GREEN}  ✓ ${name}${NC} - :${front_port} | :${back_port}"
done

# Wait for servers to start
echo ""
echo -ne "${YELLOW}  Waiting for servers to start...${NC}"
sleep 3
echo -e "\r${GREEN}  All servers started!                ${NC}"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                    ALL PROJECTS RUNNING!                        ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  #   Project                      Frontend    Backend          ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  1.  Batyr - WAF Analysis         :7010       :7011            ║${NC}"
echo -e "${CYAN}║  2.  Bayram - Android Security    :7020       :7021            ║${NC}"
echo -e "${CYAN}║  3.  Daniyar - XSS Shield         :7030       :7031            ║${NC}"
echo -e "${CYAN}║  4.  Dawutmuhammet - VirusDetect  :7040       :7041            ║${NC}"
echo -e "${CYAN}║  5.  Rowshen - KeyGuard           :7050       :7051            ║${NC}"
echo -e "${CYAN}║  6.  Selbi - GAN Security         :7060       :7061            ║${NC}"
echo -e "${CYAN}║  7.  Shanur - Wireshark Monitor   :7070       :7071            ║${NC}"
echo -e "${CYAN}║  8.  Shatlyk - AI Firewall        :7080       :7081            ║${NC}"
echo -e "${CYAN}║  9.  Suleyman - OSINT.AI          :7090       :7091            ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  Press Ctrl+C to stop all servers                              ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}Stopping all servers...${NC}"
    for pid in "${PIDS[@]}"; do
        kill $pid 2>/dev/null
    done
    # Kill remaining node processes on our ports
    for port in $ALL_PORTS; do
        lsof -ti:$port 2>/dev/null | xargs kill -9 2>/dev/null
    done
    echo -e "${GREEN}All servers stopped.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for all processes
wait
