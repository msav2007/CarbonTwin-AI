# CarbonTwin AI — MVP Architecture

## Scope (10 Features Only)

| # | Feature | Purpose |
|---|---------|---------|
| 1 | Landing Page | Judge first impression, demo CTA |
| 2 | Auth (Supabase) | User accounts, data persistence |
| 3 | 5-Step Onboarding | Collect lifestyle inputs fast |
| 4 | Carbon Twin Generation | AI avatar + footprint score |
| 5 | Dashboard | Central hub, budget meter |
| 6 | Future Simulator | Project emissions 1/5/10 years |
| 7 | What-If Time Machine | Compare lifestyle scenarios |
| 8 | AI Receipt Analysis | Photo → carbon impact (Gemini Vision) |
| 9 | Twin Speaks | AI narration of your twin |
| 10 | Carbon Budget Meter | Daily/monthly carbon allowance |

**Removed:** Leaderboards, friends, challenges, streaks, gamification, voice onboarding, regional benchmarks, social.

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind, ShadCN, Framer Motion
- **Auth + DB:** Supabase (Auth, Postgres, Storage for receipts)
- **AI:** Google Gemini 1.5 Flash (text + vision)
- **Deploy:** Vercel

---

## Folder Structure

```
carbontwin-ai/
├── docs/
│   └── MVP_PLAN.md
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── simulator/page.tsx
│   │   │   ├── time-machine/page.tsx
│   │   │   ├── receipts/page.tsx
│   │   │   └── layout.tsx
│   │   ├── onboarding/page.tsx
│   │   ├── api/
│   │   │   ├── twin/generate/route.ts
│   │   │   ├── twin/speak/route.ts
│   │   │   ├── simulator/route.ts
│   │   │   ├── time-machine/route.ts
│   │   │   └── receipts/analyze/route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                    # ShadCN primitives
│   │   ├── landing/               # Landing page sections
│   │   ├── onboarding/            # 5-step wizard
│   │   ├── dashboard/             # Dashboard widgets
│   │   ├── twin/                  # Twin avatar + speaks
│   │   ├── simulator/             # Future simulator UI
│   │   └── shared/                # Navbar, footer, loaders
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── gemini/
│   │   │   └── client.ts
│   │   └── carbon/
│   │       └── calculator.ts
│   ├── hooks/
│   ├── types/
│   │   └── index.ts
│   └── store/
│       └── onboarding.ts
├── .env.example
├── .env.local                     # gitignored
├── middleware.ts
└── supabase/
    └── schema.sql
```

---

## Implementation Order

### Day 1 — Foundation + Wow Entry
1. ✅ Scaffold Next.js, Tailwind, ShadCN, folder structure
2. ✅ Landing page (hero, features, CTA, animations)
3. Supabase project + auth (login/signup)
4. Middleware + protected routes

### Day 2 — Core AI Loop
5. 5-step onboarding (Zustand state → Supabase profile)
6. Gemini twin generation API + twin display
7. Dashboard shell + carbon budget meter
8. Twin Speaks narration endpoint

### Day 3 — Demo Features + Polish
9. Future Simulator (Gemini projections)
10. What-If Time Machine (scenario compare)
11. AI Receipt Analysis (upload + Gemini Vision)
12. Animations polish, mobile responsive, Vercel deploy

---

## Development Roadmap

| Phase | Deliverable | Judge Impact |
|-------|-------------|--------------|
| P0 | Landing + Auth | Professional first impression |
| P1 | Onboarding + Twin Gen | Core "aha" moment |
| P2 | Dashboard + Budget Meter | Data visualization wow |
| P3 | Simulator + Time Machine | Forward-looking AI |
| P4 | Receipts + Twin Speaks | Multimodal AI showcase |
| P5 | Polish + Deploy | Reliability for judges |

---

## Critical Files

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Landing page entry |
| `src/app/(auth)/login/page.tsx` | Auth flow |
| `src/app/onboarding/page.tsx` | 5-step wizard |
| `src/app/api/twin/generate/route.ts` | Twin generation |
| `src/lib/gemini/client.ts` | Gemini SDK wrapper |
| `src/lib/supabase/client.ts` | Browser Supabase |
| `middleware.ts` | Route protection |
| `supabase/schema.sql` | DB schema |
| `.env.example` | Env template |

---

## Required npm Packages

```bash
# Core (installed)
next react react-dom typescript tailwindcss
@supabase/supabase-js @supabase/ssr
@google/generative-ai
framer-motion lucide-react
class-variance-authority clsx tailwind-merge tailwindcss-animate
zustand sonner @radix-ui/react-slot
```

---

## Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Enable Email auth (Authentication → Providers → Email)
3. Run `supabase/schema.sql` in SQL Editor
4. Copy Project URL + anon key + service role key to `.env.local`
5. Add redirect URLs: `http://localhost:3000/**` and production URL
6. Create Storage bucket `receipts` (public: false)

---

## Gemini Integration

1. Get API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Add `GEMINI_API_KEY` to `.env.local`
3. Use `src/lib/gemini/client.ts` — server-side only (API routes)
4. Models: `gemini-1.5-flash` (text), `gemini-1.5-flash` (vision for receipts)
5. Never expose key client-side

---

## Vercel Deployment

1. Push repo to GitHub
2. Import in [vercel.com](https://vercel.com) → New Project
3. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`
4. Deploy
5. Add Vercel URL to Supabase redirect URLs
6. Test auth + API routes in production
