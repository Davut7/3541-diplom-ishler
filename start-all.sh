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
echo -e "${CYAN}║                   DIPLOMA PROJECTS LAUNCHER                       ║${NC}"
echo -e "${CYAN}║                      All 9 Projects - Start                       ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}Node.js: $(node -v) | npm: $(npm -v)${NC}"
echo ""

# Store all PIDs
declare -a PIDS

# Project directories with names and ports
declare -A PROJECT_NAMES
declare -A PROJECT_FRONT_PORTS
declare -A PROJECT_BACK_PORTS

PROJECT_NAMES["batyr akyýew 1"]="Batyr - WAF Analysis"
PROJECT_NAMES["bayram gochmyradow 1"]="Bayram - Android Security"
PROJECT_NAMES["daniyar nurmedow 1"]="Daniyar - XSS Shield"
PROJECT_NAMES["dawutmuhammet begmedow 1"]="Dawutmuhammet - VirusDetect"
PROJECT_NAMES["rowshen palwanow 0"]="Rowshen - KeyGuard"
PROJECT_NAMES["selbi weliyyewa 1"]="Selbi - GAN Security"
PROJECT_NAMES["shanur gulmyradow 0"]="Shanur - Wireshark Monitor"
PROJECT_NAMES["shatlyk rahmanov 0"]="Shatlyk - AI Firewall"
PROJECT_NAMES["suleyman akmuhammedow 0"]="Suleyman - OSINT.AI"

PROJECT_FRONT_PORTS["batyr akyýew 1"]=7010
PROJECT_FRONT_PORTS["bayram gochmyradow 1"]=7020
PROJECT_FRONT_PORTS["daniyar nurmedow 1"]=7030
PROJECT_FRONT_PORTS["dawutmuhammet begmedow 1"]=7040
PROJECT_FRONT_PORTS["rowshen palwanow 0"]=7050
PROJECT_FRONT_PORTS["selbi weliyyewa 1"]=7060
PROJECT_FRONT_PORTS["shanur gulmyradow 0"]=7070
PROJECT_FRONT_PORTS["shatlyk rahmanov 0"]=7080
PROJECT_FRONT_PORTS["suleyman akmuhammedow 0"]=7090

PROJECT_BACK_PORTS["batyr akyýew 1"]=7011
PROJECT_BACK_PORTS["bayram gochmyradow 1"]=7021
PROJECT_BACK_PORTS["daniyar nurmedow 1"]=7031
PROJECT_BACK_PORTS["dawutmuhammet begmedow 1"]=7041
PROJECT_BACK_PORTS["rowshen palwanow 0"]=7051
PROJECT_BACK_PORTS["selbi weliyyewa 1"]=7061
PROJECT_BACK_PORTS["shanur gulmyradow 0"]=7071
PROJECT_BACK_PORTS["shatlyk rahmanov 0"]=7081
PROJECT_BACK_PORTS["suleyman akmuhammedow 0"]=7091

PROJECTS=(
    "batyr akyýew 1"
    "bayram gochmyradow 1"
    "daniyar nurmedow 1"
    "dawutmuhammet begmedow 1"
    "rowshen palwanow 0"
    "selbi weliyyewa 1"
    "shanur gulmyradow 0"
    "shatlyk rahmanov 0"
    "suleyman akmuhammedow 0"
)

# ============================================
# STEP 1: Install all dependencies
# ============================================
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║              STEP 1: Installing Dependencies                      ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

install_count=0
skip_count=0

for project in "${PROJECTS[@]}"; do
    if [ ! -d "$SCRIPT_DIR/$project/backend" ] || [ ! -d "$SCRIPT_DIR/$project/frontend" ]; then
        echo -e "${RED}  ✗ $project - not found${NC}"
        continue
    fi

    need_backend=false
    need_frontend=false

    if [ ! -d "$SCRIPT_DIR/$project/backend/node_modules" ] || [ "$FORCE_INSTALL" = true ]; then
        need_backend=true
    fi

    if [ ! -d "$SCRIPT_DIR/$project/frontend/node_modules" ] || [ "$FORCE_INSTALL" = true ]; then
        need_frontend=true
    fi

    if [ "$need_backend" = true ] || [ "$need_frontend" = true ]; then
        echo -ne "${YELLOW}  Installing: ${PROJECT_NAMES[$project]}...${NC}"

        if [ "$need_backend" = true ]; then
            cd "$SCRIPT_DIR/$project/backend" && npm install --silent > /dev/null 2>&1
        fi

        if [ "$need_frontend" = true ]; then
            cd "$SCRIPT_DIR/$project/frontend" && npm install --silent > /dev/null 2>&1
        fi

        echo -e "\r${GREEN}  ✓ ${PROJECT_NAMES[$project]} - installed${NC}                    "
        ((install_count++))
    else
        echo -e "${BLUE}  ○ ${PROJECT_NAMES[$project]} - already installed${NC}"
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
echo -e "${CYAN}║              STEP 2: Starting All Servers                         ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

for project in "${PROJECTS[@]}"; do
    if [ ! -d "$SCRIPT_DIR/$project/backend" ] || [ ! -d "$SCRIPT_DIR/$project/frontend" ]; then
        continue
    fi

    front_port=${PROJECT_FRONT_PORTS[$project]}
    back_port=${PROJECT_BACK_PORTS[$project]}
    name=${PROJECT_NAMES[$project]}

    # Start backend
    cd "$SCRIPT_DIR/$project/backend" && npm start > /dev/null 2>&1 &
    PIDS+=($!)

    # Start frontend
    cd "$SCRIPT_DIR/$project/frontend" && npm run dev > /dev/null 2>&1 &
    PIDS+=($!)

    echo -e "${GREEN}  ✓ ${name}${NC} - :${front_port} | :${back_port}"
done

# Wait for servers to start
echo ""
echo -ne "${YELLOW}  Waiting for servers to start...${NC}"
sleep 3
echo -e "\r${GREEN}  All servers started!                ${NC}"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                    ALL PROJECTS RUNNING!                          ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  #   Project                      Frontend    Backend            ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  1.  Batyr - WAF Analysis         :7010       :7011              ║${NC}"
echo -e "${CYAN}║  2.  Bayram - Android Security    :7020       :7021              ║${NC}"
echo -e "${CYAN}║  3.  Daniyar - XSS Shield         :7030       :7031              ║${NC}"
echo -e "${CYAN}║  4.  Dawutmuhammet - VirusDetect  :7040       :7041              ║${NC}"
echo -e "${CYAN}║  5.  Rowshen - KeyGuard           :7050       :7051              ║${NC}"
echo -e "${CYAN}║  6.  Selbi - GAN Security         :7060       :7061              ║${NC}"
echo -e "${CYAN}║  7.  Shanur - Wireshark Monitor   :7070       :7071              ║${NC}"
echo -e "${CYAN}║  8.  Shatlyk - AI Firewall        :7080       :7081              ║${NC}"
echo -e "${CYAN}║  9.  Suleyman - OSINT.AI          :7090       :7091              ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  Press Ctrl+C to stop all servers                                ║${NC}"
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
    for port in 7010 7011 7020 7021 7030 7031 7040 7041 7050 7051 7060 7061 7070 7071 7080 7081 7090 7091; do
        lsof -ti:$port 2>/dev/null | xargs kill -9 2>/dev/null
    done
    echo -e "${GREEN}All servers stopped.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for all processes
wait
