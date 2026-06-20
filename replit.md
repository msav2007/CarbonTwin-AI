# CarbonTwin AI

An AI-powered carbon footprint awareness platform that creates your personalized digital twin and coaches you toward sustainable action.

## Run & Operate

- `pnpm --filter @workspace/carbontwin-ai run dev` — run the CarbonTwin AI app (port auto-assigned by Replit)
- `pnpm --filter @workspace/carbontwin-ai run test` — run all unit tests (Vitest)
- `pnpm --filter @workspace/carbontwin-ai run test:coverage` — generate test coverage report
- `pnpm --filter @workspace/carbontwin-ai run build` — production build (output: `artifacts/carbontwin-ai/dist/public/`)
- `pnpm --filter @workspace/carbontwin-ai run typecheck` — TypeScript check
- Required env: `VITE_GEMINI_API_KEY` — Google Gemini API key (optional — app works without it)

## Stack

- **Framework:** React 18 + Vite
- **Routing:** Wouter (client-side)
- **State:** Zustand with persist middleware
- **Styling:** Tailwind CSS v4 with dark theme tokens
- **Components:** shadcn/ui + Radix UI primitives
- **AI:** Google Gemini 1.5 Flash (`@google/generative-ai`)
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Testing:** Vitest + Testing Library (jsdom environment)
- **TypeScript:** 5.9

## Where things live

- Carbon engine: `artifacts/carbontwin-ai/src/lib/carbon/` (calculator, assistant, simulation, math, constants, types)
- Gemini AI client: `artifacts/carbontwin-ai/src/lib/gemini/client.ts`
- Onboarding options & validation: `artifacts/carbontwin-ai/src/lib/onboarding/`
- Zustand store: `artifacts/carbontwin-ai/src/store/onboarding.ts`
- Core types: `artifacts/carbontwin-ai/src/types/index.ts` (OnboardingData)
- Carbon types: `artifacts/carbontwin-ai/src/lib/carbon/types.ts`
- Tests: `src/lib/carbon/*.test.ts` + `src/lib/onboarding/validation.test.ts`
- Vitest config: `artifacts/carbontwin-ai/vitest.config.ts`
- Theme tokens: `artifacts/carbontwin-ai/src/index.css`
- Fonts: DM Sans + Syne via Google Fonts in `index.html`

## Architecture decisions

- **Carbon engine is fully local** — all calculations run client-side with no backend required; Gemini is optional enrichment only
- **Zustand persist** stores onboarding state across sessions with schema migration (version: 2)
- **Twin name is deterministic** — generated from a hash of user choices, so same inputs always produce the same twin
- **No "use client" directives** in custom components — this is a Vite app, not Next.js
- **Wouter routing** with explicit `[, navigate]` destructuring pattern (not `router`, not `useRouter`)

## Product

CarbonTwin AI maps 8 lifestyle signals (transport, diet, home energy, household size, travel, shopping, name, motivation) to a precise annual CO2 footprint, generates a personalized AI twin, and delivers dynamic coaching to reduce environmental impact.

Key flows:
1. **Landing page** → marketing with feature overview
2. **Onboarding wizard** → 5-step questionnaire with live footprint preview
3. **Twin Reveal** → animated reveal of Carbon Twin + score + recommendations
4. **Dashboard** → coach, simulator, what-if, progress pages

## Gotchas

- `vite.config.ts` requires `PORT` and `BASE_PATH` env vars when running dev/preview — they default to `5173`/`/` for plain `pnpm build`
- Never use `router` variable in wouter — use `const [, navigate] = useLocation()` or `const [pathname] = useLocation()`
- The `next` package was removed from dependencies — it was a leftover from the Vercel import
- `@testing-library/jest-dom` must be imported in `src/test/setup.ts` for DOM matchers to work in Vitest
- Coverage excludes `src/lib/gemini/` (requires live API key) and test files themselves

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Full README with architecture diagram: `artifacts/carbontwin-ai/README.md`
