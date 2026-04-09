#!/bin/bash

# imem.ai - Quick Start Script

echo "🚀 Starting imem.ai..."
echo ""

# Build MemPalace image
echo "📦 Building MemPalace Docker image..."
cd mempalace-review
docker build -t imem-mempalace:latest . || {
  echo "❌ Failed to build MemPalace image"
  exit 1
}
cd ..

# Create data directory
echo "📁 Creating data directory..."
mkdir -p data/users

# Start provisioner
echo "🔧 Starting provisioner..."
cd provisioner
npm install > /dev/null 2>&1
npm start &
PROVISIONER_PID=$!
cd ..

# Wait for provisioner
echo "⏳ Waiting for provisioner to start..."
sleep 3

# Create demo user
echo "👤 Creating demo user..."
curl -s -X POST http://localhost:3001/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@imem.ai","password":"demo123"}' | jq .

echo ""
echo "✅ imem.ai is ready!"
echo ""
echo "📊 Provisioner:  http://localhost:3001"
echo "🌐 Web UI:       http://localhost:3000 (run 'npm run dev' in imem-web)"
echo ""
echo "👤 Demo account:"
echo "   Email:    demo@imem.ai"
echo "   Password: demo123"
echo ""
echo "🛑 To stop: kill $PROVISIONER_PID"
