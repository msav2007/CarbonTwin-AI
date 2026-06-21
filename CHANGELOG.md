# Changelog

All notable changes to CarbonTwin AI are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2025-06-21

### Added

#### Core Carbon Engine
- 5-category emission model: transport, food, home energy, air travel, shopping
- Peer-reviewed emission factors (Poore & Nemecek 2018, IEA 2023, IPCC aviation)
- Household energy-sharing multipliers (solo/couple/family)
- Carbon Score formula: `clamp(100 − annualKg / 100, 0, 100)` benchmarked against 4.2t global target
- `calculatePartialCarbonEstimate` — live estimate from partially-completed onboarding
- `calculateCarbonResult` — full result from complete 8-signal profile

#### Carbon Twin Generation
- Deterministic hash-based twin name generation from lifestyle choices
- 5 archetype personalities keyed by dominant emission category
- 40 unique twin name combinations (8 prefixes × 8 suffixes)
- Same inputs always produce the same twin (reproducible, no random seed)

#### Future Simulation Engine
- Steady trajectory: 3-year ramp, 62% action capture rate
- Ambitious trajectory: 2-year ramp, 84% action capture rate
- 1-year, 5-year, and 10-year projections
- Cumulative CO₂ avoided calculation per horizon

#### Personalised Action Plans
- Ranked recommended actions by annual CO₂ saving potential
- Difficulty ratings: Easy / Medium / Focused
- Timeline labels and first-step guidance per action
- Personalised rationale per user profile

#### AI Coaching (Google Gemini 1.5 Flash)
- Personalised coaching messages from live profile data
- What-if scenario narratives for hypothetical lifestyle changes
- Structured JSON prompt engineering with validation
- Graceful fallback to rule-based output when API key absent

#### Onboarding Wizard
- 5-step questionnaire (8 lifestyle signals total)
- Real-time carbon estimate preview updating per input
- Confidence percentage based on signals provided
- Name sanitisation and validation (`sanitizeNameInput`, `validateDisplayName`)
- Zustand persist store with schema version 2 and migration support

#### Dashboard (4 pages)
- **Coach** — Gemini-powered coaching cards with rule-based fallback
- **Simulator** — Interactive 1/5/10-year projection charts (Recharts)
- **What-If** — Lifestyle change scenario builder with AI narrative
- **Progress** — Carbon Score history and milestone tracking

#### UI & Accessibility
- WCAG 2.1 AA colour contrast throughout
- Semantic HTML with proper heading hierarchy
- Keyboard-navigable multi-step wizard
- ARIA labels, `aria-describedby`, `role="status"`, `aria-live` regions
- Focus management across form steps
- Framer Motion animations on landing hero and twin reveal screen
- Dark theme with Tailwind CSS v4 design tokens

#### Testing
- 195 unit tests across 9 test files
- 98.97% statement coverage on all business logic
- 100% coverage on `math.ts`, `validation.ts`, `options.ts`, `store`
- All 8 onboarding signal union type variants tested
- Twin determinism tests (same inputs → same outputs)
- Edge cases: zero emissions, extreme emitters, boundary name lengths

#### Developer Experience
- TypeScript 5.9 with strict mode
- ESLint with React Hooks plugin (0 warnings, 0 errors)
- Vitest with V8 coverage provider
- pnpm monorepo with workspace catalog
- Vite 6 with hot-module replacement

#### Repository
- MIT license
- CONTRIBUTING.md (branch naming, commit format, methodology change rules)
- CODE_OF_CONDUCT.md (Contributor Covenant 2.1)
- SECURITY.md (threat model, API key handling, vulnerability reporting)
- GitHub Actions CI workflow (lint, typecheck, build, test)
- Architecture Decision Records (docs/adr/)
- Architecture documentation (docs/architecture.md)
- Performance documentation (docs/performance.md)

---

## [0.9.0] — 2025-06-07 (Pre-release)

### Added
- Initial landing page with animated hero
- Onboarding wizard prototype (3 steps)
- Basic carbon score calculation
- Twin reveal screen

### Changed
- Migrated from Next.js scaffolding to Vite + React
- Replaced React Router with Wouter
- Removed unused `@tanstack/react-query` dependency

---

[1.0.0]: https://github.com/msav2007/CarbonTwin-AI/releases/tag/v1.0.0
[0.9.0]: https://github.com/msav2007/CarbonTwin-AI/releases/tag/v0.9.0
