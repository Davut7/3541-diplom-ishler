#!/bin/bash

# ============================================
# TMDDI Group 3541 - All Diploma Projects
# PM2 Start Script
# ============================================

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo ""
echo "╔══════════════════════════════════════════════════════════════════════════╗"
echo "║                    TMDDI Group 3541 - Diploma Projects                   ║"
echo "║                         PM2 Process Manager                              ║"
echo "╚══════════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if pm2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed. Installing..."
    npm install -g pm2
fi

# Install dependencies for all projects
install_deps() {
    echo "📦 Installing dependencies for all projects..."

    projects=(
        "batyr akyýew"
        "bayram gochmyradow"
        "daniyar nurmedow"
        "dawutmuhammet begmedow"
        "rowshen orazmuhammedow"
        "selbi weliyyewa"
        "shanur gulmyradow"
        "shatlyk rahmanov"
        "suleyman akmuhammedow"
    )

    for project in "${projects[@]}"; do
        echo "  📂 Installing: $project"
        [ -d "$SCRIPT_DIR/$project/backend/node_modules" ] || (cd "$SCRIPT_DIR/$project/backend" && npm install --silent 2>/dev/null)
        [ -d "$SCRIPT_DIR/$project/frontend/node_modules" ] || (cd "$SCRIPT_DIR/$project/frontend" && npm install --silent 2>/dev/null)
    done

    echo "✅ Dependencies installed!"
}

# Start all projects
start_all() {
    echo "🚀 Starting all projects with PM2..."
    pm2 start ecosystem.config.js
    echo ""
    echo "✅ All projects started!"
    show_status
}

# Stop all projects
stop_all() {
    echo "🛑 Stopping all projects..."
    pm2 stop all
    echo "✅ All projects stopped!"
}

# Restart all projects
restart_all() {
    echo "🔄 Restarting all projects..."
    pm2 restart all
    echo "✅ All projects restarted!"
}

# Show status
show_status() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════════════╗"
    echo "║                           Project URLs                                   ║"
    echo "╠══════════════════════════════════════════════════════════════════════════╣"
    echo "║  1. Batyr Akyýew          - http://localhost:3001 (backend: 4001)        ║"
    echo "║  2. Bayram Gochmyradow    - http://localhost:3002 (backend: 4002)        ║"
    echo "║  3. Daniyar Nurmedow      - http://localhost:3003 (backend: 4003)        ║"
    echo "║  4. Dawutmuhammet Begmedow- http://localhost:3004 (backend: 4004)        ║"
    echo "║  5. Rowshen Orazmuhammedow- http://localhost:3005 (backend: 4005)        ║"
    echo "║  6. Selbi Weliyyewa       - http://localhost:3006 (backend: 4006)        ║"
    echo "║  7. Shanur Gulmyradow     - http://localhost:3007 (backend: 4007)        ║"
    echo "║  8. Shatlyk Rahmanov      - http://localhost:3008 (backend: 4008)        ║"
    echo "║  9. Suleyman Akmuhammedow - http://localhost:3009 (backend: 4009)        ║"
    echo "╚══════════════════════════════════════════════════════════════════════════╝"
    echo ""
    pm2 status
}

# Show logs
show_logs() {
    pm2 logs
}

# Delete all processes
delete_all() {
    echo "🗑️  Deleting all PM2 processes..."
    pm2 delete all
    echo "✅ All processes deleted!"
}

# Open all in browser
open_all() {
    echo "🌐 Opening all projects in browser..."
    for port in 3001 3002 3003 3004 3005 3006 3007 3008 3009; do
        open "http://localhost:$port" 2>/dev/null || xdg-open "http://localhost:$port" 2>/dev/null
    done
}

# Main menu
case "$1" in
    install)
        install_deps
        ;;
    start)
        start_all
        ;;
    stop)
        stop_all
        ;;
    restart)
        restart_all
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    delete)
        delete_all
        ;;
    open)
        open_all
        ;;
    *)
        echo "Usage: $0 {install|start|stop|restart|status|logs|delete|open}"
        echo ""
        echo "Commands:"
        echo "  install  - Install dependencies for all projects"
        echo "  start    - Start all projects with PM2"
        echo "  stop     - Stop all projects"
        echo "  restart  - Restart all projects"
        echo "  status   - Show status and URLs of all projects"
        echo "  logs     - Show PM2 logs"
        echo "  delete   - Delete all PM2 processes"
        echo "  open     - Open all projects in browser"
        echo ""
        echo "Example: ./start-all.sh start"
        ;;
esac
