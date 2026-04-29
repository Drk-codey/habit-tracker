# Habit Tracker PWA
 
A mobile-first Progressive Web App for tracking daily habits. Built with Next.js, React, TypeScript, and Tailwind CSS. All data is stored locally in the browser using `localStorage` — no server, no database.
 
---
 
## Project overview
 
Users can sign up, log in, create habits, mark them complete each day, and watch their streak grow. The app installs as a PWA and loads the app shell offline after the first visit.
 
---
 
## Setup instructions
 
**Requirements:** Node.js ≥ 20.9.0
 
```bash
# 1. Clone the repository
git clone <your-repo-url>
cd habit-tracker
 
# 2. Install dependencies
npm install
 
# 3. Install Playwright browsers (needed for E2E tests)
npx playwright install --with-deps
```
 
---
 
## Run instructions
 
```bash
# Start the development server
npm run dev
# → Open http://localhost:3000
 
# Build for production
npm run build
 
# Start the production server
npm run start
```
 
---
 
## Test instructions
 
```bash
# Run unit tests with coverage report
npm run test:unit
 
# Run unit + integration tests
npm run test:integration
 
# Run end-to-end tests (requires dev server running on port 3000)
npm run test:e2e
 
# Run all tests in sequence
npm run test
```
 
Coverage report is generated in the `/coverage` directory after `test:unit` runs.
The minimum threshold is **80% line coverage** for all files inside `src/lib/`.
 
---

## Local Persistence

All data is stored in the browser's `localStorage` under three keys:

- `habit-tracker-users` — array of user accounts
- `habit-tracker-session` — current logged-in user session (or null)
- `habit-tracker-habits` — all habits across all users

No backend or database is required.

## PWA support
 
The app is installable as a Progressive Web App via three mechanisms:
 
1. **`public/manifest.json`** — declares app name, icons, start URL, and display mode (`standalone`). Linked from `<head>` in `layout.tsx`.
2. **`public/sw.js`** — a service worker that caches the app shell on `install` and serves cached responses when offline.
3. **Service worker registration** — registered in `layout.tsx` via an inline `<script>` that calls `navigator.serviceWorker.register('/sw.js')` on the client side.
After the first load, navigating to `/` while offline will serve the cached shell instead of a network error.

## Trade-offs / Limitations

- Passwords are stored in plain text in localStorage
- No server-side rendering for protected routes (redirects happen client-side)
- Data is per-browser and cannot be shared between devices

---

## Test file map
 
| File | What it verifies |
|------|-----------------|
| `tests/unit/slug.test.ts` | `getHabitSlug()` — lowercasing, hyphenation, space collapsing, special-char removal |
| `tests/unit/validators.test.ts` | `validateHabitName()` — empty input, 60-char limit, trimmed return value |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak()` — empty array, today not completed, consecutive days, duplicates, gaps |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion()` — add date, remove date, no mutation, no duplicates |
| `tests/unit/storage.test.ts` | `getHabitsForUser()`, `saveHabit()`, `deleteHabit()` - CRUD operations |
| `tests/unit/auth.test.ts` | `signUp()`, `logIn()`, `logOut()` - Authentication operations |
| `tests/integration/auth-flow.test.tsx` | Signup form creates session, duplicate email error, login stores session, invalid login error |
| `tests/integration/habit-form.test.tsx` | Habit name validation, create/save to storage, edit preserves immutable fields, delete confirmation, completion toggles streak display |
| `tests/e2e/app.spec.ts` | Full user flows: splash redirect, auth guard, signup, login, habit CRUD, streak update, reload persistence, logout, offline shell |

---

Built for Frontend Wizards Stage 3.