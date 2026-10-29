/**
 * BLACKOUT: RESTORE THE GRID
 * Reusable Game Details View (Page B)
 * Sphinx @ MNIT Jaipur
 */

import { getGameById } from '../games-config.js';

export function renderGameDetailView(gameId) {
  const game = getGameById(gameId);

  if (!game) {
    return `
      <div class="section">
        <div class="container">
          <a href="#/games" class="page-nav-back">← Back to Games Directory</a>
          <div class="not-found-card">
            <h1 class="not-found-title">Game Not Found</h1>
            <p class="not-found-desc">The requested game identifier [${escapeHtml(gameId)}] is not recognized in the system.</p>
            <a href="#/games" class="btn btn-primary">Return to Games Directory</a>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="section">
      <div class="container">
        <a href="#/games" class="page-nav-back">
          ← Back to Games Directory
        </a>

        <article class="game-detail-card" aria-labelledby="detail-title">
          <div class="game-detail-header">
            <div>
              <span class="section-eyebrow">MISSION DOCK // SLOT ${game.slot}</span>
              <h1 id="detail-title" class="game-detail-title">${escapeHtml(game.name)}</h1>
            </div>
            <span class="status-indicator is-alert">
              <span class="status-dot" aria-hidden="true"></span>
              ${escapeHtml(game.status)}
            </span>
          </div>

          <div class="detail-specs-grid">
            <div class="detail-spec-box">
              <div class="detail-spec-label">Leaderboard Protocol</div>
              <div class="detail-spec-val text-cyan">${escapeHtml(game.leaderboardInfo)}</div>
            </div>
            <div class="detail-spec-box">
              <div class="detail-spec-label">Level / Stage Structure</div>
              <div class="detail-spec-val">${escapeHtml(game.structureInfo)}</div>
            </div>
            <div class="detail-spec-box">
              <div class="detail-spec-label">Technical Status</div>
              <div class="detail-spec-val text-amber">Specification In Progress</div>
            </div>
          </div>

          <div style="margin-bottom: var(--space-8);">
            <h2 class="font-mono text-sm text-cyan" style="margin-bottom: var(--space-2); text-transform: uppercase;">
              Briefing &amp; Concept
            </h2>
            <p class="text-secondary" style="line-height: 1.7; font-size: var(--text-base);">
              ${escapeHtml(game.description)}
            </p>
          </div>

          <div style="margin-bottom: var(--space-8);">
            <h2 class="font-mono text-sm text-cyan" style="margin-bottom: var(--space-2); text-transform: uppercase;">
              Instructions &amp; Controls
            </h2>
            <p class="text-secondary" style="line-height: 1.7; font-size: var(--text-sm);">
              Placeholder — Specific gameplay mechanics, controls, rules, and scoring conditions 
              have not yet been confirmed. Full instructions will be provided when game specifications are finalized.
            </p>
          </div>

          <aside class="protocol-disclaimer-box" role="note" style="margin-bottom: var(--space-8);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber" aria-hidden="true" style="flex-shrink: 0;">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div>
              <strong>NON-FUNCTIONAL GAMEPLAY NOTICE:</strong> Gameplay mechanics are not implemented in this phase. 
              The launch button below opens a non-functional gameplay layout shell to establish future navigation.
            </div>
          </aside>

          <div class="detail-actions">
            <a href="#/play/${game.id}" class="btn btn-primary">
              Launch Game Shell (Placeholder)
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </a>

            <a href="#/leaderboards/${game.id}" class="btn btn-secondary">
              View Game Leaderboard
            </a>

            <a href="#/games" class="btn btn-ghost">
              Back to Directory
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
