# Deploy imem.ai to Production - Manual Steps

## Quick Deploy (3 Steps)

### Step 1: Deploy MCP Server to Railway

```bash
cd imem-mcp-server

# Login to Railway (opens browser)
railway login

# Create new project
railway init

# Deploy
railway up

# Get the URL
railway domain
```

**Copy the Railway URL** (e.g., `https://imem-mcp-production.up.railway.app`)

---

### Step 2: Configure Vercel with MCP Endpoint

```bash
cd ../imem-web

# Login to Vercel
vercel login

# Add environment variable
vercel env add NEXT_PUBLIC_MCP_ENDPOINT production
# When prompted, paste your Railway URL from Step 1
```

---

### Step 3: Deploy Web App to Vercel

```bash
# Deploy to production
vercel --prod
```

**Done!** Your app is live at: https://imem-web.vercel.app

---

## Alternative: Use Railway UI

### Deploy MCP Server via Dashboard

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `imem-ai/imem-mcp-server`
5. Railway auto-detects and deploys
6. Click "Generate Domain" to get public URL
7. Copy the URL

### Deploy Web App via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Find your `imem-web` project
3. Go to Settings → Environment Variables
4. Add: `NEXT_PUBLIC_MCP_ENDPOINT` = `<your-railway-url>`
5. Go to Deployments → Redeploy

---

## Test the Deployment

1. Open: https://imem-web.vercel.app/dashboard/chat
2. Type a search query
3. Open DevTools → Network
4. Should see POST to your Railway MCP server
5. Returns: `{"results": [], "count": 0, "accuracy": "96.6%"}`

---

## Add MemPalace (Optional - For Real Data)

SSH into Railway:
```bash
railway run bash

# Inside Railway container
pip install mempalace
mempalace init /data/palace
mempalace add "Test memory" --wing testing

# Set environment variable
railway variables set MEMPALACE_PALACE_PATH=/data/palace
```

Now searches will return real results!

---

## Troubleshooting

### MCP Server Not Responding
```bash
railway logs
# Check for errors
```

### Web App Can't Connect
1. Verify Railway URL in Vercel env vars
2. Check CORS is enabled (already configured)
3. Redeploy Vercel after env var changes

### Port Issues
Railway automatically assigns PORT environment variable.
The http-bridge.ts uses `process.env.PORT || 3001`

---

## Deployment Checklist

- [ ] Railway account created
- [ ] Vercel account created
- [ ] MCP server deployed to Railway
- [ ] Railway domain generated
- [ ] Vercel env var configured
- [ ] Web app deployed to Vercel
- [ ] Test search from live app
- [ ] (Optional) MemPalace installed on Railway

---

## Quick Commands Reference

```bash
# Railway
railway login
railway init
railway up
railway logs
railway domain
railway run bash

# Vercel
vercel login
vercel --prod
vercel env add NEXT_PUBLIC_MCP_ENDPOINT production
vercel logs
```

---

## What's Deployed

**Railway (MCP Server):**
- Express server on dynamic port
- Endpoints: /api/search, /api/import, /api/stats
- Calls MemPalace CLI
- Public HTTPS URL

**Vercel (Web App):**
- Next.js 15 app
- Static + serverless
- Connects to Railway MCP server
- Public HTTPS URL

**Architecture:**
```
User Browser
    ↓
Vercel (Next.js)
    ↓ HTTPS
Railway (MCP HTTP Bridge)
    ↓ CLI
MemPalace (if installed)
```

---

Ready to deploy! Run the commands above or use `DEPLOY_NOW.bat` for automated deployment.
