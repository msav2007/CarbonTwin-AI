---
name: CarbonTwin App Structure
description: Key architecture decisions for artifacts/carbontwin-ai
---

## Rules

- **Routing:** Wouter only. Use `const [, navigate] = useLocation()` — never `useRouter()` or `router`.
- **State:** Zustand + persist middleware (schema version 2). Migration in `src/store/onboarding.ts`.
- **No react-query:** `@tanstack/react-query` was removed (was unused wrapper). Do NOT re-add unless a feature genuinely needs it.
- **Gemini is optional:** all features degrade gracefully when `VITE_GEMINI_API_KEY` is absent.
- **Carbon engine is client-side:** no backend calls for core calculation; Gemini is enrichment only.
- **Twin name is deterministic:** `hashChoices(data)` → same inputs, same twin name always.

**Why:** These constraints were intentional design decisions to keep the app offline-capable, fast, and testable without external dependencies.
