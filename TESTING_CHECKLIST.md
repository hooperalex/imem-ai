# MCP Testing Checklist

Follow this checklist to validate the imem.ai MCP integration.

## Pre-Flight Check

- [ ] Node.js installed (`node --version`)
- [ ] npm packages installed in both folders
  - [ ] `cd imem-mcp-server && npm install`
  - [ ] `cd imem-web && npm install`
- [ ] MCP server builds: `cd imem-mcp-server && npm run build`

## Phase 1: MCP Server Testing

### 1.1 Start MCP Server
```bash
cd imem-mcp-server
npm run http
```

**Expected output:**
```
🚀 imem.ai MCP HTTP Bridge running on port 3001
   Search: POST http://localhost:3001/api/search
   Import: POST http://localhost:3001/api/import
   Voice:  POST http://localhost:3001/api/voice-query
```

- [ ] Server starts without errors
- [ ] Port 3001 is listening

### 1.2 Test Search Endpoint
```bash
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"test\", \"userId\": \"demo\"}"
```

**Expected response:**
```json
{
  "results": [],
  "count": 0,
  "accuracy": "96.6%"
}
```

- [ ] Endpoint responds
- [ ] Returns JSON
- [ ] No errors in server logs

### 1.3 Test Stats Endpoint
```bash
curl http://localhost:3001/api/stats?userId=demo
```

**Expected response:**
```json
{
  "totalMemories": 0,
  "searchesToday": 0,
  "storageGB": 0,
  "wings": {}
}
```

- [ ] Endpoint responds
- [ ] Returns JSON structure

## Phase 2: Web App Testing

### 2.1 Start Web App
In a new terminal:
```bash
cd imem-web
npm run dev
```

**Expected output:**
```
▲ Next.js 16.2.3 (Turbopack)
- Local:   http://localhost:3000
✓ Ready in 720ms
```

- [ ] Next.js starts
- [ ] Runs on port 3000 (not 3001!)
- [ ] No build errors

### 2.2 Check Homepage
Open http://localhost:3000

- [ ] Page loads
- [ ] No console errors
- [ ] "Get Started" button visible

### 2.3 Check Dashboard
Navigate to http://localhost:3000/dashboard

- [ ] Dashboard loads
- [ ] Shows 0 memories
- [ ] "Import Now" button visible

### 2.4 Check Chat Page
Navigate to http://localhost:3000/dashboard/chat

- [ ] Chat interface loads
- [ ] Input box visible
- [ ] Send button visible

### 2.5 Test Search from UI
In the chat input, type: "test query"

**Check browser DevTools (F12) → Network tab:**
- [ ] POST request to `http://localhost:3001/api/search`
- [ ] Request body contains `{"query": "test query"}`
- [ ] Response status 200
- [ ] Response contains `{"results": [], "count": 0}`

**Check UI:**
- [ ] Message appears in chat
- [ ] Shows "No memories found" or similar
- [ ] No errors in console

## Phase 3: Integration Testing

### 3.1 End-to-End Flow
1. Type a query in chat
2. Click send

**Verify:**
- [ ] Query appears in chat UI
- [ ] Loading state shows
- [ ] HTTP request hits MCP server
- [ ] MCP server logs show the query
- [ ] Response comes back
- [ ] Assistant message appears

### 3.2 Multiple Queries
Try different queries:
- "database decisions"
- "react hooks"
- "engineering"

- [ ] All queries work
- [ ] No crashes
- [ ] Consistent behavior

## Phase 4: MemPalace Integration (Optional)

### 4.1 Install MemPalace
```bash
pip install mempalace
mempalace init ~/my-palace
```

- [ ] MemPalace installs
- [ ] Palace initialized

### 4.2 Add Test Data
```bash
mempalace add "Decided to use PostgreSQL for the database" \
  --wing engineering \
  --room architecture

mempalace add "Learning React hooks and state management" \
  --wing learning \
  --room react
```

- [ ] Memories added
- [ ] `mempalace status` shows count

### 4.3 Test Search with Data
```bash
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"database\", \"userId\": \"demo\"}"
```

- [ ] Returns actual results
- [ ] Results include content
- [ ] Relevance scores present

### 4.4 Test from Web App
In chat interface, search for: "database"

- [ ] Results appear in chat
- [ ] Shows memory content
- [ ] Shows source/wing info

## Phase 5: Error Handling

### 5.1 MCP Server Down
1. Stop MCP server (Ctrl+C)
2. Try searching from web app

- [ ] UI shows error gracefully
- [ ] Doesn't crash
- [ ] Error message helpful

### 5.2 Invalid Query
```bash
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d "{}"
```

- [ ] Returns error response
- [ ] Server doesn't crash

### 5.3 Large Query
Search for a very long text (1000+ characters)

- [ ] Handles gracefully
- [ ] No timeout
- [ ] Returns response or error

## Success Criteria

### Minimum Viable Test (Without MemPalace)
✅ All these should pass:
- [  ] MCP server starts
- [ ] Web app starts
- [ ] Chat page loads
- [ ] Search triggers HTTP request
- [ ] MCP endpoint responds
- [ ] UI shows result message
- [ ] No crashes

### Full Integration Test (With MemPalace)
✅ All minimum tests PLUS:
- [ ] MemPalace installed
- [ ] Test data added
- [ ] Search returns real results
- [ ] Results display correctly
- [ ] Multiple searches work
- [ ] Import functionality ready

## Troubleshooting

### MCP Server Issues
```bash
# Rebuild
cd imem-mcp-server
npm run build

# Check for errors
npm run http
```

### Web App Issues
```bash
# Clear Next.js cache
rm -rf imem-web/.next

# Restart
npm run dev
```

### Port Conflicts
```bash
# Windows
netstat -ano | findstr :3001
taskkill /F /PID [PID]

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### Connection Issues
1. Verify MCP is running: `curl http://localhost:3001/api/stats`
2. Check CORS in browser console
3. Verify environment variable: `NEXT_PUBLIC_MCP_ENDPOINT`
4. Restart both servers

## Next Steps After Testing

### If All Tests Pass ✅
1. Install MemPalace
2. Import real conversation data
3. Test voice search (add OPENAI_API_KEY)
4. Deploy to staging
5. Add authentication
6. Configure Stripe
7. Launch!

### If Tests Fail ❌
1. Check which phase failed
2. Read error messages carefully
3. Check server logs
4. Verify environment setup
5. Review documentation
6. Report issues with logs

## Quick Test Command

Run all tests at once:
```bash
# Start servers
START_DEV.bat  # Windows
# or
./TEST_MCP.sh  # Linux/Mac

# Wait 5 seconds, then test
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"test\"}"

# Open browser
open http://localhost:3000/dashboard/chat
```

## Test Summary

| Phase | Tests | Status |
|-------|-------|--------|
| 1. MCP Server | 3 | ⬜ |
| 2. Web App | 5 | ⬜ |
| 3. Integration | 2 | ⬜ |
| 4. MemPalace | 4 | ⬜ |
| 5. Error Handling | 3 | ⬜ |

**Total:** 0/17 tests passing

Update this table as you complete each test!
