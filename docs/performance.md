# CarbonTwin AI — Performance

This document covers build characteristics, runtime performance strategies, bundle composition, and optimisation opportunities.

---

## Build Metrics (v1.0.0)

```
pnpm --filter @workspace/carbontwin-ai run build

dist/public/
├── assets/index-[hash].js     521 KB  (gzip: ~148 KB)
├── assets/index-[hash].css    132 KB  (gzip: ~18 KB)
└── index.html                   1 KB

Build time: ~4–6 seconds (cold)
TypeScript check: ~3 seconds
```

### Bundle Composition (estimated)

| Library | Size (est.) | Purpose |
|---------|------------|---------|
| React + React DOM | ~140 KB | UI framework |
| Recharts + D3 deps | ~110 KB | Dashboard charts |
| Framer Motion | ~95 KB | Landing + reveal animations |
| shadcn/ui + Radix | ~80 KB | Component primitives |
| `@google/generative-ai` | ~55 KB | Gemini AI client |
| Zustand + persist | ~15 KB | State management |
| Wouter | ~2 KB | Routing |
| Application code | ~24 KB | Carbon engine + UI |

**Vite currently emits one chunk** with a `> 500 KB` warning. Code-splitting is the primary optimisation opportunity (see below).

---

## Test Coverage Metrics

```
pnpm --filter @workspace/carbontwin-ai run test:coverage

File                     | Stmts  | Branch | Funcs  | Lines
-------------------------|--------|--------|--------|------
lib/carbon/math.ts       | 100%   | 100%   | 100%   | 100%
lib/carbon/calculator.ts | 99.34% | 95.31% | 100%   | 99.34%
lib/carbon/assistant.ts  | 97.80% | 93.40% | 100%   | 97.80%
lib/carbon/simulation.ts | 97.05% | 90.90% | 100%   | 97.05%
lib/onboarding/*.ts      | 100%   | 100%   | 100%   | 100%
store/onboarding.ts      | 100%   | 100%   | 100%   | 100%
-------------------------|--------|--------|--------|------
Overall                  | 98.97% | 95.31% | 100%   | 98.97%

Test Files: 9 passed
Tests:      195 passed
Duration:   ~240ms (test execution only)
```

---

## Runtime Performance Strategy

### 1. Synchronous Carbon Calculation (< 1 ms)

The entire carbon calculation pipeline is synchronous JavaScript with no I/O. A full `calculateCarbonResult` call completes in under 1ms on a mid-range mobile device. This means:

- **No loading spinner needed** for the core result — it renders instantly
- **No memoisation required** for the calculation itself
- The live preview on the onboarding wizard calls the calculator on every input change without debouncing

### 2. Selective Zustand Subscriptions

Components subscribe to specific store slices rather than the whole store object:

```typescript
// Good — only re-renders when `step` changes
const step = useOnboardingStore((s) => s.step);

// Avoided — re-renders on any store update
const store = useOnboardingStore();
```

This prevents the 5-step wizard from causing cascading re-renders across unrelated components.

### 3. Tailwind CSS v4 (No Runtime Injection)

Tailwind v4 generates all CSS at build time via the `@tailwindcss/vite` plugin. There is no runtime style injection or class scanning — the CSS output is a static file. This eliminates the "flash of unstyled content" pattern common with CSS-in-JS solutions.

### 4. Framer Motion Selective Usage

Framer Motion (~95 KB) is used in two places only:
- Landing hero section (avatar float animation)
- Twin reveal screen (staggered card entrance)

Dashboard components use CSS transitions only, avoiding unnecessary imports of Framer's heavier animation APIs.

### 5. Wouter vs React Router (~48 KB saved)

Wouter's 2 KB footprint vs React Router's 50 KB+ is a meaningful bundle saving for a tool that may be used on mobile data connections.

---

## Core Web Vitals (Estimated)

> Estimates based on bundle size and synchronous rendering model. Actual values depend on hosting CDN and user device.

| Metric | Estimate | Target |
|--------|---------|--------|
| **FCP** (First Contentful Paint) | < 1.2s | < 1.8s |
| **LCP** (Largest Contentful Paint) | < 2.0s | < 2.5s |
| **TTI** (Time to Interactive) | < 2.5s | < 3.8s |
| **TBT** (Total Blocking Time) | ~150ms | < 200ms |
| **CLS** (Cumulative Layout Shift) | ~0 | < 0.1 |

The single 521 KB JS chunk is the primary factor limiting FCP/LCP on slow connections.

---

## Optimisation Roadmap

### Priority 1 — Code Splitting (High Impact, Low Risk)

Convert dashboard routes to `React.lazy` + `Suspense`. Dashboard pages (Recharts, Framer Motion usage) are not accessed until after onboarding completes — they can load lazily.

**Expected impact:** Initial bundle drops from ~521 KB to ~250 KB (~52% reduction).

```typescript
// Current
import CoachPage from "@/app/dashboard/coach/page";

// After code-splitting
const CoachPage = React.lazy(() => import("@/app/dashboard/coach/page"));
```

### Priority 2 — Recharts Tree Shaking

Recharts imports can be individually tree-shaken. Importing only `AreaChart`, `LineChart`, and their specific sub-components rather than the full package reduces the Recharts contribution.

### Priority 3 — Framer Motion Selective Imports

```typescript
// Current (imports full bundle)
import { motion, AnimatePresence } from "framer-motion";

// After (only imports what is used)
import { motion } from "framer-motion/dist/framer-motion";
```

### Priority 4 — Image Optimisation

Landing page hero images could be served as WebP with `loading="lazy"` on below-fold assets.

---

## Development Performance

```bash
# Cold start
pnpm --filter @workspace/carbontwin-ai run dev
# → Vite ready in ~800ms

# Hot reload (code change)
# → HMR update in ~50–200ms depending on file size

# Test run (195 tests)
# → ~240ms test execution (18s total including jsdom environment setup)
```

---

## Lighthouse Score Targets

| Category | Current Estimate | Target |
|----------|-----------------|--------|
| Performance | 85–92 | 90+ |
| Accessibility | 95+ | 100 |
| Best Practices | 95 | 100 |
| SEO | 85 | 90+ |

Accessibility and Best Practices scores are the strongest categories due to semantic HTML, ARIA labels, and no `eval()` / `dangerouslySetInnerHTML` usage.
