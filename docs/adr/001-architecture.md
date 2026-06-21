# ADR 001 — Core Architectural Decisions

**Status:** Accepted  
**Date:** 2025-06-21  
**Authors:** CarbonTwin AI

---

## Context

CarbonTwin AI is a personal carbon footprint awareness tool targeting individual consumers. The core tension in designing it is between:

1. **Simplicity** — it should work instantly, require no sign-up, and load fast
2. **Depth** — it should give meaningful, personalised output, not just a number
3. **Trustworthiness** — the calculations should be grounded in real science
4. **Privacy** — personal lifestyle data should not leave the user's device

These tensions drive every architectural decision below.

---

## Decision 1 — React + Vite (not Next.js)

### Decision
Use React 18 with Vite 6 as the build tool and dev server.

### Rationale
- CarbonTwin requires no server-side rendering — all content is user-specific and cannot be pre-rendered
- Next.js adds ~200KB of server-specific runtime code and enforces the "use client" directive pattern, which is unnecessary overhead for a pure SPA
- Vite provides faster HMR and simpler configuration for SPAs
- The project started as a Next.js scaffold (from an import) — we removed it early in development

### Tradeoffs
| Vite + React | Next.js |
|-------------|---------|
| Simpler SPA config | SSR capability |
| Faster build for SPA | Built-in routing |
| No `"use client"` noise | File-based routes |
| No server runtime | Larger bundle |

### Future Evolution
If CarbonTwin needs SEO (e.g. a public-facing landing page with pre-rendered content), a migration to Next.js App Router or Astro partial hydration would be appropriate. The component architecture is compatible with either.

---

## Decision 2 — TypeScript (strict mode)

### Decision
Use TypeScript 5.9 with strict mode for all source files.

### Rationale
- The carbon engine's correctness depends on the emission factor lookup tables having exactly the right key types. Loose typing would allow runtime `undefined` lookups that silently return wrong values.
- `OnboardingData` maps directly to the keys of `TRANSPORT_KG`, `DIET_KG`, etc. TypeScript enforces that only valid emission-factor keys are ever used.
- The 8-signal union types (`"car" | "transit" | "bike" | "walk" | "mixed"`) are both documentation and runtime guarantees.

### Tradeoffs
- Slightly more verbose (type annotations on function signatures)
- Requires TypeScript knowledge from contributors
- Prevents entire classes of runtime errors in the calculation pipeline

### Outcome
0 TypeScript errors. The type system catches emission factor mismatches at compile time.

---

## Decision 3 — Zustand (not React Context)

### Decision
Use Zustand 5 with the persist middleware for global state. No React Context for application state.

### Rationale
- The onboarding wizard has 5 steps. Without a persistent store, navigating back/forward loses state.
- React Context causes full-tree re-renders when any value changes — problematic on the live footprint preview, which updates on every keypress.
- Zustand's `useStore(selector)` pattern ensures components only re-render when their specific slice changes.
- The persist middleware provides `localStorage` serialisation with schema migration — critical for users who return to a partially-completed wizard.

### Tradeoffs
| Zustand | React Context |
|---------|--------------|
| Selective re-renders | Simple to understand |
| Built-in persistence | No extra dependency |
| Schema migration | No selector boilerplate |
| ~3KB bundle cost | Zero bundle cost |

### Schema Versioning
Version `2` was introduced when the `result` field was added to the store. The `migrate` function clears stale `result` objects from v1 that had a different shape.

---

## Decision 4 — Wouter (not React Router)

### Decision
Use Wouter 3 for client-side routing.

### Rationale
- CarbonTwin has 8 routes. React Router 6 is 50KB+; Wouter is 2KB.
- Wouter's API is a strict subset of React Router for simple use cases — hooks (`useLocation`, `useRoute`), `<Route>`, `<Link>` — with no extra features we don't need.
- The 48KB saved from the bundle is a meaningful performance improvement for a mobile-first tool.

### Gotcha
Wouter does not expose a `router` variable. Navigation uses `const [, navigate] = useLocation()` — this is documented in `replit.md` and must be followed by all contributors.

---

## Decision 5 — Google Gemini 1.5 Flash (not GPT-4o or Claude)

### Decision
Use Google Gemini 1.5 Flash as the AI model for coaching and narrative generation.

### Rationale
- Gemini 1.5 Flash has a free tier generous enough for a hackathon demo
- The Flash variant is optimised for low-latency responses, which matters for the coach page UX
- Google's JavaScript SDK (`@google/generative-ai`) is well-typed and minimal
- Gemini supports structured JSON output via prompt engineering without requiring function calling or tool use

### Tradeoffs
- Gemini is a harder dependency than OpenAI for developers who already have GPT keys
- Flash occasionally produces less nuanced output than GPT-4o for very specific prompts
- The structured JSON output relies on prompt-level instruction, not a schema API

### Swappability
The Gemini client is isolated in `src/lib/gemini/client.ts`. All callers receive the same `AICarbonCoachResponse` interface regardless of the underlying model. Swapping to OpenAI would require only changes in that one file.

---

## Decision 6 — Deterministic Carbon Twin Generation

### Decision
Generate the Carbon Twin name and personality from a deterministic hash of the user's onboarding choices, not from a random seed or an AI API call.

### Rationale
- A random twin name would feel arbitrary and unmemorable
- An AI-generated name would add latency, cost, and a hard API dependency to the reveal screen
- A deterministic hash means the same lifestyle always produces the same twin — making the product feel like a genuine reflection of the user, not a random assignment
- Users who redo the wizard with the same choices see the same twin, which builds trust

### Hash Algorithm
Simple djb2-style integer accumulation over all choice strings, modulo the prefix and suffix pool sizes:
```typescript
prefixes[hash % 8] + "-" + suffixes[(hash >> 3) % 8]
```

### Tradeoffs
- 64 unique twin names (8 × 8) — sufficient for distinct perception but would be a limitation at scale
- The hash does not guarantee uniform distribution across all 8 prefix slots — some twins will be slightly more common than others

---

## Decision 7 — Client-Side Only (No Backend)

### Decision
The carbon calculation pipeline, twin generation, simulation, and coaching generation all run client-side. No backend server is deployed.

### Rationale
- **Privacy by design:** user lifestyle data never leaves their browser
- **Zero infrastructure cost:** pure static hosting
- **Instant computation:** synchronous JS calculation is < 1ms, far faster than any API round-trip
- **Offline capability:** core features work without internet access
- **Hackathon pragmatism:** shipping a backend adds operational complexity without product value for this use case

### Security Implications
- No server-side attack surface
- Gemini API key is visible in the bundle — documented and mitigated in SECURITY.md
- `localStorage` data is scoped to the origin

### Future Evolution
If CarbonTwin adds social features (leaderboards, team dashboards, historical tracking) a backend would be required. The Zustand store shape is a natural API contract — the `OnboardingData` and `CarbonResult` types could become API request/response schemas with no changes to the UI layer.

---

## Summary

| Decision | Chosen | Primary Driver |
|----------|--------|---------------|
| Framework | React + Vite | SPA simplicity, no SSR needed |
| Language | TypeScript strict | Type-safe emission factor lookups |
| State | Zustand + persist | Selective re-renders + localStorage |
| Routing | Wouter | 48KB bundle saving |
| AI | Gemini 1.5 Flash | Free tier, low latency, JS SDK |
| Twin generation | Deterministic hash | Trust, reproducibility, zero latency |
| Backend | None | Privacy, cost, simplicity |
