/**
 * BLACKOUT: RESTORE THE GRID
 * Reusable Results Layout View (Page G)
 * Sphinx @ MNIT Jaipur
 */

import { getGameById, GAMES_CONFIG } from '../games-config.js';

export function renderResultsView(gameId) {
  const game = getGameById(gameId) || GAMES_CONFIG[0];

  return `
    <div class="section">
      <div class="container">
        <a href="#/games" class="page-nav-back">
          ← Back to Games Directory
        </a>

        <div class="page-header-block" style="text-align: center; max-width: 680px; margin-left: auto; margin-right: auto;">
          <span class="section-eyebrow">
            MISSION SUMMARY // ${game.name.toUpperCase()}
          </span>
          <h1 class="section-title">RESULTS LAYOUT</h1>
          <p class="section-subtitle">
            Post-game telemetry framework for ${escapeHtml(game.name)}.
          </p>
        </div>

        <article class="results-card" aria-labelledby="results-title">
          <div style="text-align: center; margin-bottom: var(--space-6); padding-bottom: var(--space-4); border-bottom: 1px solid var(--border-subtle);">
            <span class="telemetry-tag">ACTIVE CHANNEL: ${escapeHtml(game.name.toUpperCase())}</span>
            <h2 id="results-title" style="font-size: var(--text-2xl); font-weight: 800; margin-top: var(--space-2);">
              GAMEPLAY RESULTS // PREVIEW STATE
            </h2>
          </div>

          <aside class="protocol-disclaimer-box" role="note" style="margin-bottom: var(--space-8);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber" aria-hidden="true" style="flex-shrink: 0;">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div>
              <strong>HONEST STATUS NOTICE:</strong> No genuine gameplay results, scores, completion times, or ranks 
              are displayed because actual gameplay has not yet been implemented. Real telemetry will populate 
              here once the game modules are deployed for Sphinx at MNIT Jaipur.
            </div>
          </aside>

          <!-- Placeholder Telemetry Grid -->
          <div class="results-grid">
            <div class="result-box">
              <div class="result-box-label">Game Score</div>
              <div class="result-box-val text-cyan">--</div>
            </div>
            <div class="result-box">
              <div class="result-box-label">Leaderboard Rank</div>
              <div class="result-box-val text-amber">--</div>
            </div>
            <div class="result-box">
              <div class="result-box-label">Transmission</div>
              <div class="result-box-val text-tertiary">STANDBY</div>
            </div>
          </div>

          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: var(--space-4); padding-top: var(--space-6); border-top: 1px solid var(--border-subtle);">
            <a href="#/leaderboards/${game.id}" class="btn btn-primary">
              View ${escapeHtml(game.name)} Leaderboard
            </a>
            <a href="#/games" class="btn btn-secondary">
              Return to Games Directory
            </a>
            <a href="#/play/${game.id}" class="btn btn-ghost">
              Revisit Gameplay Shell
            </a>
          </div>
        </article>
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
