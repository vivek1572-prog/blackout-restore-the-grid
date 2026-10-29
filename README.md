# Blackout: Restore the Grid

> A futuristic, cyberpunk game platform engineered for **Sphinx**, the annual technical festival at **Malaviya National Institute of Technology (MNIT), Jaipur**.

---

## Phase 1 Milestone: Design System & Landing Page

This milestone establishes the foundational design system tokens, responsive control-room visual architecture, and a fully functional, self-contained landing page.

### Key Features Implemented

1. **Self-Contained Design System (`css/tokens.css`, `css/base.css`, `css/components.css`)**:
   - **Color Palette:** Deep black void (`#050608`), charcoal surfaces (`#0a0d14`, `#111622`), electric cyan primary accents (`#00f0ff`), restrained status green (`#00e676`), warning amber (`#ffb300`), and alert crimson (`#ff2a55`).
   - **Contrast & Accessibility:** Fully compliant with WCAG 2.2 AA contrast standards.
   - **Zero External Dependencies:** Built with native HTML5, modern CSS custom properties, and standard ES modules. No Google Fonts, CDN scripts, or external graphics required.
   - **Hardware-Accelerated UI:** High-performance CSS transforms and linear gradient masks instead of heavy multi-pass blur filters.

2. **Landing Page Architecture (`index.html`, `css/landing.css`, `js/main.js`, `js/telemetry.js`)**:
   - **A. Navigation:** Sticky command bar with system clock, network telemetry (`LINK: ONLINE / STANDALONE`), audio toggle placeholder, in-page navigation, and a responsive mobile drawer menu.
   - **B. Hero Section:** Headline **"THE GRID IS DOWN. RESTORE THE GRID."** with mission narrative, primary/secondary action triggers, capacity telemetry, and an interactive inline SVG power grid schematic with 5 disconnected substations.
   - **C. Game Preview Section:** Exactly five temporary slots (`Game 01` through `Game 05`) styled with distinct visual touches (Substations Alpha through Epsilon) while maintaining design cohesion. Includes an accessible slot inspection modal (`<dialog>`).
   - **D. Leaderboard Section:** Standalone leaderboard architecture explaining that each game has its own leaderboard with no per-level fragmentation. Interactive tablist switching channels across Game 01 – Game 05 with truthful standby states.
   - **E. How to Play:** 4-step mission briefing (Intake, Selection, Execution, Sync) with explicit disclaimers regarding unconfirmed rules and scoring mechanics.
   - **F. Footer:** Sphinx @ MNIT Jaipur identification with editable event placeholders.

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

## Verification & Quality Checklist

- [x] **No Unimplemented Routes:** All navigation links scroll smoothly to real, implemented sections (`#overview`, `#games`, `#leaderboards`, `#how-to-play`).
- [x] **Truthful States:** No simulated fake scores, fabricated backend calls, or invented game mechanics.
- [x] **Responsive Layout:** Tested across desktop widescreen, tablet, and mobile (no horizontal overflow).
- [x] **Accessibility:** Proper skip-link, semantic landmarks, ARIA tablist/tabpanel, native `<dialog>` modal with keyboard focus trapping and Escape key support, `:focus-visible` outlines.
- [x] **Reduced Motion Support:** `@media (prefers-reduced-motion: reduce)` disables animations and continuous pulsing.
