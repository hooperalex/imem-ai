# Quick Start - imem.ai MCP Testing

Get the MCP server connected and test the integration in 5 minutes.

## Option 1: Test Without MemPalace (Quick Demo)

If you don't have MemPalace installed yet, the MCP server will use fallback mock data.

```bash
# 1. Start MCP HTTP Bridge
cd imem-mcp-server
npm run http

# 2. In a new terminal, start the web app
cd imem-web
npm run dev

# 3. Open browser
open http://localhost:3000/dashboard/chat

# 4. Try a search
"What did I decide about the database?"
```

The system will work but return empty results until you install MemPalace.

## Option 2: Full Setup with MemPalace

### 1. Install MemPalace
```bash
pip install mempalace
mempalace init ~/my-palace
```

### 2. Add some test data
```bash
# Create a test memory
mempalace add "Decided to use PostgreSQL for better JSON support" \
  --wing engineering \
  --room architecture

mempalace add "Learning React hooks - useCallback and useMemo" \
  --wing learning \
  --room react
```

### 3. Start MCP server
```bash
cd imem-mcp-server
npm run http
```

### 4. Start web app
```bash
cd imem-web
npm run dev
```

### 5. Test it!
Open http://localhost:3000/dashboard/chat

Try searching:
- "database decisions"
- "react hooks"
- "engineering discussions"

## Testing the MCP Connection

### Test 1: Search API
```bash
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "database", "userId": "test"}'
```

### Test 2: Stats API
```bash
curl http://localhost:3001/api/stats?userId=test
```

### Test 3: Import API
```bash
curl -X POST http://localhost:3001/api/import \
  -H "Content-Type: application/json" \
  -d '{
    "content": "{\"title\": \"Test Memory\", \"content\": \"This is a test\"}",
    "source": "claude",
    "userId": "test",
    "wing": "testing"
  }'
```

## Current Status

✅ MCP server built and ready
✅ HTTP bridge created (port 3001)
✅ Web app configured to connect
✅ Testing scripts ready

⚠️ MemPalace needs to be installed for full functionality
⚠️ Voice features require OPENAI_API_KEY

## Next Steps

1. **Install MemPalace** to get real search working:
   ```bash
   pip install mempalace
   mempalace init ~/my-palace
   ```

2. **Import your conversations**:
   - Export from Claude/ChatGPT/Gemini
   - Drag & drop into the Import page
   - Or use CLI: `mempalace mine your-export.json`

3. **Add voice search** (optional):
   ```bash
   export OPENAI_API_KEY=sk-...
   ```

4. **Deploy to production**:
   - See DEPLOYMENT.md for Railway/Vercel setup
   - Add Stripe keys for payments
   - Configure custom domain

## Troubleshooting

### Port 3001 already in use
```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3001   # Windows
```

### MCP server won't start
```bash
# Check the build
cd imem-mcp-server
npm run build

# Check for errors
npm run http
```

### Web app can't connect
1. Verify MCP server is running: `curl http://localhost:3001/api/stats`
2. Check Next.js env: `NEXT_PUBLIC_MCP_ENDPOINT=http://localhost:3001`
3. Restart dev server: `npm run dev`

## Architecture Overview

```
User Browser → Next.js (3000) → MCP HTTP Bridge (3001) → MemPalace CLI → ChromaDB
```

- **Port 3000**: Next.js web app
- **Port 3001**: MCP HTTP bridge
- **MemPalace**: Python CLI for memory operations
- **ChromaDB**: Vector database for semantic search

## What's Working Now

✅ MCP server compiles and runs
✅ HTTP endpoints for search, import, stats
✅ Web app connects to MCP server
✅ Chat interface sends queries
✅ Voice query API (needs OPENAI_API_KEY)
✅ Import endpoint ready

## What Needs MemPalace

❌ Actual search results (returns empty without MemPalace)
❌ Import functionality (needs MemPalace to store)
❌ Stats (returns zeros without data)

## Development Workflow

**Terminal 1** - MCP Server:
```bash
cd imem-mcp-server
npm run http
```

**Terminal 2** - Web App:
```bash
cd imem-web
npm run dev
```

**Terminal 3** - Testing:
```bash
# Search test
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'
```

## Ready to Test!

The MCP connection is set up and ready. The server is running, the web app is configured, and you can start testing the integration now.

**Start the servers** and open http://localhost:3000/dashboard/chat to see it in action!
