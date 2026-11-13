# Accessible Public Service Portal

A full-stack, accessibility-focused public service feedback application, built as the implementation half of the **Accessibility Baseline & Repository Architecture Audit** assignment.

> **Verification status (read first).** This repository was generated in an environment with no internet access. The source, tests and documentation are complete, but **dependencies were never installed, the app was never run, the automated tests were never executed, Lighthouse was never run and no screenshots exist.** Everything marked *Not verified* below must be checked on your machine using the commands in this README. No score or test result is claimed.

## Table of contents

1. [Problem statement](#problem-statement) · 2. [Objectives](#objectives) · 3. [Reference website](#reference-website) · 4. [Accessibility audit results](#accessibility-audit-results) · 5. [Five identified issues](#five-identified-issues) · 6. [Technology stack](#technology-stack) · 7. [Features](#features) · 8. [Architecture](#architecture-overview) · 9. [Folder structure](#folder-structure) · 10. [Installation (Windows 11)](#installation-windows-11-powershell) · 11. [Running](#running-the-application) · 12. [Testing](#testing) · 13. [Lighthouse audit](#running-the-lighthouse-audit) · 14. [API](#api-documentation) · 15. [Screenshots](#screenshots) · 16. [Status](#what-is-done-and-what-needs-manual-verification) · 17. [Future enhancements](#future-enhancements)

## Problem statement

Public service websites are often hard to use for people with disabilities: missing image descriptions, low contrast, controls that cannot be reached by keyboard, unlabeled form fields and poor page structure. These barriers exclude users and are expensive to fix late. Teams need a documented baseline of the problems and a clean architecture where accessible patterns are the default.

## Objectives

- Audit a real public-facing website (India Post) for accessibility using Lighthouse, Chrome DevTools, keyboard-only testing and WCAG.
- Document five genuine issues with evidence, impact, severity and fixes.
- Build a separate, accessible full-stack application that applies those lessons, with a complete vertical slice: React, Express REST API, SQLite, and back to a success message.
- Provide tests, architecture documentation and a GitHub-ready repository.

## Reference website

**India Post: https://www.indiapost.gov.in/**. It is analysed only and never modified.

## Accessibility audit results

**Not measured yet.** No Lighthouse score exists for the reference site or for the portal. Fill in this table after running the audit (see [docs/audit-report.md](docs/audit-report.md)).

| Target | Device | Lighthouse accessibility score | Date |
| --- | --- | --- | --- |
| indiapost.gov.in | Desktop | Not measured | |
| indiapost.gov.in | Mobile | Not measured | |
| Portal (this repo) | Desktop | Not measured | |
| Portal (this repo) | Mobile | Not measured | |

## Five identified issues

The five issues are **candidate focus areas awaiting confirmation** on the live site, because the site could not be reached when this repository was prepared. Full templates (evidence fields, severity, fix and code example) are in [docs/audit-report.md](docs/audit-report.md).

| # | Candidate issue | Status |
| --- | --- | --- |
| 1 | Image alternative text | To be confirmed |
| 2 | Colour contrast | To be confirmed |
| 3 | Keyboard access and visible focus | To be confirmed |
| 4 | Form labels and accessible names | To be confirmed |
| 5 | Heading hierarchy, landmarks and semantic HTML | To be confirmed |

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite 5, JavaScript (ES modules), HTML5, CSS3 |
| Backend | Node.js 20+, Express 4, Helmet, REST/JSON |
| Database | SQLite via `better-sqlite3` |
| Testing | Vitest, Supertest, Testing Library, jsdom |
| Accessibility | WCAG 2.2 AA principles (target, not a claim), Lighthouse |
| Tooling | npm workspaces, concurrently, Git |

## Features

- Responsive government-style layout in navy, white and subtle gold: home, about, services, feedback and contact sections plus footer.
- Feedback form: full name, email, service category, subject, description.
- Client and server validation; understandable errors; error summary that receives focus.
- Loading state, polite success announcement with a reference number, assertive error announcements.
- `POST /api/feedback` stores to SQLite; `GET /api/feedback` is **disabled unless an admin token is configured**, so personal data is never public.
- Rate limiting, security headers, body-size limit, parameterised SQL.
- Accessibility: skip link, landmarks, one `h1` and ordered headings, labelled inputs, `autocomplete` tokens, visible focus, 44px targets, descriptive image text, no animation.

## Architecture overview

React SPA → `services/feedbackService.js` → Express (`routes → controllers → services → repository`) → SQLite. In production Express also serves the built client. Details and a Mermaid diagram: [docs/architecture.md](docs/architecture.md).

## Folder structure

```text
accessibility-audit/
├── client/                  React + Vite app
│   ├── public/
│   ├── src/ (components, pages, services, styles, App.jsx, main.jsx)
│   ├── index.html
│   └── package.json
├── server/                  Express API
│   ├── src/ (routes, controllers, services, database, middleware, app.js, server.js)
│   └── package.json
├── docs/
│   ├── audit-report.md
│   ├── architecture.md
│   ├── screenshots/         (empty: no screenshots captured yet)
│   └── lighthouse/          (Lighthouse reports will be written here)
├── tests/
│   ├── client/
│   └── server/
├── scripts/contrast-check.mjs
├── package.json  vitest.client.config.js  vitest.server.config.js
├── README.md  .gitignore  .gitattributes  .env.example
```

## Installation (Windows 11, PowerShell)

Prerequisites: **Node.js 20 or newer** (22 LTS recommended; https://nodejs.org), **Git**, and **Google Chrome** (for Lighthouse).

```powershell
node -v          # should print v20.x or newer
npm -v
git --version
```

1. Open PowerShell and go to the project folder (the unzipped `accessibility-audit` folder):

```powershell
cd C:\path\to\accessibility-audit
```

2. Install all dependencies (root, client and server workspaces):

```powershell
npm install
```

`better-sqlite3` downloads a prebuilt Windows binary. If it tries to compile and fails, install a current Node LTS release (prebuilt binaries exist for LTS versions) or install the "Desktop development with C++" workload from Visual Studio Build Tools and run `npm install` again.

If PowerShell says "running scripts is disabled on this system", either run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, or call `npm.cmd` instead of `npm`.

3. Create your environment file:

```powershell
Copy-Item .env.example .env
```

Optionally edit `.env` and set `ADMIN_TOKEN` to a long random value (for example the output of `[guid]::NewGuid().ToString('N')`) if you want to read stored feedback through the API. Leave it empty to keep the listing endpoint disabled. `.env` is git-ignored.

## Running the application

**Development (hot reload; client on 5173, API on 3001):**

```powershell
npm run dev
```

Open http://localhost:5173.

**Run each part separately in two terminals:**

```powershell
npm run dev:server    # API: http://localhost:3001
npm run dev:client    # UI:  http://localhost:5173
```

**Production-style (build the client, Express serves everything on one port):**

```powershell
npm start
```

Open http://localhost:3001.

Quick API checks (with the server running):

```powershell
Invoke-RestMethod http://localhost:3001/api/health

$body = @{ fullName='Asha Raman'; email='asha@example.com'; category='postal-services'; subject='Delayed parcel'; message='My parcel was delayed by a week.' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/feedback -ContentType 'application/json' -Body $body

# Only works if ADMIN_TOKEN is set in .env
Invoke-RestMethod -Uri http://localhost:3001/api/feedback -Headers @{ 'X-Admin-Token' = 'your-token' }
```

## Testing

```powershell
npm test               # server tests, then client tests
npm run test:server    # Vitest + Supertest (API, validation, SQLite persistence, startup/integration)
npm run test:client    # Vitest + Testing Library in jsdom (form, validation, service, semantics, keyboard)
npm run contrast       # WCAG contrast ratios for every colour pair used by the portal
```

What the automated tests cover: form rendering, input validation, submission, success/error/loading messages, health endpoint, valid and invalid submissions, database persistence (including closing and reopening the database file), admin-only listing, rate limiting, application startup over real HTTP, the client service talking to the running API, landmarks, heading order, skip link, tab order and menu keyboard behaviour.

**Cannot be automated here and need manual checks:** responsive layout at real viewport sizes, real-browser keyboard and focus appearance, screen-reader behaviour, and Lighthouse. Use the checklist below.

Manual responsive check: open http://localhost:3001, press `F12`, toggle the device toolbar (`Ctrl+Shift+M`), test widths 320, 375, 768, 1024 and 1440 px. Confirm no horizontal scrollbar, the Menu button appears below 768 px, and text remains readable at 200% browser zoom.

Manual keyboard check: reload, press `Tab` once (skip link appears), continue through the nav, form fields and button; confirm a visible focus ring everywhere; submit empty (focus moves to the error summary); submit valid data.

## Running the Lighthouse audit

Lighthouse needs Chrome. Use **two PowerShell windows**.

**Audit the portal:**

```powershell
# Window 1
npm start

# Window 2
npm run lighthouse:portal
```

This writes `docs/lighthouse/portal.report.html` and `portal.report.json`. Open the HTML file and record the score in the table above.

**Audit the reference site:**

```powershell
npm run lighthouse:indiapost
```

Alternatively use Chrome DevTools: `F12` → **Lighthouse** → Mode *Navigation* → Category *Accessibility* → **Analyze page load** (see [docs/audit-report.md](docs/audit-report.md) for the full manual audit procedure, console snippets and the keyboard checklist).

## API documentation

Base URL: `http://localhost:3001`

### `GET /api/health`

`200` `{ "status": "ok", "database": "ok", "uptimeSeconds": 12, "timestamp": "..." }`; `503` with `"status": "degraded"` if the database is unavailable.

### `POST /api/feedback`

Body (JSON, all required, trimmed):

| Field | Rule |
| --- | --- |
| `fullName` | 2 to 100 characters |
| `email` | valid email, up to 254 characters |
| `category` | one of `postal-services`, `financial-services`, `online-services`, `accessibility`, `customer-support`, `other` |
| `subject` | 3 to 120 characters |
| `message` | 10 to 2000 characters |

Responses: `201` `{ "message": "...", "data": { "id": 1, "createdAt": "..." } }` · `400` `{ "message": "...", "errors": { "email": "..." } }` · `413` body too large · `429` rate limited (`Retry-After` header) · `500` generic error.

### `GET /api/feedback`

Returns stored feedback (newest first) as `{ "data": [...], "pagination": { "limit", "offset", "total" } }`. Query: `limit` (1 to 100, default 50), `offset`. Requires header `X-Admin-Token`. `403` if `ADMIN_TOKEN` is not configured, `401` if the token is missing or wrong.

## Screenshots

**None captured.** `docs/screenshots/` is empty. After you run the audit and the app, save images there (for example `issue-1-missing-alt.png`, `portal-home-desktop.png`, `portal-form-errors.png`) and link them here.

## What is done and what needs manual verification

| Item | State |
| --- | --- |
| Monorepo structure, root scripts, `.env.example`, `.gitignore` | Written |
| React frontend (all sections, form, states, accessibility features) | Written, **not run in a browser** |
| Express API, validation, SQLite integration, admin protection, rate limit | Written, **not run** |
| Server tests (Vitest + Supertest) and client tests (Vitest + Testing Library) | Written, **not executed** |
| Contrast calculation (`npm run contrast`) | Executed once in the generation environment: 23/23 pairs met their minimums (arithmetic only, not a browser measurement) |
| `docs/architecture.md` | Written |
| `docs/audit-report.md` | Procedure and templates written; **audit not performed**, evidence empty |
| Lighthouse scores (site and portal) | **Not measured** |
| Screenshots | **None** |
| Dependency installation, `npm test`, `npm start` | **You must run these** |
| Screen-reader and real-device testing | **Not done** |

WCAG 2.2 AA is the design target. **No conformance claim is made** until testing is complete.

## Publishing to GitHub

Nothing has been pushed anywhere and no remote exists. A local Git repository is initialised with the files staged. To commit and publish (replace the placeholders):

```powershell
git config user.name "Your Name"
git config user.email "you@example.com"
git status                       # confirm .env and server/data are NOT listed
git commit -m "Initial commit: accessible public service portal and audit documentation"
git branch -M main
git remote add origin https://github.com/<your-username>/accessibility-audit.git
git push -u origin main
```

Create the empty repository on GitHub first (no README, no .gitignore). After `npm install`, also commit the generated `package-lock.json`.

## Future enhancements

- Admin interface with real authentication and roles.
- PostgreSQL option behind the repository layer; migrations.
- Playwright end-to-end tests with axe-core, and Lighthouse CI as an accessibility budget in GitHub Actions.
- Internationalisation (multiple Indian languages), plain-language review, and accessible alternatives to CAPTCHA.
- Email acknowledgements and status tracking for submitted feedback.
