# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest (`main`) | ✅ Active |
| All prior tags | ❌ Not supported |

Only the current `main` branch receives security fixes. We recommend always using the latest commit.

---

## Security Model

### Client-Side Architecture

CarbonTwin AI is a **client-only Single Page Application** — the carbon engine, twin generation, and simulation logic all run in the user's browser. This design has specific security properties:

| Property | Status | Notes |
|----------|--------|-------|
| No backend server | ✅ | Zero server-side attack surface for core features |
| No user authentication | ✅ | No credentials to steal or sessions to hijack |
| No database | ✅ | All state in `localStorage` (Zustand persist) |
| No user data transmitted | ✅ | Onboarding answers never leave the browser |
| Gemini API calls | ⚠️ | Optional — see below |

### Gemini API Key Handling

When `VITE_GEMINI_API_KEY` is set, the key is embedded in the client bundle at build time (Vite's `import.meta.env` mechanism) and sent directly from the user's browser to Google's Gemini API. This is the standard pattern for client-side AI integrations.

**Implications:**
- The API key is visible in the JavaScript bundle and browser devtools
- Treat it as a **low-privilege, rate-limited key** only (do not reuse it for server-side or admin purposes)
- Set usage quotas and per-key spending limits in Google Cloud Console
- If the key is exposed, revoke it and generate a new one — no user data is compromised

**If you are deploying for production use with a budget-sensitive API key**, consider proxying requests through a small backend instead of embedding the key in the bundle.

### localStorage Data

User onboarding answers are persisted to `localStorage` under the key `carbontwin-onboarding`. This data contains:
- A first name (display name)
- Lifestyle choices (transport mode, diet, etc.)
- The calculated carbon result

This data is not sensitive but it is personal. It remains on the user's own device and is never transmitted to any server.

### Content Security

- No `eval()` or dynamic code execution
- No `dangerouslySetInnerHTML` usage in source code
- User name input is sanitised with `sanitizeNameInput()` before display (strips HTML-unsafe characters)
- Gemini AI responses are treated as plain text and never injected as HTML

---

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability, please report it responsibly:

1. **Email:** Open a [private security advisory](https://github.com/msav2007/CarbonTwin-AI/security/advisories/new) on GitHub
2. **Include:** A description of the vulnerability, steps to reproduce it, and your assessment of impact
3. **Response time:** We aim to acknowledge reports within 48 hours and provide an initial assessment within 7 days

### What to Report

We consider the following in scope:
- XSS vulnerabilities in user-controlled input rendering
- Prototype pollution in utility functions
- Dependencies with known critical CVEs (check `pnpm audit`)

Out of scope:
- The Gemini API key being visible in the client bundle (documented behaviour above)
- Self-XSS (requires the user to exploit themselves)
- Issues requiring physical device access

---

## Threat Model

### Assets to Protect

| Asset | Sensitivity | Where stored |
|-------|------------|-------------|
| User name | Low — display name only | `localStorage` (user's device only) |
| Lifestyle choices | Low — no medical/financial data | `localStorage` (user's device only) |
| Carbon result | Low — derived from choices | `localStorage` (user's device only) |
| Gemini API key | Medium — usage/billing risk | Vite bundle (visible in devtools) |

### Threat Scenarios

| Threat | Likelihood | Impact | Mitigation |
|--------|-----------|--------|-----------|
| XSS via name input | Low | Medium | `sanitizeNameInput()` strips HTML; no `dangerouslySetInnerHTML` |
| Gemini key theft → API abuse | Medium | Low–Medium | Rate-limit key in GCP console; key has no data access |
| localStorage data exfiltration | Low | Low | No sensitive PII; same-origin policy limits access |
| Prototype pollution via JSON | Very Low | Low | AI responses validated as plain text/structured JSON before use |
| Supply-chain attack (npm) | Low | High | `pnpm audit` on every release; `--frozen-lockfile` in CI |
| Bundle injection at CDN | Very Low | High | Deploy to trusted hosts (Replit, Vercel, Netlify) with HTTPS |

### Out-of-Scope Threats

- Server-side vulnerabilities (no server exists)
- Authentication bypass (no auth exists)
- SQL injection (no database exists)
- CSRF (no state-mutating endpoints exist)

---

## Data Handling Policy

### What We Collect

CarbonTwin AI collects **no data on any server**. All information stays on the user's device.

| Data type | Purpose | Storage | Retention |
|-----------|---------|---------|-----------|
| Display name | UI personalisation | `localStorage` | Until user clears browser data or clicks "Reset" |
| Lifestyle choices (8 signals) | Carbon calculation | `localStorage` | Until user clears browser data or clicks "Reset" |
| Calculated carbon result | Dashboard display | `localStorage` | Until user clears browser data or clicks "Reset" |

### What We Do Not Collect

- Email addresses
- Location data
- Device identifiers
- Usage analytics
- Crash reports
- API call logs

### Gemini Data Handling

When AI features are enabled (`VITE_GEMINI_API_KEY` is set), the following data is sent to Google's Gemini API:

- The user's first name (display name)
- Their 8 lifestyle signal values (e.g. `transport: "car"`, `diet: "vegan"`)
- Their calculated annual CO₂ total and top category
- Their stated motivation

This data is sent to Google under their standard [API Terms of Service](https://ai.google.dev/terms). No personally identifiable information beyond a first name is transmitted. Users should be informed that AI features involve a third-party API call.

### Resetting User Data

Users can clear all stored data by clicking **Reset** in the app, which calls `reset()` on the Zustand store and clears the `carbontwin-onboarding` localStorage key. They can also clear it via browser settings (Clear Storage for the origin).

---

## Dependency Security

### Audit Process

```bash
# Audit dependencies for known vulnerabilities
pnpm audit

# Check for outdated packages
pnpm outdated
```

Critical and high severity findings block releases. Moderate findings are triaged within 30 days.

### Dependency Update Policy

| Severity | Response time | Action |
|----------|--------------|--------|
| Critical CVE | 24 hours | Immediate patch release |
| High CVE | 7 days | Patch release |
| Moderate CVE | 30 days | Included in next minor release |
| Low CVE | Next release | Normal development cycle |

### Lockfile Integrity

The `pnpm-lock.yaml` file is committed to the repository. CI runs with `--frozen-lockfile` to prevent silent dependency upgrades in automated environments.

### Dependency Inventory

| Category | Packages | Notes |
|----------|---------|-------|
| UI framework | React 18, React DOM | Meta (Facebook) |
| Component library | shadcn/ui + Radix UI | MIT licensed |
| State management | Zustand 5 | MIT licensed |
| AI client | `@google/generative-ai` | Apache 2.0 |
| Charts | Recharts 2 | MIT licensed |
| Animations | Framer Motion 12 | MIT licensed |
| Routing | Wouter 3 | MIT licensed |
| Build tooling | Vite 6, TypeScript 5.9 | MIT / Apache 2.0 |

---

## Disclosure Process

1. Reporter submits a [private security advisory](https://github.com/msav2007/CarbonTwin-AI/security/advisories/new)
2. Maintainer acknowledges within **48 hours**
3. Maintainer assesses severity and reproduces within **7 days**
4. Fix developed in a private branch
5. Coordinated disclosure: fix is merged and released before the advisory is made public
6. Reporter is credited in the advisory (unless they prefer anonymity)
7. CVE requested if severity is Critical or High
