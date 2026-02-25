#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              GAN Security Analyzer - Starting...              ║"
echo "║            Attacks and Defense Mechanisms Analysis            ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo "Starting backend server..."
cd backend && npm start &
BACKEND_PID=$!

sleep 2

echo "Starting frontend..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  Backend:  http://localhost:3000"
echo "  Frontend: http://localhost:5173"
echo "═══════════════════════════════════════════════════════════════"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
