#!/bin/bash

# ============================================
# Start All Diploma Projects
# ============================================

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PID_FILE="$SCRIPT_DIR/.servers.pid"
LOG_DIR="$SCRIPT_DIR/.logs"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# All ports
ALL_PORTS="7010 7011 7020 7021 7030 7031 7040 7041 7050 7051 7060 7061 7070 7071 7080 7081 7090 7091"

# Project definitions: "dir|name|front_port|back_port"
PROJECTS=(
    "batyr_akyýew|Batyr - WAF Analysis|7010|7011"
    "bayram_gochmyradow|Bayram - Android Security|7020|7021"
    "daniyar_nurmedow|Daniyar - XSS Shield|7030|7031"
    "dawutmuhammet_begmedow|Dawutmuhammet - VirusDetect|7040|7041"
    "rowshen_palwanow|Rowshen - KeyGuard|7050|7051"
    "selbi_weliyyewa|Selbi - GAN Security|7060|7061"
    "shanur_gulmyradow|Shanur - Wireshark Monitor|7070|7071"
    "shatlyk_rahmanov|Shatlyk - AI Firewall|7080|7081"
    "suleyman_akmuhammedow|Suleyman - OSINT.AI|7090|7091"
)

# ============================================
# --stop: Stop all running servers
# ============================================
if [ "$1" == "--stop" ] || [ "$1" == "stop" ]; then
    echo ""
    echo -e "${YELLOW}Stopping all servers...${NC}"
    for port in $ALL_PORTS; do
        lsof -ti:$port 2>/dev/null | xargs kill -9 2>/dev/null
    done
    rm -f "$PID_FILE"
    echo -e "${GREEN}All servers stopped.${NC}"
    echo ""
    exit 0
fi

# ============================================
# --status: Check which servers are running
# ============================================
if [ "$1" == "--status" ] || [ "$1" == "status" ]; then
    echo ""
    echo -e "${CYAN}Server Status:${NC}"
    echo ""
    for entry in "${PROJECTS[@]}"; do
        IFS='|' read -r dir name front_port back_port <<< "$entry"
        front_up=false
        back_up=false
        if lsof -ti:$front_port > /dev/null 2>&1; then front_up=true; fi
        if lsof -ti:$back_port > /dev/null 2>&1; then back_up=true; fi

        if [ "$front_up" = true ] && [ "$back_up" = true ]; then
            echo -e "  ${GREEN}● ${name}${NC}  frontend::${front_port}  backend::${back_port}"
        elif [ "$front_up" = true ] || [ "$back_up" = true ]; then
            echo -e "  ${YELLOW}◐ ${name}${NC}  frontend:${front_port}=$([ "$front_up" = true ] && echo UP || echo DOWN)  backend:${back_port}=$([ "$back_up" = true ] && echo UP || echo DOWN)"
        else
            echo -e "  ${RED}○ ${name}${NC}  - not running"
        fi
    done
    echo ""
    exit 0
fi

# Parse flags
FORCE_INSTALL=false
for arg in "$@"; do
    case $arg in
        --install|-i) FORCE_INSTALL=true ;;
    esac
done

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

# Kill any already running servers on our ports
for port in $ALL_PORTS; do
    lsof -ti:$port 2>/dev/null | xargs kill -9 2>/dev/null
done

# Create log directory
mkdir -p "$LOG_DIR"

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
# STEP 2: Start all projects (background)
# ============================================
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║              STEP 2: Starting All Servers                      ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

> "$PID_FILE"

for entry in "${PROJECTS[@]}"; do
    IFS='|' read -r dir name front_port back_port <<< "$entry"

    if [ ! -d "$SCRIPT_DIR/$dir/backend" ] || [ ! -d "$SCRIPT_DIR/$dir/frontend" ]; then
        continue
    fi

    # Start backend
    cd "$SCRIPT_DIR/$dir/backend" && nohup npm start > "$LOG_DIR/${dir}-backend.log" 2>&1 &
    echo $! >> "$PID_FILE"

    # Start frontend
    cd "$SCRIPT_DIR/$dir/frontend" && nohup npm run dev > "$LOG_DIR/${dir}-frontend.log" 2>&1 &
    echo $! >> "$PID_FILE"

    echo -e "${GREEN}  ✓ ${name}${NC} - :${front_port} | :${back_port}"
done

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
echo -e "${CYAN}║  Servers running in background                                 ║${NC}"
echo -e "${CYAN}║  Logs: .logs/                                                  ║${NC}"
echo -e "${CYAN}║  Stop: ./start-all.sh --stop                                   ║${NC}"
echo -e "${CYAN}║  Status: ./start-all.sh --status                               ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""
