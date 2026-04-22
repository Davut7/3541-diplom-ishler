#!/bin/bash

# ============================================
# GAN Attacks Analyzer - Start Script
# Author: Selbi Weliyyewa
# ============================================

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              GAN Attacks Analyzer                             ║"
echo "║         Author: Selbi Weliyyewa                               ║"
echo "╚══════════════════════════════════════════════════════════════╝"

[ ! -d "$SCRIPT_DIR/backend/node_modules" ] && cd "$SCRIPT_DIR/backend" && npm install
[ ! -d "$SCRIPT_DIR/frontend/node_modules" ] && cd "$SCRIPT_DIR/frontend" && npm install

# ============================================
# Ollama - Local AI for tests
# ============================================
OLLAMA_MODEL="llama3.2:1b"

if command -v ollama &> /dev/null; then
  echo "  Ollama found: $(which ollama)"

  # Start ollama serve if not already running
  if ! curl -s http://localhost:11434/api/tags &> /dev/null; then
    echo "  Starting Ollama server..."
    ollama serve &> /dev/null &
    OLLAMA_PID=$!
    sleep 3
  else
    echo "  Ollama server already running"
    OLLAMA_PID=""
  fi

  # Check if model is already downloaded
  if ollama list 2>/dev/null | grep -q "$OLLAMA_MODEL"; then
    echo "  Model $OLLAMA_MODEL already installed"
  else
    echo "  Downloading model $OLLAMA_MODEL (~1GB)..."
    ollama pull "$OLLAMA_MODEL"
  fi
else
  echo "  WARNING: Ollama not installed. AI Tests will not work."
  echo "  Install: https://ollama.ai/download"
  OLLAMA_PID=""
fi

cd "$SCRIPT_DIR/backend" && npm start &
BACKEND_PID=$!
sleep 2
cd "$SCRIPT_DIR/frontend" && npm run dev &
FRONTEND_PID=$!

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Frontend: http://localhost:7060                             ║"
echo "║  Backend:  http://localhost:7061                             ║"
echo "║  Press Ctrl+C to stop                                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"

echo "║  Ollama:   http://localhost:11434 (AI Test)                  ║"

cleanup() {
  echo ""
  echo "  Stopping all services..."
  kill $BACKEND_PID $FRONTEND_PID $OLLAMA_PID 2>/dev/null
  # Kill any process still holding the ports
  lsof -ti:7060 | xargs kill -9 2>/dev/null
  lsof -ti:7061 | xargs kill -9 2>/dev/null
  lsof -ti:11434 | xargs kill -9 2>/dev/null
  echo "  All ports (7060, 7061, 11434) released."
  exit 0
}

trap cleanup INT TERM
wait
