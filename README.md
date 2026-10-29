# Blackout: Restore the Grid

> A futuristic, cyberpunk game platform engineered for **Sphinx**, the annual technical festival at **Malaviya National Institute of Technology (MNIT), Jaipur**.

---

## Phase 2 Milestone: Remaining Website Pages & Navigation

Phase 2 extends the platform with the full set of explicitly authorized frontend pages, client-side routing, and interactive views while strictly preserving the approved design system and centralized game configuration.

### Authorized Pages Implemented

| Route | Page | Description |
| :--- | :--- | :--- |
| `#/` | **Command Center (Landing Page)** | The approved Phase 1 landing page with exact headline `"THE GRID IS DOWN."`, circuit SVG schematic, and 5-game preview. |
| `#/games` | **Games Directory** | Directory displaying the five game entries (`Game 01` through `Game 05`) from `GAMES_CONFIG` with links to details and leaderboards. |
| `#/games/:id` | **Game Details** | Reusable template displaying game name, placeholder briefing, leaderboard note, and a non-functional "Launch Game Shell" action with explicit disclaimer. |
| `#/how-to-play` | **How to Play** | General information page presenting the confirmed 4-step participation flow and explicit notice that game-specific rules will follow. |
| `#/register` | **Terminal Registration** | Form with **strictly three fields** (`Full Name`, `College ID`, `College Name`), required-field validation, and an honest demonstration state message (no database persistence). |
| `#/leaderboards` | **Leaderboards Console** | Five dedicated game leaderboard channels (`Game 01` – `Game 05`), unified per-game score rule (no per-stage division), and an honest standby state without fabricated scores. |
| `#/play/:id` | **Gameplay Shell** | Reusable, non-functional gameplay layout shell identifying the selected game with a prominent `"SPECIFICATION IN PROGRESS"` banner. |
| `#/results/:id` | **Results Layout** | Minimal reusable results framework displaying placeholder metrics (`--`) with explicit notice that genuine results will stream once games are deployed. |
| `*` | **Not Found (404)** | Clean cyber-terminal 404 error view with a working return link to the command center. |

---

## Centralized Game Configuration

All five game entries remain strictly defined in:
👉 [`js/games-config.js`](file:///Users/vivekkumar/CRYX/js/games-config.js)

- **Configurable Content:** Game names, descriptions, status labels, and leaderboard associations can be updated in this single file to automatically refresh the landing preview, games directory, details pages, and leaderboard tabs.
- **Code Change Boundaries:** Interactive game mechanics, scoring algorithms, and backend database persistence will require code modifications in future phases once confirmed.

---

## Local Execution Instructions

To run the application locally on any laptop:

### Option 1: Using Python 3 (Installed)
```bash
python3 -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in any modern browser.

### Option 2: Using Node / npx
```bash
npx serve -l 8000 .
```

Direct page refreshes (e.g. `http://localhost:8000/#/register`) work natively via client-side hash routing.

---

## Verification & Quality Checklist

- [x] **No Unapproved Additions:** Zero invented game mechanics, scoring rules, timer rules, fake participant scores, or fake official logos.
- [x] **Registration Scoped Strictly:** Only `Full Name`, `College ID`, and `College Name`. No unapproved fields.
- [x] **Truthful States:** The registration form clearly communicates demonstration state without implying permanent data storage; leaderboards show honest standby states without fabricated ranks.
- [x] **Complete Routing Coverage:** All 9 authorized routes tested and verified.
- [x] **Optional Terminal Sound Effects:** Web Audio API synthesized micro-clicks with footer toggle, OFF by default, and localStorage client preference persistence.
- [x] **Responsive Layout:** Desktop, tablet, and mobile layouts verified with zero horizontal overflow.
- [x] **Accessibility:** High-contrast visible focus rings, WCAG 2.2 AA contrast compliance, ARIA tablist/tabpanel, keyboard navigation, and reduced-motion support.
