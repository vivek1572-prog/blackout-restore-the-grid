/**
 * BLACKOUT: RESTORE THE GRID
 * Standalone Leaderboards View (Page E)
 * Sphinx @ MNIT Jaipur
 */

import { GAMES_CONFIG, getGameById } from '../games-config.js';

export function renderLeaderboardsView(selectedGameId = 'game-01') {
  const selectedGame = getGameById(selectedGameId) || GAMES_CONFIG[0];

  return `
    <div class="section">
      <div class="container">
        <a href="#/" class="page-nav-back">
          ← Back to Command Center
        </a>

        <div class="page-header-block">
          <span class="section-eyebrow">
            COMPETITION TELEMETRY // LEADERBOARDS
          </span>
          <h1 class="section-title">GAME LEADERBOARDS</h1>
          <p class="section-subtitle">
            Each game features its own separate, dedicated leaderboard. 
            There are no separate leaderboards for individual stages or levels.
          </p>
        </div>

        <div class="leaderboard-console">
          <!-- Game Channel Tabs -->
          <div class="lb-tabs" role="tablist" aria-label="Game leaderboard selection">
            ${GAMES_CONFIG.map(game => `
              <a 
                href="#/leaderboards/${game.id}" 
                class="lb-tab-btn ${game.id === selectedGame.id ? 'is-active' : ''}" 
                role="tab" 
                aria-selected="${game.id === selectedGame.id ? 'true' : 'false'}"
                id="lb-tab-${game.id}"
                aria-controls="leaderboard-display-panel"
              >
                CHANNEL ${game.slot} // ${game.name.toUpperCase()}
              </a>
            `).join('')}
          </div>

          <!-- Standalone Panel for Selected Game -->
          <div id="leaderboard-display-panel" class="lb-display-panel" role="tabpanel" aria-labelledby="lb-tab-${selectedGame.id}">
            <div class="lb-panel-header">
              <div>
                <div class="lb-channel-id">CHANNEL ${selectedGame.slot} // ${selectedGame.name.toUpperCase()} LEADERBOARD</div>
                <div class="text-secondary font-mono text-xs" style="margin-top: 4px;">
                  Active Channel: ${selectedGame.name} &nbsp;|&nbsp; 
                  Leaderboard: Dedicated (no stage-wise leaderboards)
                </div>
              </div>
              <span class="status-indicator is-alert">
                <span class="status-dot" aria-hidden="true"></span>
                STANDBY: PRE-EVENT
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

              <h2 class="lb-standby-title" style="font-size: var(--text-xl);">NO ACTIVE RANKINGS RECORDED</h2>

              <p class="lb-standby-text">
                Live rankings for <strong>${escapeHtml(selectedGame.name)}</strong> will stream directly from the 
                centralized backend during Sphinx at MNIT Jaipur. 
                In strict adherence to event requirements, no fabricated scores, fake participant names, or simulated 
                ranks are displayed.
              </p>

              <aside class="protocol-disclaimer-box" role="note" style="max-width: 600px; margin: 0 auto var(--space-6); text-align: left;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber" aria-hidden="true" style="flex-shrink: 0;">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                  <strong>CONFIRMED LEADERBOARD RULE:</strong> Exactly one leaderboard per game. 
                  There are no separate leaderboards for individual stages or levels.
                </div>
              </aside>

              <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: var(--space-4);">
                <a href="#/games/${selectedGame.id}" class="btn btn-secondary">
                  Inspect ${escapeHtml(selectedGame.name)} Details
                </a>
                <a href="#/play/${selectedGame.id}" class="btn btn-ghost">
                  Launch Game Shell
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
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
