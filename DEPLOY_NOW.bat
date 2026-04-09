@echo off
echo.
echo Deploying imem.ai to Production
echo ==========================================
echo.

REM Step 1: Deploy MCP Server to Railway
echo [1/3] Deploying MCP Server to Railway...
echo.
cd imem-mcp-server

echo Creating new Railway project...
railway init

echo Linking to Railway...
railway link

echo Deploying MCP server...
railway up

echo Getting deployment URL...
railway domain

echo.
echo Copy the Railway URL above (e.g., https://your-app.railway.app)
echo.
set /p RAILWAY_URL="Paste Railway URL here: "

REM Step 2: Update Vercel environment variable
echo.
echo [2/3] Configuring Vercel...
cd ..\imem-web

echo Setting MCP endpoint...
vercel env add NEXT_PUBLIC_MCP_ENDPOINT production
echo %RAILWAY_URL%

REM Step 3: Deploy to Vercel
echo.
echo [3/3] Deploying Web App to Vercel...
vercel --prod

echo.
echo ==========================================
echo Deployment Complete!
echo.
echo MCP Server:  %RAILWAY_URL%
echo Web App:     https://imem-web.vercel.app
echo.
echo Test it: https://imem-web.vercel.app/dashboard/chat
echo.
pause
