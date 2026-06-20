# CarbonTwin AI

A startup-grade Smart AI Carbon Assistant designed to map your lifestyle into a digital carbon twin, predict long-term impacts, and provide actionable coaching. Built for PromptWars Challenge 3.

## Core Features

- **Personalized Onboarding**: Converts habits (transport, diet, energy, shopping, flights) into a live carbon baseline.
- **Carbon Twin Reveal**: Generates a named twin with an archetype, carbon score, and category breakdown.
- **Dashboard Overview**: Centralized hub showing daily carbon budget, footprint breakdown, and reduction potential.
- **Future Simulator**: See your 1, 5, and 10-year carbon forecast under "Steady" vs "Ambitious" plans.
- **What-If Engine**: Instantly toggle lifestyle signals to recalculate your carbon score without a page reload.
- **AI Coach**: Actionable recommendations customized to your weakest categories and biggest opportunities.
- **Progress Tracking**: Real-time visualization of daily budget usage against your targets.

## Technology Stack

- **Framework**: Next.js 14 App Router
- **Styling**: Tailwind CSS & Framer Motion for smooth, dynamic UI
- **State**: Zustand (with persistent storage)
- **Language**: TypeScript (Strict Mode)
- **Design System**: ShadCN UI + Custom Glassmorphism

## Local Development

```bash
# 1. Clone repository
git clone https://github.com/username/carbontwin-ai.git
cd carbontwin-ai

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Production Scripts

```bash
npm run build   # Create optimized production build
npm run lint    # Run ESLint validation
npm run test    # Run Vitest test suite
```

## Security & Performance

- **Zero Exposure**: No client-side secrets.
- **Fully Typed**: Zero `any` casting in critical paths.
- **Accessibility**: ARIA labels, semantic HTML, and proper focus states applied.
- **Lightweight**: Fits completely within the 10 MB strict limit. Optimized bundle size via unused code removal.
