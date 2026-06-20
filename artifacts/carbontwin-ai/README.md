# CarbonTwin AI

> An AI-powered carbon footprint awareness platform that creates your personalized digital twin and coaches you toward sustainable action.

## Overview

CarbonTwin AI maps your lifestyle choices — transport, diet, home energy, travel, and shopping — to a precise carbon footprint, generates a personalized AI twin, and delivers dynamic, Gemini-powered coaching to help you reduce your environmental impact.

Instead of generic advice, CarbonTwin builds a model of *you* — your Carbon Twin — and uses it to generate recommendations, simulate future scenarios, and track your progress over time.

## Features

| Feature | Description |
|---------|-------------|
| **Carbon Twin Generation** | AI-generated digital persona based on your lifestyle signals |
| **5-Category Footprint Analysis** | Transport, food, home energy, travel, and shopping breakdown |
| **Personalized Coaching** | Gemini-powered advice specific to your profile and motivation |
| **Future Simulations** | Steady and ambitious 1/5/10-year reduction scenarios |
| **What-If Scenarios** | Model the impact of lifestyle changes before committing |
| **Action Plans** | Ranked, difficulty-rated recommendations with first steps |
| **Progress Tracking** | Visual dashboard tracking your carbon score over time |
| **Live Footprint Preview** | Real-time carbon estimate updates during onboarding |

## CarbonTwin Concept

Your **Carbon Twin** is an AI persona built from your lifestyle data. It has:

- A unique **name** (e.g., `Terra-Sage`) derived deterministically from your choices
- A **personality archetype** tied to your dominant emission category
- A **Carbon Score** (0–100) representing your footprint relative to the 4.2t global target
- A set of **traits** reflecting your strongest sustainable habits
- A **summary narrative** written by the AI that explains your footprint in plain language

The twin updates as you take action, creating a feedback loop between your choices and your carbon identity.

## AI Workflow

```
User Onboarding (8 signals)
        ↓
Carbon Engine (local calculation)
        ↓
Carbon Twin Generation (deterministic + optional Gemini enrichment)
        ↓
Coaching Insights (rule-based + optional Gemini personalization)
        ↓
Recommendations (sorted by annual savings kg)
        ↓
Future Simulations (steady/ambitious modes)
        ↓
What-If Scenarios (optional Gemini narrative)
```

The core carbon engine runs **entirely client-side** with no API dependency. Gemini AI enriches coaching messages and what-if narratives when an API key is available.

## Architecture

```
artifacts/carbontwin-ai/
├── src/
│   ├── lib/
│   │   ├── carbon/           # Core carbon engine (no external deps)
│   │   │   ├── calculator.ts # Main calculation entry point
│   │   │   ├── assistant.ts  # Twin/profile/coaching generation
│   │   │   ├── simulation.ts # 1/5/10-year future simulations
│   │   │   ├── math.ts       # Pure utility functions
│   │   │   ├── constants.ts  # Emission factors and labels
│   │   │   └── types.ts      # Domain type definitions
│   │   ├── gemini/           # Google Gemini AI integration
│   │   │   └── client.ts     # AI client + prompt engineering
│   │   └── onboarding/       # Onboarding validation and options
│   ├── components/
│   │   ├── ui/               # shadcn/ui primitive components
│   │   ├── onboarding/       # Multi-step wizard components
│   │   ├── landing/          # Marketing page components
│   │   └── shared/           # Layout components
│   ├── store/
│   │   └── onboarding.ts     # Zustand state with persistence
│   ├── hooks/                # Custom React hooks
│   └── types/                # Global TypeScript interfaces
```

**Key design decisions:**
- Carbon calculations are deterministic and local — no backend needed for core functionality
- Gemini AI is optional and gracefully degrades when the API key is absent
- Zustand persist stores onboarding state across sessions with schema migration support
- The twin name is deterministically generated from a hash of user choices — same inputs always produce the same twin

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Routing | Wouter |
| State | Zustand (with persist middleware) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| AI | Google Gemini 1.5 Flash |
| Animations | Framer Motion |
| Charts | Recharts |
| Testing | Vitest + Testing Library |
| TypeScript | 5.9 |

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd carbontwin-ai

# Install dependencies
pnpm install

# Set environment variables
cp .env.example .env.local
# Add your VITE_GEMINI_API_KEY (optional — app works without it)

# Start development server
pnpm dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GEMINI_API_KEY` | Optional | Google Gemini API key for AI coaching |
| `PORT` | Auto-set | Dev server port (set automatically by Replit) |
| `BASE_PATH` | Auto-set | Base URL path (set automatically by Replit) |

The app runs fully without `VITE_GEMINI_API_KEY`. AI-powered coaching features gracefully degrade to rule-based coaching when the key is absent.

## Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

**Test coverage includes:**
- Carbon math utilities (`clamp`, `sumBreakdown`, `calculateCarbonScore`, `formatTonnes`)
- Name validation logic (`sanitizeNameInput`, `validateDisplayName`)
- Full carbon result calculation with all profile combinations
- Partial estimate calculation and confidence scoring
- Onboarding completion checking
- Recommended action generation for all lifestyle combinations
- Twin profile generation and determinism
- Carbon profile and coaching insight generation
- Future simulation for steady and ambitious modes

## Deployment

The app deploys as a static React SPA. No server is required for core functionality.

```bash
# Build for production
pnpm build

# Output directory: dist/public/
```

### Vercel

1. Connect the repository to Vercel
2. Set build command: `pnpm build`
3. Set output directory: `dist/public`
4. Add `VITE_GEMINI_API_KEY` to Vercel environment variables

## Carbon Score Methodology

CarbonTwin uses emission factors sourced from peer-reviewed lifecycle assessment research:

| Category | Range (kg CO2/year) | Source basis |
|----------|---------------------|--------------|
| Transport | 80 (walk) – 3,200 (car) | Per-km emission factors |
| Food | 800 (vegan) – 2,800 (meat-heavy) | Dietary lifecycle assessments |
| Home Energy | 600 (low) – 2,800 (high) × household multiplier | Grid emission intensity |
| Air Travel | 300 (rare) – 3,500 (frequent) | IPCC aviation factors |
| Shopping | 400 (minimal) – 2,200 (frequent) | Consumer goods embodied carbon |

**Global target:** 4.2 tonnes CO2/year per person (1.5°C pathway)

The **Carbon Score** (0–100) is calculated as: `clamp(100 - annualKg / 100, 0, 100)`

A score of 58 represents the global average (4.2t). Higher is better.

## Accessibility

CarbonTwin is built with accessibility as a first-class concern:
- Semantic HTML with proper heading hierarchy
- ARIA labels on all interactive elements
- Keyboard-navigable onboarding wizard
- Screen reader announcements for dynamic content
- WCAG 2.1 AA color contrast compliance
- Focus management across multi-step forms

## License

MIT
