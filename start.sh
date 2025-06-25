#!/bin/bash

# Start the backend server
echo "Starting FastAPI backend server..."
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start the frontend server
echo "Starting Next.js frontend server..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo "Both servers are starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "Admin Panel: http://localhost:3000/admin"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait 