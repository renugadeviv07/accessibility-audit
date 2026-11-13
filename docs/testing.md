# Testing status

| Area | How | Status |
|---|---|---|
| Backend API (health, valid/invalid submit, persistence, auth) | `npm run test:server` (Vitest + Supertest) | **Executed: 12 / 12 passed** |
| Frontend form (render, validation, submit, success/error) | `npm run test:client` (Vitest + Testing Library) | **Executed: 7 / 7 passed** |
| Service layer and SQLite logic | Smoke-tested directly with Node 22 during generation | **Executed, passed** (see README) |
| App startup and frontend/backend connection | `npm run dev`, open http://localhost:5173, submit the form | Manual, not yet done |
| Responsive layout | DevTools device toolbar at 360, 768, 1280 px; no horizontal scroll | Manual, not yet done |
| Keyboard accessibility | Tab through page; skip link, focus ring, form, error summary links | Manual, not yet done |
| Lighthouse (portal) | `npm start` then `npm run audit:app` | Not run |

## Manual keyboard script
1. Reload, press `Tab`: the *Skip to main content* link appears. `Enter` moves focus to main.
2. Tab through the nav, then to the form. Every control shows a gold/navy focus ring.
3. Press *Submit feedback* empty: focus lands on the error summary; each link focuses its field.
4. Fill correctly and submit: a green status message is shown and announced by a screen reader (test with NVDA / VoiceOver).
