# CarbonTwin AI — Folder Structure

```
carbontwin-ai/
├── .env.example                 # Environment variable template
├── .env.local                   # Local secrets (gitignored)
├── components.json              # ShadCN configuration
├── FOLDER_STRUCTURE.md          # This file
├── package.json                 # Dependencies & scripts
├── tailwind.config.ts           # Tailwind theme + animations
├── tsconfig.json
├── next.config.mjs
├── middleware.ts                # Auth route protection (Day 1)
│
├── docs/
│   └── MVP_PLAN.md              # Architecture & roadmap
│
├── public/
│   └── images/                  # Static assets
│
├── supabase/
│   └── schema.sql               # Database schema
│
└── src/
    ├── app/
    │   ├── (auth)/
    │   │   ├── login/page.tsx
    │   │   └── signup/page.tsx
    │   ├── (dashboard)/         # Protected routes (Day 2+)
    │   │   ├── dashboard/page.tsx
    │   │   ├── simulator/page.tsx
    │   │   ├── time-machine/page.tsx
    │   │   └── receipts/page.tsx
    │   ├── api/                 # Gemini API routes (Day 2+)
    │   │   ├── twin/
    │   │   ├── simulator/
    │   │   ├── time-machine/
    │   │   └── receipts/
    │   ├── onboarding/page.tsx
    │   ├── layout.tsx           # Root layout, fonts, metadata
    │   ├── page.tsx             # Landing page entry
    │   ├── globals.css          # Design tokens & utilities
    │   └── fonts/               # Geist local fonts
    │
    ├── components/
    │   ├── ui/                  # ShadCN primitives
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── badge.tsx
    │   │   └── separator.tsx
    │   ├── landing/             # Landing page sections
    │   │   ├── ambient-background.tsx
    │   │   ├── navbar.tsx
    │   │   ├── hero.tsx
    │   │   ├── features.tsx
    │   │   ├── how-it-works.tsx
    │   │   ├── cta.tsx
    │   │   ├── footer.tsx
    │   │   ├── section-header.tsx
    │   │   ├── logo-marquee.tsx
    │   │   └── twin-preview.tsx
    │   └── shared/
    │       └── container.tsx
    │
    ├── lib/
    │   ├── utils.ts
    │   ├── supabase/
    │   ├── gemini/
    │   └── carbon/
    │
    ├── hooks/
    ├── store/
    └── types/
```
