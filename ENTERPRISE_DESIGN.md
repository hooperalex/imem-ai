# imem.ai - Enterprise Design System

## Design Principles

1. **Fast**: Sub-200ms interactions, instant search
2. **Clean**: Remove all clutter, focus on content
3. **Smart**: Proactive suggestions, intelligent organization
4. **Trustworthy**: Enterprise security, audit logs, compliance

---

## Visual Identity

### Colors (Professional)
```
Primary:    #2563EB (Blue 600) - Trust, professional
Accent:     #7C3AED (Purple 600) - Intelligence, premium
Success:    #059669 (Emerald 600)
Warning:    #D97706 (Amber 600)
Danger:     #DC2626 (Red 600)

Background: #FAFAFA (Gray 50) - Light mode
            #0A0A0A (Near black) - Dark mode

Text:       #171717 (Gray 900) - Primary
            #525252 (Gray 600) - Secondary
            #A3A3A3 (Gray 400) - Tertiary
```

### Typography
```
Headings:  SF Pro Display / Inter (System fonts)
Body:      SF Pro Text / Inter
Code:      SF Mono / JetBrains Mono
Sizes:     12px, 14px, 16px, 20px, 24px, 32px, 48px
```

### Spacing
```
Base: 4px
Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96
```

---

## Layout Architecture

### Main App Structure
```
┌─────────────────────────────────────────────────────┐
│ [Logo] Search...              [Voice] [Settings] [•]│ ← Top Bar
├──────┬──────────────────────────────────────────────┤
│      │                                              │
│ Nav  │           Main Content Area                  │
│      │                                              │
│ [📥] │  ┌────────────────────────────────────────┐ │
│ [🔍] │  │                                        │ │
│ [💬] │  │     Content with breathing room        │ │
│ [📊] │  │                                        │ │
│ [⚙️] │  └────────────────────────────────────────┘ │
│      │                                              │
│      │  Sidebar (contextual)                        │
└──────┴──────────────────────────────────────────────┘
```

### Navigation (Left Sidebar - 64px)
```
Imports      [📥]
Search       [🔍]
Chat         [💬]
Analytics    [📊]
Settings     [⚙️]
───────────────────
Teams        [👥] ← Enterprise
Admin        [🔐] ← Enterprise
```

### Enterprise Features
```
┌─ Workspace Switcher ────────┐
│ ▼ Acme Corp                 │
│   ├─ Engineering            │
│   ├─ Product                │
│   └─ Executive              │
│                             │
│ + Create Workspace          │
└─────────────────────────────┘
```

---

## Key Screens

### 1. Dashboard (Reimagined)
```
┌─────────────────────────────────────────────────────┐
│ Good morning, Alex                                  │
│                                                     │
│ Quick Search _________________________________ [🎤] │
│                                                     │
│ Recent Activity                    This Week ▼     │
│ ┌─────────────────────────────────────────────┐    │
│ │ 🟢 API Architecture Discussion              │    │
│ │    with Claude • 2 hours ago                │    │
│ │                                              │    │
│ │ 🔵 Database Migration Plan                  │    │
│ │    with ChatGPT • Yesterday                 │    │
│ └─────────────────────────────────────────────┘    │
│                                                     │
│ Your Memory Palace                                  │
│ ┌───────┐ ┌───────┐ ┌───────┐                     │
│ │ 📁    │ │ 👥    │ │ 💡    │                     │
│ │ 142   │ │ 12    │ │ 89    │                     │
│ │Projects│ People │ Ideas  │                     │
│ └───────┘ └───────┘ └───────┘                     │
│                                                     │
│ Insights                              View all →   │
│ • You discuss React hooks 3× more this month       │
│ • 5 decisions pending follow-up                    │
└─────────────────────────────────────────────────────┘
```

### 2. Search Interface (Enterprise)
```
┌─────────────────────────────────────────────────────┐
│ Search your organization's memory                   │
│ ________________________________________________    │
│                                                     │
│ Filters: [All Time ▼] [All Teams ▼] [All Types ▼] │
│                                                     │
│ Results (127)                         Sort: Recent ▼│
│                                                     │
│ ┌─────────────────────────────────────────────┐    │
│ │ API Architecture Decision                    │    │
│ │ Decided to use REST over GraphQL for v1...  │    │
│ │ 📁 Engineering • Claude • 2 hours ago       │    │
│ │ 👤 Alex Chen, Maya Patel                    │    │
│ └─────────────────────────────────────────────┘    │
│                                                     │
│ ┌─────────────────────────────────────────────┐    │
│ │ Database Migration Strategy                  │    │
│ │ PostgreSQL chosen for JSON support and...   │    │
│ │ 📁 Engineering • ChatGPT • Yesterday        │    │
│ │ 👤 Alex Chen                                 │    │
│ └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### 3. Chat Interface (New)
```
┌─────────────────────────────────────────────────────┐
│ Ask your memories                              [🎤] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  You: What did we decide about the API?            │
│                                                     │
│  imem.ai: Based on your conversation with Claude   │
│  on March 15th, you decided to use REST instead    │
│  of GraphQL for the initial API...                 │
│                                                     │
│  Sources:                                          │
│  • API Architecture Discussion (2 hours ago)       │
│  • GraphQL Evaluation (Last week)                  │
│                                                     │
│  [View full conversation →]                        │
│                                                     │
│ ─────────────────────────────────────────────────  │
│                                                     │
│ Ask a follow-up... __________________________ [↑]  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4. Import (Drag & Drop)
```
┌─────────────────────────────────────────────────────┐
│ Import Conversations                                │
│                                                     │
│ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
│                                                     │
│ │         📥                                    │ │
│ │   Drag files here or click to browse         │ │
│ │                                              │ │
│ │   Supports: Claude, ChatGPT, Gemini exports  │ │
│                                                     │
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │
│                                                     │
│ Recent Imports                                      │
│ ✓ claude_export.json • 142 conversations           │
│ ✓ chatgpt_data.json • 89 conversations             │
│                                                     │
│ [Import More]                                       │
└─────────────────────────────────────────────────────┘
```

