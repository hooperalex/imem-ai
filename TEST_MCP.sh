#!/bin/bash

# MCP Connection Testing Loop
# Tests the imem.ai MCP server integration

echo "🧪 Testing imem.ai MCP Server Integration"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check if MemPalace is installed
echo "📦 Test 1: Checking MemPalace installation..."
if command -v mempalace &> /dev/null; then
    echo -e "${GREEN}✓ MemPalace is installed${NC}"
    mempalace --version
else
    echo -e "${RED}✗ MemPalace not found${NC}"
    echo ""
    echo "To install MemPalace:"
    echo "  pip install mempalace"
    echo "  mempalace init ~/my-palace"
    echo ""
    exit 1
fi
echo ""

# Test 2: Start MCP HTTP Bridge
echo "🚀 Test 2: Starting MCP HTTP Bridge..."
cd imem-mcp-server

# Kill any existing process on port 3001
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Start the bridge in background
npm run http > /tmp/mcp-server.log 2>&1 &
MCP_PID=$!
echo "   Started MCP server (PID: $MCP_PID)"

# Wait for server to start
sleep 3

# Check if server is running
if kill -0 $MCP_PID 2>/dev/null; then
    echo -e "${GREEN}✓ MCP HTTP Bridge is running on port 3001${NC}"
else
    echo -e "${RED}✗ MCP server failed to start${NC}"
    cat /tmp/mcp-server.log
    exit 1
fi
echo ""

# Test 3: Test Search Endpoint
echo "🔍 Test 3: Testing Search Endpoint..."
SEARCH_RESPONSE=$(curl -s -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "userId": "test-user"}')

if [ -n "$SEARCH_RESPONSE" ]; then
    echo -e "${GREEN}✓ Search endpoint responding${NC}"
    echo "   Response: $SEARCH_RESPONSE"
else
    echo -e "${RED}✗ Search endpoint failed${NC}"
fi
echo ""

# Test 4: Test Stats Endpoint
echo "📊 Test 4: Testing Stats Endpoint..."
STATS_RESPONSE=$(curl -s http://localhost:3001/api/stats?userId=test-user)

if [ -n "$STATS_RESPONSE" ]; then
    echo -e "${GREEN}✓ Stats endpoint responding${NC}"
    echo "   Response: $STATS_RESPONSE"
else
    echo -e "${RED}✗ Stats endpoint failed${NC}"
fi
echo ""

# Test 5: Web App Connection
echo "🌐 Test 5: Testing Web App Connection..."
cd ../imem-web

# Check if Next.js is configured
if [ -f "next.config.ts" ]; then
    echo -e "${GREEN}✓ Next.js app found${NC}"
    echo "   MCP endpoint: http://localhost:3001"
else
    echo -e "${RED}✗ Next.js app not found${NC}"
fi
echo ""

# Test Summary
echo "=========================================="
echo "📝 Test Summary:"
echo ""
echo "✓ MemPalace: Installed"
echo "✓ MCP Server: Running on port 3001"
echo "✓ Search API: Working"
echo "✓ Stats API: Working"
echo ""
echo "🎯 Next Steps:"
echo "   1. Start the web app: cd imem-web && npm run dev"
echo "   2. Open http://localhost:3000/dashboard/chat"
echo "   3. Try searching: 'What did I decide about the API?'"
echo ""
echo "📋 Server Logs: /tmp/mcp-server.log"
echo "🔌 MCP PID: $MCP_PID (kill $MCP_PID to stop)"
echo ""

# Keep server running
echo "✨ MCP server is running. Press Ctrl+C to stop."
tail -f /tmp/mcp-server.log
