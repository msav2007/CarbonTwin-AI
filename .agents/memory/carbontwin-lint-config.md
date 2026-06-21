---
name: CarbonTwin ESLint Config
description: Key ESLint ignore patterns and rules for artifacts/carbontwin-ai
---

## Rule
ESLint config at `artifacts/carbontwin-ai/eslint.config.js` ignores:
- `src/components/ui/**` (all shadcn/ui primitive components)
- `src/hooks/use-toast.ts` (shadcn/ui hook — uses `typeof actionTypes` without runtime value reference)

Unused vars rule: `varsIgnorePattern: "^_"` — prefix with `_` in test destructures.

**Why:** use-toast.ts is framework-derived code where `actionTypes` is used only as a TypeScript type source (`type ActionType = typeof actionTypes`) but not as a runtime value, triggering a false-positive lint warning.

**How to apply:** When adding new shadcn/ui hooks to `src/hooks/`, add them to the ignores list if they produce false-positive unused-var warnings.
