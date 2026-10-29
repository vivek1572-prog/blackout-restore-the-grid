/**
 * BLACKOUT: RESTORE THE GRID
 * Landing Page View (Phase 1 Approved Architecture)
 * Sphinx @ MNIT Jaipur
 */

import { GAMES_CONFIG } from '../games-config.js';

export function renderLandingView() {
  return `
    <!-- HERO SECTION -->
    <section id="overview" class="hero-section" aria-labelledby="hero-main-title">
      <div class="container">
        <div class="hero-grid">
          <!-- Left Hero Narrative -->
          <div class="hero-content">
            <span class="section-eyebrow">
              SPHINX @ MNIT JAIPUR
            </span>

            <h1 id="hero-main-title" class="hero-headline">
              THE GRID IS DOWN.
            </h1>

            <p class="hero-lead">
              Welcome to Blackout: Restore the Grid, a cyberpunk game platform designed for Sphinx at MNIT Jaipur. 
              The platform will feature a future collection of five distinct games, where participants will 
              compete to bring power back to the grid.
            </p>

            <div class="hero-actions">
              <a href="#/games" class="btn btn-primary">
                Explore Games
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <a href="#/how-to-play" class="btn btn-secondary">
                How to Play
              </a>
            </div>
          </div>

          <!-- Right Hero Visual: Disrupted Power Grid Schematic -->
          <div class="hero-visual">
            <div class="grid-schematic-card" aria-label="Power Grid Schematic Visual">
              <div class="schematic-header">
                <span>DISRUPTED POWER GRID SCHEMATIC</span>
                <span id="schematic-status-readout" class="font-mono text-xs">POWER GRID SCHEMATIC // 05 DISCONNECTED NODES</span>
              </div>

              <div class="schematic-svg-container">
                <svg class="schematic-svg" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Circuit diagram representing the central grid and five disconnected game nodes">
                  <circle cx="200" cy="200" r="140" stroke="rgba(0, 240, 255, 0.1)" stroke-width="1" stroke-dasharray="2 4" />
                  <circle cx="200" cy="200" r="80" stroke="rgba(0, 240, 255, 0.15)" stroke-width="1" />

                  <line x1="200" y1="160" x2="200" y2="70" class="grid-circuit-line" />
                  <line x1="230" y1="180" x2="310" y2="120" class="grid-circuit-alert" />
                  <line x1="225" y1="225" x2="290" y2="290" class="grid-circuit-line" />
                  <line x1="175" y1="225" x2="110" y2="290" class="grid-circuit-alert" />
                  <line x1="170" y1="180" x2="90" y2="120" class="grid-circuit-line" />

                  <circle cx="200" cy="200" r="32" class="grid-node-hub" />
                  <circle cx="200" cy="200" r="16" fill="var(--cyan-dim)" stroke="var(--cyan-primary)" stroke-width="1.5" />
                  <text x="200" y="204" class="grid-node-label" fill="var(--cyan-primary)" font-weight="700">GRID</text>

                  <g class="grid-node-substation grid-node-slot" data-slot-target="1" aria-label="Game 01 Node">
                    <circle cx="200" cy="60" r="22" />
                    <text x="200" y="64" class="grid-node-label">01</text>
                  </g>
                  <g class="grid-node-substation grid-node-slot" data-slot-target="2" aria-label="Game 02 Node">
                    <circle cx="320" cy="110" r="22" />
                    <text x="320" y="114" class="grid-node-label">02</text>
                  </g>
                  <g class="grid-node-substation grid-node-slot" data-slot-target="3" aria-label="Game 03 Node">
                    <circle cx="300" cy="300" r="22" />
                    <text x="300" y="304" class="grid-node-label">03</text>
                  </g>
                  <g class="grid-node-substation grid-node-slot" data-slot-target="4" aria-label="Game 04 Node">
                    <circle cx="100" cy="300" r="22" />
                    <text x="100" y="304" class="grid-node-label">04</text>
                  </g>
                  <g class="grid-node-substation grid-node-slot" data-slot-target="5" aria-label="Game 05 Node">
                    <circle cx="80" cy="110" r="22" />
                    <text x="80" y="114" class="grid-node-label">05</text>
                  </g>
                </svg>
              </div>

              <div class="schematic-legend">
                <span>● CENTRAL GRID</span>
                <span class="text-amber">● 05 GAME NODES</span>
                <span>SELECT NODE TO VIEW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- GAME PREVIEW SECTION -->
    <section id="games" class="section" aria-labelledby="games-section-title">
      <div class="container">
        <div class="section-header">
          <span class="section-eyebrow">
            FUTURE GAME COLLECTION
          </span>
          <h2 id="games-section-title" class="section-title">GAME PREVIEW</h2>
          <p class="section-subtitle">
            The platform will feature exactly five distinct games. 
            Until game concepts, mechanics, and rules are confirmed, the temporary designations 
            Game 01 through Game 05 are used.
          </p>
        </div>

        <div id="landing-games-container" class="games-grid">
          ${GAMES_CONFIG.map((game, index) => `
            <article class="game-slot-card" data-slot="${index + 1}" aria-labelledby="slot-title-${game.id}">
              <div class="slot-meta-bar">
                <span class="slot-index">SLOT // ${game.slot}</span>
                <span class="status-indicator is-alert">
                  <span class="status-dot" aria-hidden="true"></span>
                  ${escapeHtml(game.status)}
                </span>
              </div>
              <h3 id="slot-title-${game.id}" class="slot-title">${escapeHtml(game.name)}</h3>
              <p class="slot-description">
                ${escapeHtml(game.description)}
              </p>
              <ul class="slot-specs-list" aria-label="${escapeHtml(game.name)} confirmed properties">
                <li class="slot-specs-row">
                  <span>Leaderboard:</span> 
                  <span class="slot-specs-val">${escapeHtml(game.leaderboardInfo)}</span>
                </li>
                <li class="slot-specs-row">
                  <span>Level Structure:</span> 
                  <span class="slot-specs-val">${escapeHtml(game.structureInfo)}</span>
                </li>
              </ul>
              <div class="hud-card-footer">
                <a href="#/games/${game.id}" class="btn btn-secondary">
                  Inspect Slot
                </a>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- LEADERBOARDS SECTION -->
    <section id="leaderboards" class="section" aria-labelledby="leaderboards-title">
      <div class="container">
        <div class="section-header">
          <span class="section-eyebrow">
            COMPETITION STRUCTURE
          </span>
          <h2 id="leaderboards-title" class="section-title">GAME LEADERBOARDS</h2>
          <p class="section-subtitle">
            Each game will have its own dedicated leaderboard. 
            Multiple levels or stages may exist within a game, but there will be no separate leaderboard for each level.
          </p>
        </div>

        <div class="leaderboard-console">
          <div class="lb-tabs" role="tablist" aria-label="Leaderboard game channels">
            ${GAMES_CONFIG.map((game, index) => `
              <button class="lb-tab-btn ${index === 0 ? 'is-active' : ''}" role="tab" aria-selected="${index === 0 ? 'true' : 'false'}" id="tab-landing-${game.id}" aria-controls="panel-landing-game" tabindex="${index === 0 ? '0' : '-1'}" data-game-id="${game.id}">
                CHANNEL ${game.slot} // ${game.name.toUpperCase()}
              </button>
            `).join('')}
          </div>

          <div id="panel-landing-game" class="lb-display-panel" role="tabpanel" aria-labelledby="tab-landing-game-01">
            <div class="lb-panel-header">
              <div>
                <div id="lb-landing-title" class="lb-channel-id">CHANNEL 01 // GAME 01 LEADERBOARD</div>
                <div id="lb-landing-desc" class="text-secondary font-mono text-xs">
                  Dedicated ranking channel for Game 01. Each game maintains a single dedicated leaderboard without stage-wise leaderboards.
                </div>
              </div>
              <span class="status-indicator is-alert">
                <span class="status-dot" aria-hidden="true"></span>
                STANDBY
              </span>
            </div>

            <div class="lb-standby-state">
              <div class="lb-standby-icon" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3 class="lb-standby-title">LEADERBOARD ACTIVATION PENDING</h3>
              <p class="lb-standby-text">
                Leaderboards will activate when games launch during Sphinx at MNIT Jaipur. 
                In accordance with event requirements, no fabricated scores, fake participant names, or simulated rankings are shown.
              </p>
              <div style="margin-top: var(--space-6);">
                <a href="#/leaderboards/game-01" id="lb-open-full-btn" class="btn btn-secondary">
                  Open Standalone Leaderboards
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW TO PLAY SECTION -->
    <section id="how-to-play" class="section" aria-labelledby="how-to-play-title">
      <div class="container">
        <div class="section-header">
          <span class="section-eyebrow">
            GENERAL PARTICIPATION FLOW
          </span>
          <h2 id="how-to-play-title" class="section-title">HOW TO PLAY</h2>
          <p class="section-subtitle">
            Review the confirmed four-step flow for participating in Blackout: Restore the Grid.
          </p>
        </div>

        <div class="protocol-steps">
          <article class="protocol-card">
            <span class="protocol-step-num">01</span>
            <h3 class="protocol-title">Register</h3>
            <p class="protocol-desc">
              Register with your Full Name, College ID, and College Name to begin.
            </p>
          </article>
          <article class="protocol-card">
            <span class="protocol-step-num">02</span>
            <h3 class="protocol-title">Choose a Game</h3>
            <p class="protocol-desc">
              Select from the five planned game entries (Game 01 through Game 05).
            </p>
          </article>
          <article class="protocol-card">
            <span class="protocol-step-num">03</span>
            <h3 class="protocol-title">Play the Game</h3>
            <p class="protocol-desc">
              Play the selected game. If a game includes multiple stages, no separate leaderboards will exist for individual stages.
            </p>
          </article>
          <article class="protocol-card">
            <span class="protocol-step-num">04</span>
            <h3 class="protocol-title">View Leaderboard</h3>
            <p class="protocol-desc">
              View standings on that game's dedicated leaderboard. Each game maintains its own separate leaderboard.
            </p>
          </article>
        </div>

        <aside class="protocol-disclaimer-box" role="note">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber" aria-hidden="true" style="flex-shrink: 0;">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <div>
            <strong>NOTICE:</strong> Registration and gameplay are not active in this phase. 
            Game-specific rules, scoring systems, and stage mechanics will be provided when the games are finalized.
          </div>
        </aside>
      </div>
    </section>
  `;
}

export function initLandingInteractions() {
  // SVG nodes interactivity
  const nodes = document.querySelectorAll('.grid-node-slot');
  const readout = document.getElementById('schematic-status-readout');

  nodes.forEach(node => {
    const slotNumber = node.getAttribute('data-slot-target');
    const label = `GAME 0${slotNumber}`;

    node.addEventListener('mouseenter', () => {
      if (readout) {
        readout.textContent = `NODE 0${slotNumber}: ${label} [STANDBY]`;
        readout.classList.add('text-amber');
      }
    });

    node.addEventListener('mouseleave', () => {
      if (readout) {
        readout.textContent = 'POWER GRID SCHEMATIC // 05 DISCONNECTED NODES';
        readout.classList.remove('text-amber');
      }
    });

    node.addEventListener('click', () => {
      const targetCard = document.querySelector(`.game-slot-card[data-slot="${slotNumber}"]`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.style.outline = '2px solid var(--cyan-primary)';
        setTimeout(() => {
          targetCard.style.outline = 'none';
        }, 2000);
      }
    });
  });

  // Landing leaderboard preview tabs
  const tablist = document.querySelector('#leaderboards [role="tablist"]');
  if (tablist) {
    const tabs = tablist.querySelectorAll('[role="tab"]');
    const title = document.getElementById('lb-landing-title');
    const desc = document.getElementById('lb-landing-desc');
    const panel = document.getElementById('panel-landing-game');
    const fullBtn = document.getElementById('lb-open-full-btn');

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.setAttribute('aria-selected', 'false');
          t.classList.remove('is-active');
          t.setAttribute('tabindex', '-1');
        });

        tab.setAttribute('aria-selected', 'true');
        tab.classList.add('is-active');
        tab.setAttribute('tabindex', '0');

        const game = GAMES_CONFIG[index];
        if (panel) panel.setAttribute('aria-labelledby', tab.id);
        if (title) title.textContent = `CHANNEL ${game.slot} // ${game.name.toUpperCase()} LEADERBOARD`;
        if (desc) desc.textContent = `Dedicated ranking channel for ${game.name}. Each game maintains a single dedicated leaderboard without stage-wise leaderboards.`;
        if (fullBtn) fullBtn.setAttribute('href', `#/leaderboards/${game.id}`);
      });
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