### 5. Analytics (Enterprise)
```
┌─────────────────────────────────────────────────────┐
│ Team Analytics                    Last 30 days ▼   │
│                                                     │
│ ┌──────────────┬──────────────┬──────────────┐     │
│ │  42,315      │  1,247       │  23          │     │
│ │  Memories    │  Searches    │  Active Users│     │
│ │  ↑ 12%       │  ↑ 8%        │  ↑ 4%        │     │
│ └──────────────┴──────────────┴──────────────┘     │
│                                                     │
│ Memory Growth                                       │
│ [Line chart showing growth over time]               │
│                                                     │
│ Top Contributors        Most Searched Topics        │
│ 1. Alex Chen (1.2K)    1. API Design (234)         │
│ 2. Maya Patel (892)    2. React Patterns (187)     │
│ 3. Jordan Kim (654)    3. Database Schema (143)    │
│                                                     │
│ [Export Report]                                     │
└─────────────────────────────────────────────────────┘
```

---

## Enterprise Features

### Multi-Workspace
```typescript
interface Workspace {
  id: string
  name: string
  plan: 'free' | 'team' | 'enterprise'
  members: Member[]
  permissions: Permission[]
}
```

### Role-Based Access
```
Owner:    Full access + billing
Admin:    Manage members, view analytics
Member:   Search, import, chat
Viewer:   Search only (read-only)
```

### Audit Logs
```
┌─────────────────────────────────────────────────────┐
│ Audit Log                                           │
│                                                     │
│ 2026-04-09 14:32  Alex Chen imported 142 memories  │
│ 2026-04-09 14:15  Maya Patel invited Jordan Kim    │
│ 2026-04-09 13:45  Alex Chen updated workspace plan │
│                                                     │
│ [Export] [Filter]                                   │
└─────────────────────────────────────────────────────┘
```

### SSO / SAML
```
Enterprise authentication via:
• Okta
• Azure AD
• Google Workspace
• OneLogin
```

---

## Voice Interface (Premium)

### Voice Mode (Floating)
```
┌─────────────────────┐
│                     │
│        🎤           │
│    Listening...     │
│                     │
│   ━━━━━━━━━━━━━     │ ← Waveform
│                     │
│ "What did we..."    │
│                     │
│     [Stop]          │
│                     │
└─────────────────────┘
```

### Voice Settings
```
Voice:     Alloy / Echo / Fable / Onyx / Nova / Shimmer
Speed:     0.5× — 1.0× — 1.5× — 2.0×
Quality:   Standard / HD
Language:  English (US) / English (UK) / ...
```

---

## Mobile (iOS) Design

### Tab Bar Navigation
```
┌─────────────────────────────────────┐
│                                     │
│          Content Area               │
│                                     │
├─────┬─────┬─────┬─────┬─────────────┤
│  🔍 │ 💬  │ 🎤  │ 📥  │  ⚙️         │
│Search Chat Voice Import Settings  │
└─────┴─────┴─────┴─────┴─────────────┘
```

### Voice-First (iOS)
```
Large tap target for voice
Quick access from anywhere
Offline search (cached)
```

---

## Tech Stack (Enterprise)

### Frontend
```
Framework:  Next.js 15
UI:         Radix UI + Tailwind
State:      Zustand / Jotai
Auth:       Clerk (with SSO)
Analytics:  PostHog
Monitoring: Sentry
```

### Backend
```
API:        FastAPI (Python)
Database:   PostgreSQL (Supabase)
Vectors:    ChromaDB → Pinecone (scale)
Cache:      Redis
Queue:      BullMQ / Celery
Search:     MemPalace core
```

### Infrastructure
```
Frontend:   Vercel
Backend:    Railway / Fly.io
Database:   Supabase
Storage:    S3 / R2
CDN:        Cloudflare
```

---

## Performance Targets

```
Search:         < 200ms (p95)
Voice latency:  < 300ms (end-to-end)
Page load:      < 1s (p95)
Import speed:   1000 memories/sec
Uptime:         99.9%
```

---

## Security (Enterprise)

```
✓ SOC 2 Type II compliance
✓ GDPR compliant
✓ End-to-end encryption option
✓ SSO / SAML
✓ Audit logs (7 years retention)
✓ Data residency options (US/EU/Asia)
✓ Role-based access control
✓ Two-factor authentication
✓ IP allowlisting
✓ Data export/delete on demand
```

---

## Pricing (Enterprise Tiers)

### Free
- 100 MB storage
- 1 workspace
- 1 user
- Basic support

### Team ($49/month)
- 100 GB storage
- Unlimited workspaces
- Up to 10 users
- Priority support
- Analytics
- API access

### Enterprise (Custom)
- Unlimited storage
- Unlimited users
- SSO / SAML
- Dedicated support
- SLA (99.9%)
- Custom contracts
- On-premise option

---

This is **professional, scalable, enterprise-ready**.

Want me to build this?
