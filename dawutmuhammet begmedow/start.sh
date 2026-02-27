#!/bin/bash

# ============================================
# VirusDetect Pro - Desktop Application
# Author: Dawutmuhammet Begmedow
# ============================================

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       VirusDetect Pro - Desktop Application                  ║"
echo "║           Author: Dawutmuhammet Begmedow                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Install root dependencies (Electron)
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
    echo "Installing Electron dependencies..."
    cd "$SCRIPT_DIR" && npm install --cache /tmp/npm-cache
fi

# Install frontend dependencies
if [ ! -d "$SCRIPT_DIR/frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd "$SCRIPT_DIR/frontend" && npm install --cache /tmp/npm-cache
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Starting VirusDetect Pro Desktop App...                     ║"
echo "║  Frontend Dev Server: http://localhost:7008                  ║"
echo "║  Press Ctrl+C to stop                                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Start in development mode
cd "$SCRIPT_DIR" && npm run dev
