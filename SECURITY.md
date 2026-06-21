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

## Dependency Security

```bash
# Audit dependencies for known vulnerabilities
pnpm audit

# Check for outdated packages
pnpm outdated
```

We review dependency audit output before each release. Critical and high severity findings block releases.
