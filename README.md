# Accessible Public Service Portal

An accessibility-first public-service feedback application (React + Express + SQLite), built after an accessibility audit of the India Post website.

> **Verification status (please read).** `npm install`, the server and client test suites, the client build and an API smoke test have been run and pass (see [Verification status](#verification-status)). The India Post Lighthouse run is done (score 100). The five issues still need their "Confirm" screenshots, and the portal's own Lighthouse run is not done.

## Problem statement
Public-service websites are often hard to use with a keyboard, a screen reader or on a phone, which excludes the people who most need them. This project documents an audit of a real service site and delivers an accessible, maintainable foundation for a service-feedback portal.

## Objectives
- Audit a public website against WCAG 2.2 using Lighthouse, DevTools and keyboard testing.
- Document five genuine issues with evidence and fixes.
- Provide a monorepo with a complete React -> Express -> SQLite vertical slice.
- Apply accessibility best practice from the first line of code.

## Reference website
https://www.indiapost.gov.in/ (analysed only, never modified).

## Accessibility audit results
Lighthouse accessibility score for the reference site (home page, run 13 Nov 2026): **100 / 100** (see `docs/screenshots/`). Lighthouse checks only a subset of WCAG, so the five issues below were found by reviewing page content; each has a "Confirm" step in [`docs/audit-report.md`](docs/audit-report.md). The portal's own Lighthouse score is **not yet measured**.

| # | Issue | Severity | WCAG |
|---|---|---|---|
| 1 | Header contact link text is a raw URL path | Medium | 2.4.4, 2.5.3 |
| 2 | Non-descriptive link text "Click" for the app download | Low | 2.4.4 |
| 3 | Main-menu triggers are placeholder `#` links | Medium | 4.1.2 |
| 4 | Announcement text duplicated, likely auto-scrolling | Medium | 2.2.2, 1.3.1 |
| 5 | Repeated words in navigation link names | Low | 2.5.3, 2.4.4 |

## Technology stack
React 18, Vite 5, JavaScript, HTML5, CSS3 · Node.js >= 22.13, Express 4, REST · SQLite (`node:sqlite`) · Vitest, Testing Library, Supertest · Lighthouse · Git/GitHub.

## Features
- Responsive navy / white / gold UI: Home, About, Services, Feedback, Contact, footer.
- Feedback form with client and server validation, loading state, success and error messages.
- Persisted submissions in SQLite; admin-token-protected listing endpoint.
- Accessibility: skip link, landmarks, one `h1`, labelled fields with `aria-describedby`/`aria-invalid`, error summary with focus management, live status regions, visible focus, 44px targets, reduced-motion support.

## Architecture overview
Routes -> controllers -> services -> SQLite. Details and a Mermaid diagram: [`docs/architecture.md`](docs/architecture.md).

## Folder structure
```
accessibility-audit/
├── client/   (src/components, pages, styles, services, App.jsx; public/; index.html)
├── server/   (src/routes, controllers, services, database, app.js, index.js)
├── docs/     (audit-report.md, architecture.md, testing.md, screenshots/, lighthouse/)
├── tests/    (client/, server/)
├── scripts/  (lighthouse-audit.mjs)
├── package.json  README.md  .gitignore  .env.example
```

## Installation
Requires Node.js >= 22.13 and npm.
```bash
npm install
cp .env.example .env     # then set ADMIN_TOKEN if you want GET /api/feedback
```

## Run
```bash
npm run dev      # API on :4000 and client on http://localhost:5173 (proxy to API)
npm start        # production: builds the client, Express serves everything on :4000
```

## Testing
```bash
npm test               # server then client
npm run test:server    # Vitest + Supertest, in-memory SQLite
npm run test:client    # Vitest + Testing Library (jsdom)
npm start              # in another terminal:
npm run audit:app      # Lighthouse accessibility score for the portal (needs Chrome)
npm run audit:ref      # Lighthouse for India Post (needs Chrome + internet)
```
Manual keyboard and responsive checks: [`docs/testing.md`](docs/testing.md).

## API documentation
| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | `{ status, database, uptime }`; 503 if the DB is unreachable |
| POST | `/api/feedback` | Body `{ fullName, email, category, subject, message }`. **201** `{ message, data:{id,createdAt} }`; **422** `{ message, errors:{field:text} }`; 400 bad JSON |
| GET | `/api/feedback` | Header `x-admin-token: <ADMIN_TOKEN>`. 200 `{ data:[...] }`; 401 wrong token; **403 if no ADMIN_TOKEN is configured** (disabled by default) |

Categories: Postal Services, Banking & Savings, Insurance, Parcel Tracking, Grievance, Other.

## Verification status
| Item | Status |
|---|---|
| `npm install` (Node 22.23) | Passed |
| Server tests (Vitest + Supertest) | 12 / 12 passed |
| Client tests (Vitest + Testing Library) | 7 / 7 passed |
| `npm run build` (Vite client build) | Passed |
| Live API smoke test (`/api/health`, valid and empty POST, `/` served) | Passed |
| Lighthouse (India Post and portal), screenshots, manual keyboard/responsive checks | **Not run** |
| `npm audit` | Reports vulnerabilities in dev/transitive dependencies; not reviewed |

## Screenshots
Add real captures to `docs/screenshots/` (audit evidence and the running portal) and link them here.

## Security notes
No secrets are committed; `.env`, `*.sqlite` and `server/data/` are git-ignored. Rate limiting and CAPTCHA are not implemented (see enhancements).

## Future enhancements
Rate limiting and CAPTCHA, pagination and an authenticated admin dashboard, PostgreSQL, i18n, axe-core in CI, Lighthouse CI, Docker.

## Publish to GitHub (after you create the empty repo yourself)
```bash
git add -A && git commit -m "feat: accessible public service portal with audit docs"
git branch -M main
git remote add origin https://github.com/<your-user>/accessibility-audit.git
git push -u origin main
```
