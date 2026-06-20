---
name: CarbonTwin wouter routing
description: How to use wouter routing in CarbonTwin AI — the app migrated from Next.js and has a footgun around `router` not existing
---

# Wouter Routing in CarbonTwin AI

**Rule:** Never reference `router` as a variable. It does not exist in wouter.

**Pattern for navigation:**
```tsx
const [, navigate] = useLocation();
// navigate('/dashboard')
```

**Pattern for current path:**
```tsx
const [pathname] = useLocation();
```

**Why:** The app was migrated from Next.js where `useRouter()` returned a router object. In wouter, `useLocation()` returns `[pathname, navigate]`. A bug existed in `twin-reveal.tsx` where `router` was in a useEffect dependency array, causing a ReferenceError crash on that page.

**How to apply:** Any time you add a useEffect or callback that navigates, use `navigate` from `useLocation()`, not `router`. Check dependency arrays for `router` specifically.
