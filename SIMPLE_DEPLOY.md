# imem.ai - Super Simple Deployment

## How It Works

**1 user signs up → 1 Docker container spins up → User gets their own MemPalace**

```
User: alex@example.com
    ↓ POST /api/signup
Container: imem-user-alex-123abc (isolated)
    ├─ MemPalace (Python)
    ├─ ChromaDB (alex's data only)
    └─ Port: 8001
    ↓
Frontend connects to: http://localhost:8001
    ↓
Bill: $0.50/GB/month
```

---

## Quick Start (Local)

### 1. Build MemPalace image
```bash
cd mempalace-review
docker build -t imem-mempalace:latest .
```

### 2. Start provisioner
```bash
cd provisioner
npm install
npm start
# Running on http://localhost:3001
```

### 3. Create a user
```bash
curl -X POST http://localhost:3001/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'

# Response:
{
  "success": true,
  "userId": "demo-abc123",
  "endpoint": "http://localhost:8001",
  "message": "Account created! Your MemPalace is ready."
}
```

### 4. User's container is now running!
```bash
docker ps
# imem-user-demo-abc123    Running    0.0.0.0:8001->8000/tcp
```

### 5. Connect frontend
```bash
cd imem-web
# Update .env.local:
NEXT_PUBLIC_API_URL=http://localhost:3001

npm run dev
# User logs in → Frontend gets their endpoint → Connects to port 8001
```

---

## User Flow

### Sign Up
```javascript
POST /api/signup
{
  "email": "user@example.com",
  "password": "secure123"
}

→ Creates user
→ Spins up Docker container
→ Returns endpoint URL
```

### Login
```javascript
POST /api/login
{
  "email": "user@example.com",
  "password": "secure123"
}

→ Returns:
{
  "userId": "user-xyz789",
  "endpoint": "http://localhost:8002",
  "storageGB": 0.5,
  "plan": "pay-as-you-go"
}
```

### Use MemPalace
```javascript
// Frontend connects to user's endpoint
const response = await fetch(`${userEndpoint}/search`, {
  method: 'POST',
  body: JSON.stringify({ query: "API decisions" })
})
```

---

## Production Deployment

### Option 1: Railway (Easiest)

```bash
# Install Railway CLI
npm install -g railway

# Login
railway login

# Deploy provisioner
cd provisioner
railway up

# Each user container runs on Railway
# Auto-scaling, auto-billing
```

### Option 2: Fly.io

```bash
# Install flyctl
brew install flyctl

# Deploy
fly deploy
fly scale count 10  # Auto-scale to 10 containers
```

### Option 3: AWS ECS/Fargate

```yaml
# Task definition per user
ECS Cluster:
  ├─ User 1: MemPalace container
  ├─ User 2: MemPalace container
  └─ User N: MemPalace container

Load Balancer → Routes user to their container
```

---

## Storage & Billing

### Automatic Daily Billing
```javascript
// Runs every 24 hours
async function calculateBilling() {
  for (user of users) {
    // 1. Calculate storage
    const storageGB = await getStorageSize(user.id)

    // 2. Bill via Stripe
    const cost = storageGB * 0.50
    await stripe.usageRecords.create({
      subscription_item: user.stripe_subscription,
      quantity: Math.ceil(storageGB * 100), // cents
    })

    // 3. Update user record
    user.storageGB = storageGB
    user.lastBilled = new Date()
  }
}
```

### Storage Tracking
```bash
# Per-user directory
/data/users/
  ├── demo-abc123/
  │   ├── palace/           # ChromaDB data
  │   ├── knowledge_graph.sqlite3
  │   └── config.json
  ├── alex-xyz789/
  │   └── ...
  └── maya-def456/
      └── ...

# Calculate usage
du -sh /data/users/demo-abc123
# 512M → 0.5 GB → $0.25/month
```

---

## API Endpoints

### Provisioner API

```
POST   /api/signup          Create user + container
POST   /api/login           Get user endpoint
GET    /api/user/:id/stats  Storage & billing info
GET    /api/admin/users     List all users (admin)
GET    /health              Health check
```

### User's MemPalace MCP (per container)

```
POST   /search              Search memories
POST   /import              Import conversations
GET    /status              Palace stats
POST   /add_memory          Add memory
# All standard MemPalace MCP tools
```

---

## Scaling

### Per-User Isolation
- ✅ Complete data isolation
- ✅ No noisy neighbors
- ✅ Easy to debug (1 user = 1 container)
- ✅ Can restart user container without affecting others

### Auto-Scaling
```bash
# Railway/Fly.io handles this automatically
# As users sign up → More containers spin up
# No users → Containers shut down (save $$$)
```

### Cost Example

| Users | Containers | Hosting Cost | Revenue (@$2/user) | Margin |
|-------|------------|--------------|-------------------|--------|
| 10    | 10         | $50/mo       | $20/mo            | -$30   |
| 100   | 100        | $200/mo      | $200/mo           | $0     |
| 1000  | 1000       | $1500/mo     | $2000/mo          | $500   |
| 10K   | 10K        | $8K/mo       | $20K/mo           | $12K   |

**Break-even: ~100 users**

---

## Frontend Integration

### Update imem-web

```typescript
// lib/api.ts
export async function signup(email: string, password: string) {
  const res = await fetch('http://localhost:3001/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}

export async function login(email: string, password: string) {
  const res = await fetch('http://localhost:3001/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()

  // Store user's endpoint
  localStorage.setItem('mempalace_endpoint', data.endpoint)
  return data
}

export async function searchMemories(query: string) {
  const endpoint = localStorage.getItem('mempalace_endpoint')

  const res = await fetch(`${endpoint}/search`, {
    method: 'POST',
    body: JSON.stringify({ query }),
  })
  return res.json()
}
```

---

## Security

### Container Isolation
- Each user's data is in separate volume
- No cross-container access
- Network isolation (optional)

### TODO (Production)
- [ ] Hash passwords (bcrypt)
- [ ] JWT tokens for auth
- [ ] HTTPS/TLS
- [ ] Rate limiting
- [ ] Firewall rules
- [ ] Secrets management

---

## Monitoring

### Health Checks
```bash
# Check provisioner
curl http://localhost:3001/health

# Check user container
docker ps | grep imem-user
docker logs imem-user-demo-abc123
```

### Metrics
- Number of active users
- Total storage across all users
- Container health
- API response times

---

## Quick Commands

```bash
# List all user containers
docker ps --filter "name=imem-user-*"

# Stop user container
docker stop imem-user-demo-abc123

# View user's data
ls -lh /data/users/demo-abc123

# Check storage
du -sh /data/users/*

# View logs
docker logs -f imem-user-demo-abc123

# Restart user container
docker restart imem-user-demo-abc123
```

---

## That's It!

**Simple**:
1. User signs up
2. Container spins up
3. User gets their MemPalace
4. Bill for storage

**No complex multi-tenancy, no shared databases, just isolated containers.**

Ready to deploy? 🚀
