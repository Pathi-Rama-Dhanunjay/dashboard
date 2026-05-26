# BiasSense

**ML fairness observability for regulated industries.**

BiasSense helps ML teams detect, measure, and mitigate bias across deployed models — before regulators do. It surfaces disparate impact, demographic parity violations, and feature drift with audit-grade reporting.

---

## What it does

- **Fairness dashboard** — workspace-wide disparate impact trends across all models
- **Model deep-dives** — group-level fairness breakdowns with sortable DI tables and a visual 80% rule chart
- **Intersectional analysis** — cross-group fairness across Gender × Age and similar combinations
- **Alerts** — real-time notifications when a model exceeds a bias threshold or detects feature drift
- **Team management** — invite teammates with role-based access (Admin / Analyst / Viewer)
- **Compliance framing** — supports ECOA, EEOC, GDPR, EU AI Act, SR 11-7, NYC LL 144, and more

---

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 18 + TypeScript |
| Build | Vite 7 |
| Styling | CSS custom properties (no framework) |
| Tests | Vitest + Testing Library |
| Target | Modern evergreen browsers |

---

## Branches

| Branch | Contents |
|---|---|
| `main` | This README only |
| `version-1` | Full prototype — all source code, components, and tests |

---

## Running locally

```bash
# Clone and switch to the code branch
git clone <repo-url>
git checkout version-1

# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev
```

**Demo credentials:** use `admin` as the email to get admin access, any password of 4+ characters.

---

## Available scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run preview    # Preview production build locally
npm run type-check # TypeScript type checking
npm test           # Run test suite
```

---

## Project structure

```
src/
├── components/       # Shared UI (icons, charts, error boundary, tweaks panel)
├── lib/              # Utilities (session helpers with expiry)
├── pages/            # Route-level views (dashboard, models, settings…)
├── styles/           # Global CSS (tokens, layout, components, tweaks)
└── test/             # Vitest tests
```

---

## License

Private — all rights reserved.
