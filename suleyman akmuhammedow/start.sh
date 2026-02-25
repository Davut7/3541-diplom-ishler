#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    OSINT.AI - Starting...                     ║"
echo "║         AI-Assisted OSINT Tools for Cybersecurity             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Start backend in background
echo "Starting backend server..."
cd backend && npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start frontend
echo "Starting frontend..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  Backend:  http://localhost:3000"
echo "  Frontend: http://localhost:5173"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
