#!/bin/bash
# WAF Demo Script — Batyr Akyýew
# Launches vulnerable test app + WAF backend + frontend

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${RED}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       WAF BEHAVIORAL ANALYSIS — LIVE DEMO                   ║"
echo "║       Author: Batyr Akyýew                                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Kill existing
for port in 7010 7011 8888; do
  lsof -ti:$port 2>/dev/null | xargs kill -9 2>/dev/null
done

echo -e "${YELLOW}[1/3] Starting vulnerable test website (port 8888)...${NC}"
cd "$SCRIPT_DIR/backend" && node vulnerable-app.js &
sleep 1

echo -e "${YELLOW}[2/3] Starting WAF backend (port 7011)...${NC}"
cd "$SCRIPT_DIR/backend" && node server.js &
sleep 2

echo -e "${YELLOW}[3/3] Starting WAF dashboard (port 7010)...${NC}"
cd "$SCRIPT_DIR/frontend" && npx vite --host &
sleep 3

echo ""
echo -e "${GREEN}══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  DEMO READY!${NC}"
echo ""
echo -e "  ${RED}Vulnerable site:${NC}  http://localhost:8888"
echo -e "  ${CYAN}WAF Dashboard:${NC}    http://localhost:7010"
echo -e "  ${CYAN}WAF API:${NC}          http://localhost:7011"
echo ""
echo -e "  ${YELLOW}DEMO FLOW:${NC}"
echo -e "  1. Open ${RED}http://localhost:8888${NC} — try SQL injection, XSS"
echo -e "  2. Open ${CYAN}http://localhost:7010${NC} → Proxy page"
echo -e "  3. Set target: http://localhost:8888, Start Proxy"
echo -e "  4. Open http://localhost:8080 (via WAF proxy)"
echo -e "  5. Try same attacks — they will be ${GREEN}BLOCKED${NC}!"
echo -e "  6. Check WAF Dashboard → Logs, Statistics"
echo ""
echo -e "${GREEN}══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Press Ctrl+C to stop all servers"

cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down...${NC}"
    for port in 7010 7011 8888 8080; do
      lsof -ti:$port 2>/dev/null | xargs kill -9 2>/dev/null
    done
    echo -e "${GREEN}Done.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM
wait
