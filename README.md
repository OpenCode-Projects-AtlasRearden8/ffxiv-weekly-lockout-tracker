# FFXIV Weekly Lockout Tracker

A tiny, offline-friendly static web app for tracking Final Fantasy XIV weekly lockouts across your whole roster: raids, trials (including Custom Deliveries), turn-ins, and anything else you add yourself. Toggle-based checklist, a live countdown to the weekly reset, characters grouped by data center, and all data stored in your browser's localStorage. No accounts, no logins, no servers, no dependencies.

Built by [Asdale Dynamics, LLC](https://dylanasdale.github.io) — beginner-friendly tools that explain themselves, like a friend would.

## Quick start

1. Download or clone this folder.
2. Double-click `index.html` (or drag it into any modern browser).

That's it. It's a single self-contained HTML file with zero dependencies — it works offline, straight from your local disk. No build step, no install, no account required.

## What it does

- **Toggle-based checklist** — check off tasks for each character as you clear them. Your progress for the week is saved instantly to localStorage.
- **Reset-day countdown** — a live "Next reset in: Xd XXh XXm" counter in the header. FFXIV weekly resets are every **Tuesday at 8:00 AM UTC**, and the app computes weeks against that fixed UTC anchor (so it's correct no matter your time zone or daylight-saving changes).
- **Per-data-center week handling** — characters are grouped under their data center (Aether, Crystal, Chaos, Light, Elemental, Gaia, Mana, Meteor, Materia, etc.), and every character's completion is tracked **per character, per week**. Handy when you DC-travel across your roster or manage characters spread over multiple data centers.
- **Week navigation** — flip back to see last week's (or earlier) completions, or peek at the upcoming week. Data from past weeks is kept automatically; each new reset week simply starts fresh.
- **Editable task list** — ships with a solid starter list (Savage tier weekly, trial quest, Custom Deliveries, Wondrous Tails, tome cap, Frontline PvP, and more). Rename, add, or delete tasks via the "Manage weekly tasks" section at the bottom. The task list is shared across characters, since weekly objectives are the same for everyone.
- **Progress at a glance** — per-character progress bars, per-character counts in the sidebar, and a "Week complete" state when everything's checked.
- **Backup & restore** — export your data to a JSON file and import it again (useful before clearing browser data or moving browsers).

## Default starter task list

Groups: **Raids**, **Trials**, **Turn-ins**, **Other**

- Raids: Current Savage tier weekly clear; weekly raids on all jobs needing loot
- Trials: Weekly trial quest / Ex trial clear; Custom deliveries (12 turn-ins)
- Turn-ins: Wondrous Tails (9 stickers); weekly alliance raid / leveling quest
- Other: Cap weekly tomestones (450); Frontline PvP (3 matches)

Everything is editable — delete what doesn't apply to you and add your own, like "M8S 8-chest party" or "Renown deliveries for the new client".

## Game-mechanics notes (the friendly version)

- The weekly reset time is a fixed UTC moment (Tuesday 08:00 AM UTC), so the app is timezone-proof: 8:00 UTC is 4:00 AM Eastern, 1:00 AM Pacific, 5:00 PM in Tokyo.
- All data centers use the same weekly reset moment. "Per-data-center week handling" here means: your roster is organized by data center, and lockouts/completions are tracked **per character**, which is what matters when you DC-travel between worlds.
- Checked states from previous weeks are preserved as history; you can't accidentally wipe them by browsing around.

## Privacy

- Everything stays in your browser's localStorage. There are no network calls, no analytics, no cookies, no accounts.
- No personal data is collected or transmitted — the app never talks to a server.

## Running the tests

The reset-date logic (week anchoring, boundaries, countdown math) is extracted from `index.html` between `BEGIN-TIME-LOGIC` / `END-TIME-LOGIC` markers and tested with Node's built-in test runner — no dev dependencies needed:

```bash
node --test tests/
```

You'll need Node.js 18+ installed. This is only for developing the app; end users don't need Node at all.

## Project layout

```
index.html            The entire app (HTML + CSS + JS, single file)
tests/reset.test.mjs  Tests for the reset/week-boundary logic
LICENSE               MIT License
README.md             This file
STATUS.md             Build/verification notes
```

## Contributing

PRs welcome — keep it dependency-free and single-file. Run the tests before submitting.

## License

MIT — see [LICENSE](LICENSE). Copyright (c) 2026 Asdale Dynamics, LLC.

*FFXIV Weekly Lockout Tracker is a fan-made tool. Final Fantasy XIV is a trademark of Square Enix. This project is not affiliated with or endorsed by Square Enix.*
