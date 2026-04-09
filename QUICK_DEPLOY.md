# Deploy imem.ai in 10 Minutes

## Step-by-Step Deployment

### 1. Deploy Provisioner to Railway

**Option A: Via GitHub (Recommended)**

1. Create GitHub repo:
```bash
cd provisioner
gh repo create imem-provisioner --public --source=. --remote=origin
git push -u origin main
```

2. Go to [railway.app](https://railway.app)
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select `imem-provisioner`
6. Railway auto-detects Node.js and deploys ✅

7. Add domain:
   - Click project → Settings → Generate Domain
   - Copy URL: `https://imem-provisioner.up.railway.app`

**Option B: Railway CLI**

```bash
npm install -g @railway/cli
cd provisioner
railway login
railway init
railway up
railway domain
```

---

### 2. Update Frontend

1. Set API URL in Vercel:
```bash
cd imem-web
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://imem-provisioner.up.railway.app

vercel --prod
```

---

### 3. Test It!

**Create Account:**
```bash
curl -X POST https://imem-provisioner.up.railway.app/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@imem.ai","password":"test123"}'
```

**Response:**
```json
{
  "success": true,
  "userId": "test-abc123",
  "endpoint": "http://localhost:8001",
  "message": "Account created! Your MemPalace is ready."
}
```

**Or via Web UI:**
1. Visit https://imem-web.vercel.app
2. Click "Get Started"
3. Enter email + password
4. ✅ Account created!

---

## Production Checklist

### Security
- [ ] Add password hashing (bcrypt)
- [ ] Add JWT tokens
- [ ] Enable HTTPS only
- [ ] Add rate limiting
- [ ] Set CORS properly

### Scaling
- [ ] Add Redis for session storage
- [ ] Set up PostgreSQL (replace JSON file)
- [ ] Configure auto-scaling
- [ ] Add monitoring (Sentry)

### Billing
- [ ] Add Stripe secret key
- [ ] Test usage reporting
- [ ] Set up webhooks
- [ ] Add payment UI

### Infrastructure
- [ ] Set up backups
- [ ] Configure CDN
- [ ] Add health checks
- [ ] Set up logging

---

## Environment Variables

**Provisioner (Railway):**
```
STRIPE_SECRET_KEY=sk_live_...
DATABASE_URL=postgresql://...
PORT=3001
NODE_ENV=production
```

**Frontend (Vercel):**
```
NEXT_PUBLIC_API_URL=https://imem-provisioner.up.railway.app
```

---

## Monitoring

**Railway Dashboard:**
- View logs: `railway logs`
- Check metrics: Railway dashboard
- Scale: Settings → Auto-scale

**Vercel Dashboard:**
- Analytics built-in
- Function logs
- Performance metrics

---

## Cost Breakdown

### Railway (Provisioner)
- Free: $5 credit/month
- After: $0.10/GB RAM/hour
- ~10 users: Free
- ~100 users: $20/month

### Vercel (Frontend)
- Hobby: Free (personal)
- Pro: $20/month (commercial)

### Total for 100 users:
- Hosting: ~$40/month
- Revenue (@$2/user): $200/month
- **Profit: $160/month**

---

## Support

**Railway Issues:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**Deployment Help:**
- GitHub Issues
- Check logs: `railway logs`

---

## Next Steps

1. ✅ Deploy provisioner (5 min)
2. ✅ Update frontend env (1 min)
3. ✅ Test signup flow (1 min)
4. 🚀 Launch!
5. 📈 Monitor growth
6. 💰 Scale as needed

**You're ready to go live!** 🎉
