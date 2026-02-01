@echo off
echo Stopping backend server...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *backend*" 2>nul
if errorlevel 1 (
    echo Trying alternative method...
    FOR /F "tokens=2" %%p IN ('tasklist ^| findstr "node.exe"') DO taskkill /F /PID %%p 2>nul
)

timeout /t 2 /nobreak >nul

echo Starting backend server...
cd /d "c:\flutter_projects\SmartKitchen AI\backend"
start "SmartKitchen Backend" cmd /k "npm start"

echo.
echo Backend server restarted!
echo Check the new terminal window for server status.
pause
