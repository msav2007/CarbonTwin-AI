# CarbonTwin AI

> An AI-powered carbon footprint awareness platform that creates your personalised digital twin and coaches you toward sustainable action.

[![Tests](https://img.shields.io/badge/tests-195%20passing-brightgreen)](./src)
[![Coverage](https://img.shields.io/badge/coverage-98%25-brightgreen)](./src)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](./tsconfig.json)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

---

## Problem Statement

Personal carbon footprints are invisible. People make dozens of micro-decisions every day — what to eat, how to commute, where to shop — without any feedback on their environmental impact. Existing carbon calculators give you a number and stop there. They don't explain *why* your footprint is what it is, they don't build a model of *you*, and they don't make reducing emissions feel achievable.

The result: most people either underestimate their impact or feel paralysed by it.

## Solution

CarbonTwin AI solves this by creating a **personalised digital twin** of your carbon footprint. Instead of a generic number, you get:

- A named AI persona (`Terra-Sage`, `Ember-Root`) built from your lifestyle signals
- A precision breakdown across 5 emission categories with a single Carbon Score
- Gemini-powered coaching that speaks to your specific motivation — not a template
- What-if scenarios that let you model changes *before* committing
- 1-, 5-, and 10-year projections that make the long arc of change visible

---

## Features

| Feature | Description |
|---------|-------------|
| **Carbon Twin Generation** | AI persona derived deterministically from 8 lifestyle signals |
| **5-Category Footprint Analysis** | Transport, food, home energy, air travel, and shopping |
| **Carbon Score (0–100)** | Single score benchmarked against the 4.2t global 1.5°C target |
| **Personalised Coaching** | Gemini 1.5 Flash advice tailored to your profile and motivation |
| **Future Simulations** | Steady and ambitious 1/5/10-year reduction scenarios |
| **What-If Scenarios** | Model the impact of lifestyle changes before committing |
| **Action Plans** | Ranked, difficulty-rated recommendations with first steps |
| **Progress Tracking** | Visual dashboard tracking Carbon Score over time |
| **Live Footprint Preview** | Real-time estimate updates during onboarding |
| **Offline-First** | Core engine runs fully client-side — no backend required |

---

## AI Features

CarbonTwin uses **Google Gemini 1.5 Flash** for three distinct AI workflows:

### 1. Personalised Coaching (`/dashboard/coach`)
The rule-based coaching engine generates baseline insights. When a Gemini API key is present, it replaces generic cards with a narrative coaching response that references the user's specific category breakdown, motivation, and top recommended action.

### 2. What-If Narratives (`/dashboard/what-if`)
Users can model hypothetical lifestyle changes (e.g. "switch to transit + go vegan"). Gemini generates a narrative response describing the environmental, health, and social impact of that specific combination — not a generic template.

### 3. Twin Summary (Reveal Screen)
The Carbon Twin's opening summary is seeded by the rule-based engine and optionally enriched by Gemini to produce a more nuanced, personalised narrative.

**Graceful degradation:** all three features fall back to rule-based output when the API key is absent or the request fails.

---

## Architecture

```
artifacts/carbontwin-ai/
├── src/
│   ├── app/                        # Page-level route components (Wouter)
│   │   ├── page.tsx                # Landing page
│   │   ├── onboarding/
│   │   │   ├── page.tsx            # Onboarding wizard entry
│   │   │   └── reveal/page.tsx     # Twin reveal screen
│   │   └── dashboard/
│   │       ├── page.tsx            # Dashboard overview
│   │       ├── coach/page.tsx      # AI coaching page
│   │       ├── simulator/page.tsx  # Future simulation charts
│   │       ├── what-if/page.tsx    # What-if scenario builder
│   │       └── progress/page.tsx   # Progress tracking
│   ├── lib/
│   │   ├── carbon/                 # Core carbon engine (zero external deps)
│   │   │   ├── calculator.ts       # Main calculation entry point
│   │   │   ├── assistant.ts        # Twin/profile/coaching generation
│   │   │   ├── simulation.ts       # 1/5/10-year future simulations
│   │   │   ├── math.ts             # Pure utility functions (clamp, score, format)
│   │   │   ├── constants.ts        # Emission factors and domain labels
│   │   │   └── types.ts            # Domain type definitions
│   │   ├── gemini/
│   │   │   └── client.ts           # Gemini AI client + prompt engineering
│   │   └── onboarding/
│   │       ├── options.ts          # Wizard option definitions and metadata
│   │       └── validation.ts       # Name input sanitisation and validation
│   ├── components/
│   │   ├── ui/                     # shadcn/ui primitive components
│   │   ├── onboarding/             # Multi-step wizard + twin reveal
│   │   ├── landing/                # Marketing page components
│   │   └── shared/                 # Layout, navigation, shared atoms
│   ├── store/
│   │   └── onboarding.ts           # Zustand store with persist middleware (v2)
│   ├── hooks/                      # Custom React hooks
│   ├── types/
│   │   └── index.ts                # Global TypeScript interfaces (OnboardingData)
│   └── test/
│       └── setup.ts                # Vitest + Testing Library configuration
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Client-side carbon engine** | No backend required; instant calculation, works offline, no data leaves the browser |
| **Deterministic twin name** | Same inputs → same twin; reproducibility makes the product feel reliable |
| **Zustand + persist (v2)** | Lightweight state with schema migration support; avoids React Context prop-drilling |
| **Gemini as optional enrichment** | Product works at 100% without AI; Gemini adds depth without creating a hard dependency |
| **Wouter over React Router** | 2KB vs 50KB; sufficient for a single-SPA with < 10 routes |

---

## Carbon Score Methodology

CarbonTwin uses emission factors sourced from peer-reviewed lifecycle assessment research:

| Category | Range (kg CO₂/year) | Source basis |
|----------|---------------------|--------------|
| Transport | 80 (walk) – 3,200 (car) | Per-km emission factors × annual distance estimates |
| Food | 800 (vegan) – 2,800 (meat-heavy) | Dietary lifecycle assessments (Poore & Nemecek 2018) |
| Home Energy | 600 (low) – 2,800 (high) × household multiplier | Grid carbon intensity (IEA 2023) |
| Air Travel | 300 (rare) – 3,500 (frequent) | IPCC aviation radiative forcing factors |
| Shopping | 400 (minimal) – 2,200 (frequent) | Consumer goods embodied carbon estimates |

**Carbon Score formula:** `clamp(100 − annualKg / 100, 0, 100)`

A score of **58** represents the global average (4.2t CO₂). Higher is better.
The **1.5°C target** corresponds to ≈4,200 kg/year per person.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 6 |
| Routing | Wouter 3 |
| State | Zustand 5 (with persist middleware) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| AI | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| Animations | Framer Motion 12 |
| Charts | Recharts 2 |
| Testing | Vitest 3 + Testing Library |
| TypeScript | 5.9 |
| Package manager | pnpm (monorepo) |

---

## Installation

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9

```bash
# Clone the repository
git clone https://github.com/msav2007/CarbonTwin-AI.git
cd CarbonTwin-AI

# Install all workspace dependencies
pnpm install

# (Optional) Set environment variables
echo "VITE_GEMINI_API_KEY=your_key_here" > artifacts/carbontwin-ai/.env.local

# Start the development server
pnpm --filter @workspace/carbontwin-ai run dev
```

The app opens at the URL printed in the terminal. The `VITE_GEMINI_API_KEY` is **optional** — all core features work without it.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | Optional | Google Gemini API key — enables AI-powered coaching and narratives |
| `PORT` | Auto-set | Dev server port (Replit sets this automatically) |
| `BASE_PATH` | Auto-set | Base URL path for sub-path deployments (Replit sets this automatically) |

---

## Development

```bash
# Run development server (hot reload)
pnpm --filter @workspace/carbontwin-ai run dev

# Run all tests
pnpm --filter @workspace/carbontwin-ai run test

# Run tests in watch mode
pnpm --filter @workspace/carbontwin-ai run test:watch

# Generate coverage report
pnpm --filter @workspace/carbontwin-ai run test:coverage

# TypeScript check
pnpm --filter @workspace/carbontwin-ai run typecheck

# Lint
pnpm --filter @workspace/carbontwin-ai run lint
```

### Test Coverage

CarbonTwin maintains **≥ 95% meaningful coverage** across the carbon engine and business logic:

| Module | Coverage | What is tested |
|--------|----------|----------------|
| `lib/carbon/math.ts` | 100% | `clamp`, `sumBreakdown`, `calculateCarbonScore`, `formatTonnes` |
| `lib/carbon/calculator.ts` | ~99% | All profile combinations, edge cases, type guards |
| `lib/carbon/assistant.ts` | ~98% | Twin generation, coaching insights, all lifestyle variants |
| `lib/carbon/simulation.ts` | ~97% | Steady/ambitious modes, horizon projections |
| `lib/onboarding/validation.ts` | 100% | Name sanitisation, validation edge cases |
| `lib/onboarding/options.ts` | 100% | Option completeness, impact colour mappings |
| `store/onboarding.ts` | 100% | State transitions, persistence contract |

> `lib/gemini/` is excluded from coverage — it requires a live API key.

---

## Deployment

CarbonTwin deploys as a **static SPA**. No server is needed for core functionality.

```bash
# Build for production
pnpm --filter @workspace/carbontwin-ai run build

# Output: artifacts/carbontwin-ai/dist/public/
```

### Deploy to Replit

Click **Deploy** in the Replit header. Replit builds and hosts the app automatically.
Add `VITE_GEMINI_API_KEY` under Secrets before deploying to enable AI features.

### Deploy to Vercel

1. Connect the repository to Vercel
2. Set **Root Directory** to `artifacts/carbontwin-ai`
3. Set **Build Command** to `pnpm build`
4. Set **Output Directory** to `dist/public`
5. Add `VITE_GEMINI_API_KEY` under Environment Variables

### Deploy to Netlify

1. Connect the repository to Netlify
2. Set **Base directory** to `artifacts/carbontwin-ai`
3. Set **Build command** to `pnpm build`
4. Set **Publish directory** to `dist/public`
5. Add `VITE_GEMINI_API_KEY` under Site configuration → Environment variables

---

## Sustainability Impact

CarbonTwin is designed for measurable real-world impact:

- The average user who follows their top 2 recommended actions can reduce their footprint by **800–1,500 kg CO₂/year** — equivalent to planting 40–75 trees
- The 1.5°C pathway requires every person to reach ≤4.2t/year by 2030; CarbonTwin makes that target concrete and achievable
- Ambitious simulation mode models **50% average reduction** over 10 years for users who commit to all top actions
- The what-if engine lets users explore systemic changes (diet + transport + energy) before making them, lowering the commitment barrier

---

## Screenshots

> _Screenshots are taken from the live application._

| Screen | Description |
|--------|-------------|
| **Landing** | Hero with live animated carbon twin preview |
| **Onboarding Wizard** | 5-step questionnaire with real-time footprint preview |
| **Twin Reveal** | Animated reveal with Carbon Score, twin name, and top recommendations |
| **Dashboard Overview** | Score ring, category breakdown chart, and quick-action cards |
| **Coach Page** | Gemini-powered personalised coaching with insight cards |
| **Simulator** | 1/5/10-year steady vs. ambitious projection charts |
| **What-If** | Scenario builder with AI narrative response |
| **Progress** | Score history and milestone tracking |

---

## Roadmap

### v1.1 — Social & Sharing
- [ ] Shareable Carbon Twin card (open graph image generation)
- [ ] Anonymous leaderboard by city/country
- [ ] "Challenge a friend" invite flow

### v1.2 — Deeper Data
- [ ] Receipt scanning for shopping emissions (via Gemini Vision)
- [ ] Calendar integration for travel tracking
- [ ] Utility bill OCR for precise home energy calculation

### v1.3 — Community
- [ ] Carbon offset marketplace integration
- [ ] Team/household mode (shared footprint dashboard)
- [ ] Employer carbon benefit programmes

### v2.0 — Continuous Twin
- [ ] Weekly check-ins that update the twin in real time
- [ ] Habit streak tracking with push notifications
- [ ] ML-based footprint prediction from behavioural patterns

---

## Accessibility

CarbonTwin is built with accessibility as a first-class concern:

- Semantic HTML with proper heading hierarchy (h1 → h2 → h3)
- ARIA labels and `aria-describedby` on all interactive elements
- Keyboard-navigable onboarding wizard (Tab, Enter, Space)
- Screen reader announcements for dynamic content (`role="status"`, `aria-live`)
- WCAG 2.1 AA colour contrast compliance throughout
- Focus management across multi-step forms
- SVG elements marked `aria-hidden` when decorative

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Run tests before committing: `pnpm --filter @workspace/carbontwin-ai run test`
4. Ensure lint passes: `pnpm --filter @workspace/carbontwin-ai run lint`
5. Submit a pull request with a clear description of the change

---

## License

MIT © 2025 CarbonTwin AI
