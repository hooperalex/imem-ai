# Deploy to Render (Free - 5 Minutes)

## Quick Deploy

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Select `imem-mcp-server` folder
6. Settings:
   - Name: `imem-mcp-server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run http`
7. Click "Create Web Service"
8. Copy the URL (e.g., `https://imem-mcp-server.onrender.com`)

## Then Configure Vercel

```bash
cd imem-web
vercel env add NEXT_PUBLIC_MCP_ENDPOINT production
# Paste your Render URL
vercel --prod
```

Done! Your app is live.

Free tier includes:
- 512 MB RAM
- Free SSL
- Auto-deploys from GitHub
- No credit card required
