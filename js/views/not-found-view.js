/**
 * BLACKOUT: RESTORE THE GRID
 * Not-Found (404) View (Page H)
 * Sphinx @ MNIT Jaipur
 */

export function renderNotFoundView() {
  return `
    <div class="section">
      <div class="container">
        <div class="not-found-card" role="region" aria-label="Error 404 page not found">
          <div class="not-found-code" aria-hidden="true">404</div>
          <h1 class="not-found-title">NODE NOT FOUND</h1>
          <p class="not-found-desc">
            The requested terminal sector, route, or resource does not exist on the Blackout grid.
          </p>
          <a href="#/" class="btn btn-primary">
            Return to Command Center
          </a>
        </div>
      </div>
    </div>
  `;
}
