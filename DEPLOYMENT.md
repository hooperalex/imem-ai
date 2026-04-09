# imem.ai - Deployment Guide

## ✅ Shipped in 60 Minutes!

**Live URL**: https://imem-web.vercel.app

## What We Built

### Features
- ✅ Landing page with gradient design
- ✅ Dashboard with memory search
- ✅ Voice UI mockup (modal)
- ✅ Memory detail views
- ✅ Responsive design
- ✅ Dark theme
- ✅ Mock data (3 memories)

### Tech Stack
- Next.js 15 (App Router)
- React 19
- TailwindCSS
- TypeScript
- Deployed on Vercel

## Next Steps (Post-MVP)

### Immediate (Next 24 hours)
1. **Custom Domain Setup**
   - Point imem.ai DNS to Vercel
   - Add domain in Vercel dashboard
   - SSL auto-configured

2. **Connect MemPalace Backend**
   - Set up FastAPI backend
   - Integrate ChromaDB
   - Replace mock data with real search

3. **Authentication**
   - Add Clerk or Supabase Auth
   - User registration/login
   - Protected routes

### Week 1
- Browser extension for auto-capture
- Import Claude/ChatGPT exports
- Real voice integration (OpenAI Realtime API)
- Payment integration (Stripe)

### Week 2-4
- iOS app (WKWebView wrapper + native voice)
- Analytics (PostHog)
- Email notifications
- Team features

## Custom Domain Setup

1. Go to your domain registrar (e.g., Namecheap, Cloudflare)
2. Add these DNS records:

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

3. In Vercel dashboard:
   - Go to Project Settings > Domains
   - Add `imem.ai` and `www.imem.ai`
   - Wait for DNS propagation (5-30 minutes)

## Local Development

```bash
cd imem-web
npm install
npm run dev
```

Open http://localhost:3000

## Deploy Updates

```bash
git add .
git commit -m "Your changes"
git push
# Vercel auto-deploys from main branch
```

Or manual deploy:
```bash
npx vercel --prod
```

## Environment Variables (for later)

Add these in Vercel Dashboard > Settings > Environment Variables:

```
NEXT_PUBLIC_API_URL=https://api.imem.ai
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_...
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_...
```

## Performance
- Lighthouse Score Target: 95+
- First Contentful Paint: <1s
- Time to Interactive: <2s

## Monitoring
- Vercel Analytics (built-in)
- Add Sentry for error tracking
- Add PostHog for product analytics

---

Built with ❤️ using MemPalace technology
