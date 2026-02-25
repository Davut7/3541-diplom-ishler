#!/bin/bash
echo "Starting KeyGuard..."
[ ! -d "backend/node_modules" ] && cd backend && npm install && cd ..
[ ! -d "frontend/node_modules" ] && cd frontend && npm install && cd ..
cd backend && npm start &
sleep 2
cd ../frontend && npm run dev &
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:5173"
trap "kill $(jobs -p) 2>/dev/null; exit" INT
wait
