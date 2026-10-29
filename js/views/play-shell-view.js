/**
 * BLACKOUT: RESTORE THE GRID
 * Reusable Gameplay Shell View (Page F)
 * Sphinx @ MNIT Jaipur
 */

import { getGameById, GAMES_CONFIG } from '../games-config.js';

export function renderPlayShellView(gameId) {
  const game = getGameById(gameId) || GAMES_CONFIG[0];

  return `
    <div class="section">
      <div class="container">
        <a href="#/games/${game.id}" class="page-nav-back">
          ← Back to ${escapeHtml(game.name)} Details
        </a>

        <div class="page-header-block" style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: var(--space-4);">
          <div>
            <span class="section-eyebrow">
              NON-FUNCTIONAL GAMEPLAY SHELL // ${game.name.toUpperCase()}
            </span>
            <h1 class="section-title">${escapeHtml(game.name)}</h1>
          </div>
          <span class="status-indicator is-alert">
            <span class="status-dot" aria-hidden="true"></span>
            SHELL PLACEHOLDER
          </span>
        </div>

        <!-- Gameplay Viewport Placeholder -->
        <div class="gameplay-viewport-container" role="region" aria-label="Non-functional game viewport placeholder">
          <div class="gameplay-viewport-overlay" aria-hidden="true"></div>

          <div class="viewport-placeholder-content">
            <div class="viewport-icon" aria-hidden="true">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                <path d="M6 12h4"></path>
                <path d="M8 10v4"></path>
                <circle cx="17" cy="10" r="0.5" fill="currentColor"></circle>
                <circle cx="15" cy="13" r="0.5" fill="currentColor"></circle>
              </svg>
            </div>

            <h2 class="viewport-title">GAMEPLAY CONTAINER // ACTIVE PLACEHOLDER</h2>

            <p class="viewport-desc">
              This layout container establishes the navigation framework for <strong>${escapeHtml(game.name)}</strong>. 
              In strict accordance with Phase 2 requirements, no gameplay mechanics, controls, timers, levels, 
              hints, or scoring algorithms have been invented or implemented.
            </p>

            <aside class="protocol-disclaimer-box" role="note" style="text-align: left; margin-bottom: var(--space-6);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber" aria-hidden="true" style="flex-shrink: 0;">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <div>
                <strong>STATUS:</strong> Game mechanics will be implemented in a future phase once specifications are confirmed. 
                No controls are simulated.
              </div>
            </aside>

            <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: var(--space-4);">
              <a href="#/games/${game.id}" class="btn btn-secondary">
                Return to Game Details
              </a>
              <a href="#/results/${game.id}" class="btn btn-primary">
                Preview Results Screen Layout →
              </a>
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
