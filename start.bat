@echo off
echo Starting PitchBridge...
echo.

echo [1/2] Starting Backend Server (port 5000)...
start "PitchBridge Backend" cmd /k "cd /d %~dp0server && node index.js"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend (port 5173)...
start "PitchBridge Frontend" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul
