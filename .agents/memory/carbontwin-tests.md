---
name: CarbonTwin test suite
description: Structure and patterns of the CarbonTwin AI test suite (Vitest)
---

# CarbonTwin AI Test Suite

## Test files
- `src/lib/carbon/math.test.ts` — clamp, sumBreakdown, calculateCarbonScore, formatTonnes
- `src/lib/carbon/calculator.test.ts` — calculateCarbonResult, calculatePartialCarbonEstimate, isOnboardingComplete
- `src/lib/carbon/assistant.test.ts` — buildRecommendedActions, buildTwinProfile, buildCarbonProfile, buildCoachingInsights
- `src/lib/carbon/simulation.test.ts` — buildFutureSimulations (steady/ambitious modes, 3 horizons)
- `src/lib/onboarding/validation.test.ts` — sanitizeNameInput, validateDisplayName

## Vitest config
Lives at `artifacts/carbontwin-ai/vitest.config.ts` (NOT at workspace root).
Uses jsdom, globals: true, setupFiles: `src/test/setup.ts`, alias `@` → `./src`.

## Non-obvious test behaviors
- The motivation bonus action (e.g. `focus-biggest-lever`) may not appear in the final top-4 actions for very high-impact profiles because it only saves 300 kg/year and gets sorted out. Test using a low-impact profile to verify motivation bonus inclusion.
- For the max-impact profile (car+meat-heavy+high+solo+frequent+frequent), both carbonScore and targetScore can be 0 (both clamped). Use `toBeGreaterThanOrEqual` not `toBeGreaterThan` for this assertion.

**Why:** These edge cases tripped up initial test writing and caused 2 test failures. The real behavior is correct; the assertions were wrong about what to expect.
