/**
 * BLACKOUT: RESTORE THE GRID
 * How to Play View (Page C)
 * Sphinx @ MNIT Jaipur
 */

export function renderHowToPlayView() {
  return `
    <div class="section">
      <div class="container">
        <a href="#/" class="page-nav-back">
          ← Back to Command Center
        </a>

        <div class="page-header-block">
          <span class="section-eyebrow">
            PARTICIPATION PROTOCOL // HOW TO PLAY
          </span>
          <h1 class="section-title">OPERATION PROTOCOL</h1>
          <p class="section-subtitle">
            Review the confirmed engagement flow for participating in Blackout: Restore the Grid 
            during Sphinx at MNIT Jaipur.
          </p>
        </div>

        <div class="protocol-steps" style="margin-bottom: var(--space-10);">
          <article class="protocol-card">
            <span class="protocol-step-num">01</span>
            <h2 class="protocol-title">Register Operator</h2>
            <p class="protocol-desc">
              Submit your identification details: Full Name, College ID, and College Name. 
              These fields identify your score transmissions across all game leaderboards.
            </p>
          </article>

          <article class="protocol-card">
            <span class="protocol-step-num">02</span>
            <h2 class="protocol-title">Select Mission Dock</h2>
            <p class="protocol-desc">
              Choose from any of the five available games (Game 01 through Game 05) in the games directory. 
              Each dock represents an independent technical operation.
            </p>
          </article>

          <article class="protocol-card">
            <span class="protocol-step-num">03</span>
            <h2 class="protocol-title">Engage the Challenge</h2>
            <p class="protocol-desc">
              Play the selected game. Games may eventually feature multiple levels or stages, 
              working toward a single overall game completion score.
            </p>
          </article>

          <article class="protocol-card">
            <span class="protocol-step-num">04</span>
            <h2 class="protocol-title">View Standings</h2>
            <p class="protocol-desc">
              Upon finishing, review your standing on that game's dedicated leaderboard. 
              Each of the five games maintains its own separate ranking.
            </p>
          </article>
        </div>

        <aside class="protocol-disclaimer-box" role="note" style="margin-bottom: var(--space-10);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber" aria-hidden="true" style="flex-shrink: 0;">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <div>
            <strong style="color: var(--text-primary); display: block; margin-bottom: 4px;">
              NOTICE ON GAME-SPECIFIC RULES:
            </strong>
            Detailed game instructions, controls, challenge mechanisms, scoring systems, timers, penalties, 
            and stage rules are currently undecided and will be supplied after each game is finalized by the 
            Sphinx committee. No unconfirmed rules are assumed.
          </div>
        </aside>

        <div style="display: flex; flex-wrap: wrap; gap: var(--space-4);">
          <a href="#/register" class="btn btn-primary">
            Proceed to Registration
          </a>
          <a href="#/games" class="btn btn-secondary">
            Explore Games Directory
          </a>
        </div>
      </div>
    </div>
  `;
}
