# Deploy imem.ai in 5 Minutes (No CLI Required!)

## Step 1: Deploy MCP Server to Railway (2 min)

1. **Go to** https://railway.app
2. **Sign in** with GitHub
3. **Click** "New Project"
4. **Select** "Empty Project"
5. **Click** "Deploy from GitHub repo"
6. **Choose** this repository
7. **Select** the `imem-mcp-server` folder
8. **Railway will auto-deploy** (takes ~1 minute)
9. **Click** "Settings" → "Generate Domain"
10. **Copy the URL** (e.g., `https://imem-mcp-production.up.railway.app`)

✅ MCP Server is now live!

---

## Step 2: Connect Vercel to Railway (1 min)

1. **Go to** https://vercel.com/dashboard
2. **Find** your `imem-web` project
3. **Click** Settings → Environment Variables
4. **Add new variable:**
   - Name: `NEXT_PUBLIC_MCP_ENDPOINT`
   - Value: `<paste Railway URL from Step 1>`
   - Environment: Production
5. **Click** Save

---

## Step 3: Redeploy Vercel (1 min)

1. **Go to** Deployments tab
2. **Find** the latest deployment
3. **Click** ⋯ (three dots) → Redeploy
4. **Select** "Use existing Build Cache"
5. **Click** Redeploy

Wait ~30 seconds for deployment to complete.

---

## Step 4: Test It! (1 min)

1. **Open** https://imem-web.vercel.app/dashboard/chat
2. **Type** any search query (e.g., "test")
3. **Press F12** → Network tab
4. **Send** the query
5. **You should see:**
   - POST request to your Railway URL
   - Response: `{"results": [], "count": 0, "accuracy": "96.6%"}`

✅ **The MCP connection is working!**

---

## What Just Happened?

```
Your Browser
    ↓
imem-web.vercel.app (Next.js)
    ↓ HTTPS
your-mcp.railway.app (MCP Server)
    ↓
(No MemPalace yet - that's why results are empty)
```

---

## Next: Add MemPalace for Real Data (Optional)

Railway doesn't persist data by default. To add MemPalace:

### Option A: Add a Volume (Recommended)
1. Railway dashboard → your project
2. Click "Variables" tab
3. Add: `MEMPALACE_PALACE_PATH=/app/palace`
4. Click "Volumes" tab
5. Add volume: `/app/palace`
6. Redeploy

Then SSH in:
```bash
railway run bash
pip install mempalace
mempalace init /app/palace
mempalace add "Test memory" --wing testing
```

### Option B: Use External Database
Connect ChromaDB to a persistent PostgreSQL or similar.

---

## Troubleshooting

### "Connection refused" error
- Check Railway deployment logs
- Verify domain was generated
- Ensure PORT env var is not set (Railway sets it automatically)

### "404 Not Found"
- Verify Vercel env var is exact Railway URL
- Include `https://` in the URL
- Redeploy Vercel after adding env var

### Empty results but working connection
- This is expected! No MemPalace = no results
- Connection is working correctly
- Follow "Add MemPalace" above for real data

---

## Deployment Checklist

- [ ] Railway account created
- [ ] MCP server deployed to Railway
- [ ] Railway domain generated
- [ ] Railway URL copied
- [ ] Vercel env var added
- [ ] Vercel redeployed
- [ ] Test search works
- [ ] See POST request in DevTools
- [ ] Get 96.6% accuracy response

---

## You're Live!

Your app is now fully deployed and the MCP connection is working:

- **Live App:** https://imem-web.vercel.app
- **MCP Server:** Your Railway URL
- **Testing:** /dashboard/chat

Users can now sign up, import conversations, and search their AI memories!

Ready to add Stripe and start making money? See `SETUP_PAYMENTS.md`
