# MCP Testing Guide

Complete guide to testing the imem.ai MCP server integration.

## Prerequisites

1. **Install MemPalace** (the core memory engine):
   ```bash
   pip install mempalace
   mempalace init ~/my-palace
   ```

2. **Install dependencies**:
   ```bash
   # MCP server
   cd imem-mcp-server
   npm install
   npm run build

   # Web app
   cd ../imem-web
   npm install
   ```

3. **Set environment variables** (optional for voice):
   ```bash
   export OPENAI_API_KEY=sk-...  # For voice features
   ```

## Quick Start

### Windows
```bat
TEST_MCP.bat
```

### Linux/Mac
```bash
chmod +x TEST_MCP.sh
./TEST_MCP.sh
```

This will:
- ✓ Verify MemPalace is installed
- ✓ Start the MCP HTTP Bridge
- ✓ Test search endpoint
- ✓ Test stats endpoint
- ✓ Show you how to start the web app

## Manual Testing Loop

### Step 1: Start MCP Server
```bash
cd imem-mcp-server
npm run http
```

The server will start on port 3001. You should see:
```
🚀 imem.ai MCP HTTP Bridge running on port 3001
   Search: POST http://localhost:3001/api/search
   Import: POST http://localhost:3001/api/import
   Voice:  POST http://localhost:3001/api/voice-query
```

### Step 2: Test Search API
```bash
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "test memory", "userId": "user123"}'
```

Expected response:
```json
{
  "results": [],
  "count": 0,
  "accuracy": "96.6%"
}
```

### Step 3: Import Test Data
Create a test conversation file:
```json
{
  "conversations": [
    {
      "title": "Database Decision",
      "messages": [
        {"role": "user", "content": "Should we use PostgreSQL or MySQL?"},
        {"role": "assistant", "content": "PostgreSQL is better for your use case..."}
      ]
    }
  ]
}
```

Import it:
```bash
curl -X POST http://localhost:3001/api/import \
  -H "Content-Type: application/json" \
  -d '{
    "content": "...",
    "source": "claude",
    "userId": "user123",
    "wing": "engineering"
  }'
```

### Step 4: Search Imported Memories
```bash
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "database", "userId": "user123"}'
```

You should now see results!

### Step 5: Start Web App
```bash
cd ../imem-web
npm run dev
```

Open http://localhost:3000/dashboard/chat and try:
- "What did I decide about the database?"
- "Show me conversations about PostgreSQL"
- "Find discussions about engineering"

## Testing Checklist

- [ ] MemPalace installed (`mempalace --version`)
- [ ] MCP server builds (`npm run build`)
- [ ] MCP server starts on port 3001
- [ ] Search endpoint responds
- [ ] Stats endpoint responds
- [ ] Import works
- [ ] Web app connects to MCP server
- [ ] Chat interface searches memories
- [ ] Results are displayed correctly

## Architecture

```
┌─────────────────┐
│   Web App       │  Next.js on port 3000
│ (localhost:3000)│
└────────┬────────┘
         │ HTTP
         v
┌─────────────────┐
│  MCP HTTP       │  Express on port 3001
│  Bridge         │
└────────┬────────┘
         │ CLI
         v
┌─────────────────┐
│  MemPalace      │  Python CLI
│  (mempalace)    │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  ChromaDB       │  Vector database
│  + SQLite       │
└─────────────────┘
```

## Endpoints

### POST /api/search
Search memories semantically.

**Request:**
```json
{
  "query": "What did I decide about...",
  "userId": "user123",
  "wing": "engineering",  // optional
  "limit": 5              // optional, default 5
}
```

**Response:**
```json
{
  "results": [
    {
      "id": "1",
      "title": "Database Decision",
      "content": "Chose PostgreSQL because...",
      "timestamp": "2024-01-15T10:30:00Z",
      "source": "claude",
      "wing": "engineering",
      "room": "architecture",
      "relevance": 0.95
    }
  ],
  "count": 1,
  "accuracy": "96.6%"
}
```

### POST /api/import
Import conversations.

**Request:**
```json
{
  "content": "...",      // conversation JSON
  "source": "claude",    // claude | chatgpt | gemini
  "userId": "user123",
  "wing": "engineering"  // optional
}
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "message": "Imported 5 memories"
}
```

### POST /api/voice-query
Voice-enabled search (requires OPENAI_API_KEY).

**Request:**
```json
{
  "audio_base64": "...",  // base64 audio
  "return_audio": true
}
```

**Response:**
```json
{
  "query": "transcribed text",
  "results": [...],
  "audio_response_base64": "..."
}
```

### GET /api/stats
Get palace statistics.

**Request:**
```
GET /api/stats?userId=user123
```

**Response:**
```json
{
  "totalMemories": 42,
  "searchesToday": 15,
  "storageGB": 0.5,
  "wings": {
    "engineering": 25,
    "learning": 17
  }
}
```

## Troubleshooting

### MemPalace not found
```bash
pip install mempalace
mempalace init ~/my-palace
```

### Port 3001 already in use
```bash
# Kill existing process
lsof -ti:3001 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3001   # Windows
```

### Web app can't connect to MCP
1. Check MCP server is running: `curl http://localhost:3001/api/stats`
2. Check environment variable: `NEXT_PUBLIC_MCP_ENDPOINT=http://localhost:3001`
3. Restart Next.js dev server

### Search returns empty results
1. Import some test data first
2. Check MemPalace palace exists: `mempalace status`
3. Verify import worked: `mempalace search "test"`

## Environment Variables

### MCP Server
```bash
OPENAI_API_KEY=sk-...           # For voice (optional)
MEMPALACE_PALACE_PATH=~/palace  # MemPalace path (optional)
PORT=3001                       # HTTP server port (optional)
```

### Web App
```bash
NEXT_PUBLIC_MCP_ENDPOINT=http://localhost:3001  # MCP server URL
```

## Production Deployment

For production, deploy the MCP HTTP bridge separately:

```bash
# Build
cd imem-mcp-server
npm run build

# Run
export PORT=3001
export OPENAI_API_KEY=sk-...
npm run http
```

Then set the web app environment variable:
```bash
NEXT_PUBLIC_MCP_ENDPOINT=https://your-mcp-server.com
```

## Next Steps

1. ✓ Get MCP server running locally
2. ✓ Test with sample data
3. Import your actual AI conversations
4. Set up voice search (add OPENAI_API_KEY)
5. Deploy to production
6. Add team collaboration features
7. Build iOS app

## Support

- GitHub: https://github.com/milla-jovovich/mempalace
- Issues: Report bugs in the imem.ai repo
- Docs: See MemPalace docs for CLI usage
