# imem.ai - Simple Pricing Model

## Business Model: Storage-Based SaaS

**Core Principle**: Charge 2× our storage costs. Dead simple.

---

## Cost Structure

### Our Costs
- **Vector DB** (ChromaDB/Pinecone): $0.15/GB/month
- **Metadata DB** (Supabase Postgres): $0.10/GB/month
- **Total**: ~$0.25/GB/month

### Our Price
- **$0.50/GB/month** (2× markup)
- Competitive with Dropbox ($1.25/GB), Google Drive ($0.83/GB)
- But for AI memory, not files

---

## Pricing Tiers

### 🆓 Free Tier
```
Storage:     100 MB (~1,000 memories)
Search:      Unlimited
Integrations: 1 AI assistant
Voice:       ❌
Export:      ❌
Price:       $0/month
```

**Target**: Students, casual users, trial

---

### 💳 Pay-As-You-Go (DEFAULT)
```
Storage:     $0.50/GB/month
Search:      Unlimited
Integrations: All AI assistants
Voice:       ✅
Export:      ✅
Price:       Usage-based
```

**Example Bills**:
- 1 GB (10K memories) = $0.50/mo
- 5 GB (50K memories) = $2.50/mo
- 10 GB (100K memories) = $5/mo

**Target**: Knowledge workers, developers, regular AI users

---

### ♾️ Unlimited Plan
```
Storage:     Up to 100 GB
Everything:  Included
Price:       $49/month (flat)
```

**Target**: Power users, researchers, teams

---

## Real-World Examples

| User Type | Memories | Storage | Monthly Cost |
|-----------|----------|---------|--------------|
| Student | 2K | 200 MB | **Free** |
| Developer | 10K | 1 GB | **$0.50** |
| Writer | 50K | 5 GB | **$2.50** |
| Researcher | 200K | 20 GB | **$10** |
| Team (5 users) | 500K | 50 GB | **$25** |
| Power User | 1M+ | 100 GB | **$49** (capped) |

**Average User**: ~$1-3/month

---

## Conversion Strategy

### Free → Paid Triggers
1. Hit 100 MB limit (notification)
2. Want voice search (premium feature)
3. Need export/API access
4. Add 2nd AI integration

### Upgrade Flow
```
You've used 95 MB of 100 MB

[ Keep Free ]  [ Upgrade to Pay-As-You-Go ]

With Pay-As-You-Go:
✓ Unlimited storage ($0.50/GB)
✓ Voice search
✓ All AI integrations
✓ Export your data

Only pay for what you use!
```

---

## Revenue Projections

### Conservative (Year 1)

| Month | Users | Paid % | Avg $/user | MRR |
|-------|-------|--------|------------|-----|
| 1 | 100 | 10% | $2 | $20 |
| 3 | 500 | 15% | $2 | $150 |
| 6 | 2K | 20% | $2.50 | $1K |
| 12 | 10K | 25% | $3 | $7.5K |

**Year 1 ARR**: ~$90K

### Optimistic (Year 1)

| Month | Users | Paid % | Avg $/user | MRR |
|-------|-------|--------|------------|-----|
| 1 | 500 | 15% | $2 | $150 |
| 3 | 2K | 20% | $2.50 | $1K |
| 6 | 10K | 25% | $3 | $7.5K |
| 12 | 50K | 30% | $4 | $60K |

**Year 1 ARR**: ~$720K

---

## Why This Works

### ✅ Advantages
1. **Simple**: No complex tiers or feature gates
2. **Fair**: Only pay for what you use
3. **Scalable**: Costs scale linearly
4. **Competitive**: Cheaper than Mem0 ($19/mo), Zep ($25/mo)
5. **Sticky**: More data = harder to leave

### 🎯 Target Customer
- Uses AI daily (Claude, ChatGPT, etc.)
- Has valuable conversations worth saving
- Willing to pay $1-5/month
- 25-45 years old
- Knowledge worker / creative / developer

---

## Billing Implementation

### Stack
- **Stripe** (usage-based billing)
- **Supabase** (track storage per user)
- **Cron job** (daily storage calculation)

### Flow
```
1. User signs up → Free tier (100 MB)
2. Imports conversations → Storage tracked
3. Hits 95 MB → Prompt to upgrade
4. Upgrades → Enter card (Stripe)
5. Daily: Calculate storage → Report to Stripe
6. Monthly: Stripe charges $0.50/GB
```

### Code Example
```typescript
// Daily cron job
async function calculateBilling() {
  const users = await db.users.findMany({ plan: 'pay-as-you-go' })

  for (const user of users) {
    const storageGB = await getStorageUsage(user.id) / 1024
    const cost = storageGB * 0.50

    await stripe.usageRecords.create({
      subscription_item: user.stripe_subscription_item,
      quantity: Math.ceil(storageGB * 100), // cents
      timestamp: Math.floor(Date.now() / 1000),
    })
  }
}
```

---

## Marketing Copy

### Landing Page
> **Never lose an AI conversation again**
>
> Store, search, and talk to every conversation you've ever had with Claude, ChatGPT, or Gemini.
>
> **Free up to 1,000 memories. Then just $0.50/GB.**

### Pricing Page
> **Simple, usage-based pricing**
>
> Start free. Upgrade when you need more.
> Only pay for the storage you actually use.
>
> Most users pay less than **$3/month**.

---

## Next Steps

1. **This Week**: Deploy pricing page to imem-web
2. **Week 1**: Integrate Stripe
3. **Week 2**: Add storage tracking
4. **Week 3**: Launch public beta with pricing
5. **Month 2**: Hit $1K MRR

---

**TL;DR**: Charge $0.50/GB (2× cost). Free tier gets 100 MB. Average user pays $1-3/month. Simple, fair, profitable.
