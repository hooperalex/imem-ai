# Deploy to GitHub & Render - 3 Minutes

## Step 1: Push to GitHub (1 minute)

```bash
cd C:\Users\hoope\imem-ai

# Initialize git if not already
git init
git add .
git commit -m "Initial commit - imem.ai MCP server"

# Create repo on GitHub (go to github.com/new)
# Name it: imem-ai

# Push
git remote add origin https://github.com/hooperalex/imem-ai.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Render (2 minutes)

The browser is already open at Render with GitHub connected!

1. **Refresh the repo list** or search for "imem-ai"
2. **Click** on hooperalex/imem-ai
3. **Configure:**
   - Root Directory: `imem-mcp-server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run http`
4. **Click** "Create Web Service"
5. **Wait** ~2 minutes for deployment
6. **Copy** the URL (e.g., `https://imem-mcp-server.onrender.com`)

## Step 3: Update Vercel (30 seconds)

```bash
cd imem-web
vercel env add NEXT_PUBLIC_MCP_ENDPOINT production
# Paste the Render URL
vercel --prod
```

**Done!** Your app is live at https://imem-web.vercel.app

The MCP server will be running on Render's free tier.
