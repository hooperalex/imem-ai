# imem.ai

**AI memory for everyone. Built on MemPalace.**

Simple, isolated, pay-as-you-go AI memory service.

---

## What is this?

imem.ai makes your AI conversations permanent and searchable.

- **Sign up** → Get your own MemPalace instance
- **Import** → Claude, ChatGPT, Gemini conversations
- **Search** → Find anything instantly (96.6% accuracy)
- **Voice** → Talk to your memories
- **Pay** → Only for storage you use ($0.50/GB)

---

## Architecture

```
User signs up
    ↓
Docker container spins up (isolated)
    ├─ MemPalace
    ├─ ChromaDB
    └─ MCP server
    ↓
User's data (private)
    ↓
Bill: $0.50/GB/month
```

**Super simple**: 1 user = 1 container = isolated memory palace

---

## Quick Start

### Option 1: One Command
```bash
chmod +x start.sh
./start.sh
```

### Option 2: Manual
```bash
# 1. Build MemPalace
cd mempalace-review
docker build -t imem-mempalace:latest .

# 2. Start provisioner
cd provisioner
npm install
npm start

# 3. Create user
curl -X POST http://localhost:3001/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"yourpass"}'

# 4. Start web UI
cd imem-web
npm install
npm run dev
```

---

## Features

### For Users
- ✅ 100 MB free storage
- ✅ Unlimited search
- ✅ All AI assistants (Claude, ChatGPT, Gemini)
- ✅ Voice interface (premium)
- ✅ Complete data privacy (your own container)
- ✅ Export anytime

### For You (Business)
- ✅ Simple deployment (Docker)
- ✅ Auto-scaling (Railway/Fly.io)
- ✅ Usage-based billing (Stripe)
- ✅ No multi-tenant complexity
- ✅ Easy debugging (1 user = 1 container)
- ✅ Built on proven tech (MemPalace: 96.6% accuracy)

---

## Project Structure

```
imem-ai/
├── imem-web/              # Frontend (Next.js)
│   ├── app/dashboard/     # Main app
│   └── lib/api.ts         # API client
├── provisioner/           # User provisioning service
│   └── index.js           # Spins up containers
├── mempalace-review/      # MemPalace (core engine)
│   ├── mempalace/         # Python package
│   └── Dockerfile         # Per-user container
├── data/                  # User data (created on first run)
│   └── users/
│       ├── user1/         # Isolated storage
│       ├── user2/
│       └── ...
├── docker-compose.yml     # Full stack
└── start.sh               # Quick start script
```

---

## Deployment

### Local (Development)
```bash
./start.sh
```

### Production (Railway)
```bash
railway login
railway up
```

### Production (Fly.io)
```bash
fly deploy
fly scale count 10
```

---

## Pricing

**Free Tier**
- 100 MB storage
- ~1,000 memories
- Basic features

**Pay-as-you-go** (Most users)
- $0.50/GB/month
- Average: $1-3/month
- All features

**Unlimited**
- $49/month
- Up to 100 GB
- Everything included

---

## Tech Stack

- **Frontend**: Next.js 15, Radix UI, Tailwind
- **Backend**: Node.js (provisioner)
- **Memory Engine**: MemPalace (Python)
- **Database**: ChromaDB (vectors), SQLite (graph)
- **Containers**: Docker
- **Hosting**: Railway / Fly.io / AWS
- **Payments**: Stripe

---

## Documentation

- [Simple Deployment Guide](SIMPLE_DEPLOY.md)
- [Enterprise Design](ENTERPRISE_DESIGN.md)
- [Pricing Model](PRICING_MODEL.md)
- [MemPalace Repo](https://github.com/milla-jovovich/mempalace)

---

## Development

```bash
# Run provisioner
cd provisioner && npm run dev

# Run web UI
cd imem-web && npm run dev

# Build MemPalace image
cd mempalace-review && docker build -t imem-mempalace .

# Create test user
curl -X POST http://localhost:3001/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

---

## License

MIT

Built with ❤️ using [MemPalace](https://github.com/milla-jovovich/mempalace)
