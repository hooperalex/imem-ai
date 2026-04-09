@echo off
REM Start both servers for development

echo Starting imem.ai Development Environment
echo ==========================================
echo.

REM Kill any existing processes
echo Clearing ports...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul

REM Start MCP server
echo.
echo [1/2] Starting MCP HTTP Bridge on port 3001...
cd imem-mcp-server
start /B "MCP Server" npm run http
cd ..
timeout /t 3 /nobreak >nul
echo [OK] MCP server starting

REM Start Next.js
echo.
echo [2/2] Starting Next.js web app on port 3000...
cd imem-web
start "Next.js Dev" npm run dev
cd ..

echo.
echo ==========================================
echo Development servers starting:
echo.
echo   MCP Server:  http://localhost:3001
echo   Web App:     http://localhost:3000
echo.
echo Press Ctrl+C in the Next.js window to stop
echo.
pause
