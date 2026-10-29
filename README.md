# Blackout: Restore the Grid

> A futuristic, cyberpunk game platform engineered for **Sphinx**, the annual technical festival at **Malaviya National Institute of Technology (MNIT), Jaipur**.

---

## Phase 1 Milestone: Design System, Centralized Architecture & Landing Page

This milestone establishes the foundational design system tokens, responsive control-room visual architecture, centralized game configuration, and a self-contained landing page adhering strictly to confirmed requirements.

### Key Features Implemented

1. **Centralized Game Configuration (`js/games-config.js`)**:
   - Single structured source of truth for the five temporary game entries (`Game 01` through `Game 05`).
   - The five game preview cards in `#games` and the channel tabs in `#leaderboards` are dynamically rendered from this shared configuration rather than duplicated in markup.
   - Future game names, descriptions, and settings can be modified in this single file without touching the layout HTML or shared components.

2. **Self-Contained Design System (`css/tokens.css`, `css/base.css`, `css/components.css`)**:
   - **Color Palette:** Deep black void (`#050608`), charcoal surfaces (`#0a0d14`, `#111622`), electric cyan primary accents (`#00f0ff`), restrained status green (`#00e676`), and alert amber (`#ffb300`).
   - **Contrast & Accessibility:** Full WCAG 2.2 AA contrast compliance.
   - **Zero External Dependencies:** Native HTML5, modern CSS custom properties, and standard ES modules. No Google Fonts, CDN scripts, or external graphics required.
   - **Performance-Conscious UI:** Hardware-accelerated CSS transforms and gradient masks instead of heavy multi-pass blur filters.

3. **Landing Page Architecture (`index.html`, `css/landing.css`, `js/main.js`)**:
   - **A. Navigation:** Sticky command bar with Blackout branding, Sphinx @ MNIT Jaipur attribution, navigation links to implemented sections, and a responsive mobile drawer menu.
   - **B. Hero Section:** Confirmed headline **"THE GRID IS DOWN. RESTORE THE GRID."** with platform narrative, primary/secondary action triggers, and an inline SVG schematic of a disrupted power grid with 5 disconnected game nodes.
   - **C. Game Preview:** Exactly five cards (`Game 01` through `Game 05`) rendered dynamically from `js/games-config.js`, with explicit placeholder indicators. No invented mechanics or fake difficulty ratings. Includes an accessible slot inspection modal (`<dialog>`).
   - **D. Leaderboards Entry:** Standalone leaderboard architecture explaining that each game has its own dedicated leaderboard with no per-level fragmentation. Interactive tablist switching channels across Game 01 – Game 05 with truthful standby states.
   - **E. How to Play:** 4-step mission flow (Register, Choose a Game, Play, View Leaderboard) with explicit disclaimers regarding unconfirmed rules and scoring mechanics.
   - **F. Footer:** Project name and Sphinx at MNIT Jaipur identification with truthful in-page navigation links.

---

## Local Execution Instructions

To preview the landing page on any laptop:

### Option 1: Using Python 3 (Installed)
```bash
python3 -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in any modern browser.

### Option 2: Using Node / npx
```bash
npx serve -l 8000 .
```

---

## Verification Checklist

- [x] **No Unapproved Additions:** Removed all unapproved extras (unrequested live clock, audio buttons, invented statistics, and fake substation names).
- [x] **Centralized Configuration:** The five game entries are stored in `js/games-config.js` and rendered dynamically.
- [x] **No Unimplemented Routes:** All navigation links scroll smoothly to real, implemented sections (`#overview`, `#games`, `#leaderboards`, `#how-to-play`).
- [x] **Truthful States:** No simulated fake scores, fabricated backend calls, or invented game mechanics.
- [x] **Responsive Layout:** Tested across desktop widescreen, tablet, and mobile (no horizontal overflow).
- [x] **Accessibility:** Proper skip-link, semantic landmarks, ARIA tablist/tabpanel, native `<dialog>` modal with keyboard focus trapping and Escape key support, `:focus-visible` outlines.
- [x] **Reduced Motion Support:** `@media (prefers-reduced-motion: reduce)` disables animations and continuous pulsing.
