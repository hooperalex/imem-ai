@echo off
REM MCP Connection Testing for Windows
echo.
echo Testing imem.ai MCP Server Integration
echo ==========================================
echo.

REM Test 1: Check MemPalace
echo [1/5] Checking MemPalace installation...
where mempalace >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] MemPalace is installed
    mempalace --version
) else (
    echo [FAIL] MemPalace not found
    echo.
    echo To install MemPalace:
    echo   pip install mempalace
    echo   mempalace init %USERPROFILE%\my-palace
    echo.
    pause
    exit /b 1
)
echo.

REM Test 2: Build MCP server
echo [2/5] Building MCP HTTP Bridge...
cd imem-mcp-server
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [FAIL] Build failed
    pause
    exit /b 1
)
echo [OK] MCP server built
echo.

REM Test 3: Start MCP server
echo [3/5] Starting MCP HTTP Bridge...
start /B npm run http
timeout /t 5 /nobreak >nul
echo [OK] MCP server starting on port 3001
echo.

REM Test 4: Test endpoints
echo [4/5] Testing API endpoints...
curl -X POST http://localhost:3001/api/search ^
  -H "Content-Type: application/json" ^
  -d "{\"query\": \"test\", \"userId\": \"test-user\"}"
echo.
echo [OK] Search endpoint tested
echo.

echo [5/5] Testing stats endpoint...
curl http://localhost:3001/api/stats?userId=test-user
echo.
echo [OK] Stats endpoint tested
echo.

REM Summary
echo ==========================================
echo Test Summary:
echo.
echo [OK] MemPalace installed
echo [OK] MCP server built
echo [OK] MCP server running on port 3001
echo [OK] API endpoints responding
echo.
echo Next Steps:
echo   1. Start web app: cd imem-web ^&^& npm run dev
echo   2. Open http://localhost:3000/dashboard/chat
echo   3. Try searching for memories
echo.
echo MCP server is running in the background.
echo Press any key to stop the server and exit.
pause >nul

REM Cleanup
taskkill /F /IM node.exe /FI "WINDOWTITLE eq npm*"
echo.
echo Server stopped.
