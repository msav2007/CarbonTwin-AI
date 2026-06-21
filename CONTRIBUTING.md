# Contributing to CarbonTwin AI

Thank you for considering a contribution to CarbonTwin AI! This document explains how to get started, what we value in contributions, and the process for getting changes merged.

---

## Code of Conduct

This project follows our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9

### Setup

```bash
git clone https://github.com/msav2007/CarbonTwin-AI.git
cd CarbonTwin-AI
pnpm install
pnpm --filter @workspace/carbontwin-ai run dev
```

The development server starts with hot-module replacement. No environment variables are required for the core app — `VITE_GEMINI_API_KEY` is optional and enables AI coaching features.

---

## What We Welcome

| Type | Examples |
|------|---------|
| **Bug fixes** | Incorrect carbon calculations, broken navigation, accessibility regressions |
| **Performance** | Bundle size reduction, render optimisation, Zustand selector improvements |
| **Accessibility** | ARIA improvements, keyboard navigation, screen reader support |
| **Tests** | Coverage for edge cases, simulation engine, or new utility functions |
| **Documentation** | Corrected methodology, clearer JSDoc, example usage |
| **Carbon data** | Updated emission factors with peer-reviewed sources |

We generally do **not** accept:
- UI redesigns or colour/font changes without prior discussion
- New third-party dependencies without prior discussion
- Features that require a backend (CarbonTwin is intentionally client-only)

---

## Development Workflow

### 1. Create a feature branch

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/the-bug-you-are-fixing
```

Branch naming:
- `feat/` — new capability
- `fix/` — bug fix
- `docs/` — documentation only
- `test/` — tests only
- `refactor/` — code quality, no behaviour change

### 2. Make your changes

- Keep changes focused — one concern per pull request
- Do not mix refactoring with feature work
- Add or update tests for any logic change
- Add or update JSDoc for any new exported function

### 3. Verify everything passes

```bash
# From the repository root:
pnpm --filter @workspace/carbontwin-ai run lint
pnpm --filter @workspace/carbontwin-ai run typecheck
pnpm --filter @workspace/carbontwin-ai run test
pnpm --filter @workspace/carbontwin-ai run build
```

All four must pass cleanly (0 errors, 0 warnings) before opening a pull request.

### 4. Open a pull request

- Use a clear title: `fix: correct daily kg calculation for vegan diet`
- Describe **what** changed and **why**
- If changing carbon methodology, cite your source
- Reference any related issues with `Closes #N`

---

## Carbon Methodology Changes

The emission factors in `src/lib/carbon/constants.ts` are the scientific core of this project. Any change to them must:

1. Be sourced from a peer-reviewed publication or authoritative dataset (IPCC, IEA, Poore & Nemecek)
2. Include the citation in a code comment
3. Update the methodology table in `README.md`
4. Pass all affected tests (or update tests to reflect the new correct value)

---

## Testing Philosophy

- **Prefer meaningful assertions over count** — a test that checks a specific value is worth more than a test that just checks the function doesn't throw
- **Edge cases matter** — test empty inputs, boundary values, and all union type variants
- **No mocking the carbon engine** — tests in `src/lib/carbon/` should use real calculation logic
- Gemini AI functions are excluded from test coverage requirements (require a live API key)

---

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]

[optional footer: Closes #N]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(simulator): add 20-year projection horizon
fix(calculator): clamp negative daily kg values to zero
docs(README): update aviation emission factor source
test(validation): add edge cases for unicode name input
```

---

## Questions?

Open a [Discussion](https://github.com/msav2007/CarbonTwin-AI/discussions) — we prefer async text over real-time chat for project decisions.
