# Deploy to Railway - 5 Minutes

## Quick Deploy

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login
```bash
railway login
```

### 3. Create Project
```bash
cd provisioner
railway init
# Enter project name: imem-provisioner
```

### 4. Deploy
```bash
railway up
```

### 5. Get URL
```bash
railway domain
# Your URL: https://imem-provisioner.up.railway.app
```

---

## What Gets Deployed

Railway automatically:
- ✅ Detects Node.js
- ✅ Installs dependencies
- ✅ Starts the server
- ✅ Provides HTTPS URL
- ✅ Auto-scales containers
- ✅ Handles Docker (for user containers)

---

## Environment Variables

Set in Railway dashboard:

```
STRIPE_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://... (optional, uses file-based for now)
```

---

## Test It

```bash
# Get your Railway URL
RAILWAY_URL=$(railway domain)

# Create a user
curl -X POST https://imem-provisioner.up.railway.app/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@imem.ai","password":"test123"}'

# Response:
{
  "success": true,
  "userId": "test-abc123",
  "endpoint": "https://test-abc123.imem.ai",
  "message": "Account created!"
}
```

---

## Connect Frontend

Update `imem-web/.env.production`:
```
NEXT_PUBLIC_API_URL=https://imem-provisioner.up.railway.app
```

Deploy frontend:
```bash
cd imem-web
vercel --prod
```

---

## Cost

Railway free tier:
- $5 free credit/month
- ~10 users free
- Then $0.10/GB/hour

For 100 users:
- ~$20/month hosting
- Revenue: $200/month (@ $2/user)
- **Profit: $180/month**

---

## Alternative: Fly.io

Even cheaper for containers:

```bash
# Install flyctl
brew install flyctl

# Login
fly auth login

# Deploy
fly launch
fly deploy

# Cost: $0.001/hour per container
# = $0.73/month per user
```

---

Ready in 5 minutes! 🚀
