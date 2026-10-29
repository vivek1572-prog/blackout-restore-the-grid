/**
 * BLACKOUT: RESTORE THE GRID
 * Games Directory View (Page A)
 * Sphinx @ MNIT Jaipur
 */

import { GAMES_CONFIG } from '../games-config.js';

export function renderGamesDirectoryView() {
  return `
    <div class="section">
      <div class="container">
        <a href="#/" class="page-nav-back">
          ← Back to Command Center
        </a>

        <div class="page-header-block">
          <span class="section-eyebrow">
            GAMES DIRECTORY // 05 SLOTS
          </span>
          <h1 class="section-title">MISSION DOCKS</h1>
          <p class="section-subtitle">
            The platform will feature exactly five distinct games for Sphinx at MNIT Jaipur. 
            Until game concepts, mechanics, and rules are confirmed, the temporary names Game 01 through Game 05 are used.
          </p>
        </div>

        <div class="games-grid">
          ${GAMES_CONFIG.map((game, index) => `
            <article class="game-slot-card" data-slot="${index + 1}" aria-labelledby="card-title-${game.id}">
              <div class="slot-meta-bar">
                <span class="slot-index">SLOT // ${game.slot}</span>
                <span class="status-indicator is-alert">
                  <span class="status-dot" aria-hidden="true"></span>
                  ${escapeHtml(game.status)}
                </span>
              </div>

              <h2 id="card-title-${game.id}" class="slot-title">${escapeHtml(game.name)}</h2>

              <p class="slot-description">
                ${escapeHtml(game.description)}
              </p>

              <ul class="slot-specs-list" aria-label="${escapeHtml(game.name)} properties">
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
                <a href="#/games/${game.id}" class="btn btn-primary">
                  View Game Details
                </a>
                <a href="#/leaderboards/${game.id}" class="btn btn-secondary">
                  Leaderboard
                </a>
              </div>
            </article>
          `).join('')}
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
