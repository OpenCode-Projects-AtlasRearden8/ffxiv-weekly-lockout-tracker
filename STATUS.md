# STATUS.md

## What was built

**FFXIV Weekly Lockout Tracker** — a single-file, zero-dependency static web app for tracking FFXIV weekly lockouts (raids, trials/custom deliveries, turn-ins, and anything else the user adds) across a roster of characters.

Everything lives in `index.html` (HTML + CSS + JS inline). It runs offline directly from the local filesystem — no server, no build step, no accounts, no network calls. All data persists in the browser's `localStorage` under the key `ffxiv-weekly-lockout-tracker-v1`.

Features as shipped:

- **Toggle-based checklist** — characters grouped by data center in the sidebar; each character has the weekly task list, checkbox per task, per-week completion (keyed by the UTC week anchor date, so past weeks are preserved automatically as history).
- **Reset-day countdown** — header chip with a live "Next reset in Xd XXh XXm" countdown, refreshed every 30 seconds, anchored to FFXIV's actual weekly reset moment (Tuesday 08:00 UTC). The countdown is timezone-proof because week math uses pure UTC.
- **Per-data-center week handling** — characters belong to a data center (Aether, Crystal, Dynamis, Primal, Chaos, Light, Shadow, Elemental, Gaia, Mana, Meteor, Materia — the current live data center list); the UI groups the roster by data center and tracks each character's lockouts per character-per-week, which is what matters for DC travel. All data centers share the same reset moment.
- **Editable task list** — ships 8 starter tasks in 4 groups (Raids, Trials, Turn-ins, Other): Savage tier weekly clear, weekly raids for loot-hungry jobs, trial quest, Custom Deliveries (12), Wondrous Tails, weekly alliance-raid quest, tomestone cap (450), Frontline PvP. Users can add, rename, and delete tasks; deletions also scrub that task from every week's history.
- **Week navigation** — Previous / Next / "This week" buttons; completions in any week are stored independently, so ticking things in a past or future week never mutates the current week.
- **Backup & restore** — export to a JSON file, import from JSON, for pre-clearing-browser-data safety.
- **Progress feedback** — per-character progress bar + "N of M done", sidebar counters per character, "Week complete" state, and a toast for actions.
- **Resilience** — corrupted localStorage falls back to a fresh default state; storage write failures surface a warning toast instead of crashing.

## How to run

Double-click / open `index.html` in any modern browser. That's the whole app.

Optional (development only): run the reset-logic tests with Node 18+:

```bash
node --test tests/
```

## Verification results (as of build date)

- `node --test tests/` — **15/15 tests pass** (reset/week-anchoring logic: mid-week timestamps, the exact Tuesday-08:00-UTC boundary, Monday/Sunday edges, week chaining, orbit sweep across 3 weeks with no gaps/overlaps, countdown math and formatting, zero-suffix clamps, offset arithmetic, id format).
- Automated DOM smoke test (Node with a minimal DOM/localStorage shim, no dependencies): character add via form, checkbox toggle persistence to state and localStorage, custom task add + rename + delete, week navigation, per-week completion isolation (past-week edits don't touch current week), character deletion with history cleanup, storage-write-failure toast, `tickCountdown()` refresh, corrupt-storage recovery — **all checks passed**.
- Full inline script passes `node --check` (syntax validation).
- The app-level script was also reviewed for: checkbox `id`/`for` pairing for accessibility, aria-labels on delete buttons, and keyboard operation (Enter/Escape in the rename input).

## Known gaps / limitations

- Data-center week identity is purely organizational: completion is tracked per character (per week). The app deliberately does not model any game-side per-DC quirk; all data centers use the same Tuesday 08:00 UTC reset.
- No per-character task overrides (task list is shared roster-wide — weekly objectives are the same for every character in-game, so this matches the real mechanics, but a player who wants a different list per job can't do that yet).
- Character import does not merge with existing data — importing replaces the roster wholesale (documented as "restore").
- No automated tests for the UI layer beyond the smoke script; the smoke script is not shipped as a tracked file (it lives in the dev environment), only the reset-logic tests are.
- No service worker/offline cache manifest — the single file is inherently offline once saved locally, but nothing pre-caches it from a hosted origin.
- i18n: English only; weekend/holiday pacing (e.g., maintained Tuesdays delaying reset) is not modeled since FFXIV's weekly reset is not shifted by maintenance.

## License

MIT — see `LICENSE`. Copyright (c) 2026 Asdale Dynamics, LLC. Built by Asdale Dynamics, LLC (Dylan Asdale) — plain-English, beginner-friendly tools.
