@echo off
echo [1/4] Killing all existing Node.js processes...
taskkill /F /IM node.exe > nul 2>&1
timeout /t 2 /nobreak > nul

echo [2/4] Starting Backend (Port 5000)...
cd backend
start "SmartKitchen Backend" /B cmd /c "npm start > backend.log 2>&1"
cd ..

echo [3/4] Starting Frontend (Port 3000)...
cd frontend
start "SmartKitchen Frontend" /B cmd /c "npm start > frontend.log 2>&1"
cd ..

echo [4/4] Startup sequence complete. Logs are being written to backend/backend.log and frontend/frontend.log.
echo Please wait 10 seconds for servers to initialize...
timeout /t 10 /nobreak > nul
