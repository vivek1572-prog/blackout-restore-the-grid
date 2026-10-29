/**
 * BLACKOUT: RESTORE THE GRID
 * Client-Side Hash Router (Phase 2)
 * Sphinx @ MNIT Jaipur
 */

import { renderLandingView, initLandingInteractions } from './views/landing-view.js';
import { renderGamesDirectoryView } from './views/games-view.js';
import { renderGameDetailView } from './views/game-detail-view.js';
import { renderHowToPlayView } from './views/how-to-play-view.js';
import { renderRegisterView, initRegisterInteractions } from './views/register-view.js';
import { renderLeaderboardsView } from './views/leaderboard-view.js';
import { renderPlayShellView } from './views/play-shell-view.js';
import { renderResultsView } from './views/results-view.js';
import { renderNotFoundView } from './views/not-found-view.js';

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

export function handleRoute() {
  const root = document.getElementById('app-root');
  if (!root) return;

  const rawHash = window.location.hash || '#/';
  // Normalize hash (strip leading '#', trim whitespace)
  const hash = rawHash.replace(/^#\/?/, '').trim();

  // Scroll to top on navigation
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update navigation link highlighting
  updateNavLinks(rawHash);

  // Close mobile drawer if open
  closeMobileDrawer();

  // Match routes
  if (hash === '' || hash === '/' || hash === 'overview' || hash === 'top') {
    root.innerHTML = renderLandingView();
    initLandingInteractions();
    return;
  }

  if (hash === 'games') {
    root.innerHTML = renderGamesDirectoryView();
    return;
  }

  const gameDetailMatch = hash.match(/^games\/([a-zA-Z0-9_-]+)$/);
  if (gameDetailMatch) {
    const gameId = gameDetailMatch[1];
    root.innerHTML = renderGameDetailView(gameId);
    return;
  }

  if (hash === 'how-to-play') {
    root.innerHTML = renderHowToPlayView();
    return;
  }

  if (hash === 'register') {
    root.innerHTML = renderRegisterView();
    initRegisterInteractions();
    return;
  }

  if (hash === 'leaderboards') {
    root.innerHTML = renderLeaderboardsView('game-01');
    return;
  }

  const leaderboardMatch = hash.match(/^leaderboards\/([a-zA-Z0-9_-]+)$/);
  if (leaderboardMatch) {
    const gameId = leaderboardMatch[1];
    root.innerHTML = renderLeaderboardsView(gameId);
    return;
  }

  const playMatch = hash.match(/^play\/([a-zA-Z0-9_-]+)$/);
  if (playMatch) {
    const gameId = playMatch[1];
    root.innerHTML = renderPlayShellView(gameId);
    return;
  }

  const resultsMatch = hash.match(/^results\/([a-zA-Z0-9_-]+)$/);
  if (resultsMatch) {
    const gameId = resultsMatch[1];
    root.innerHTML = renderResultsView(gameId);
    return;
  }

  // Not Found Route
  root.innerHTML = renderNotFoundView();
}

function updateNavLinks(currentHash) {
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    let isActive = false;

    if (currentHash === '#/' || currentHash === '' || currentHash === '#top') {
      isActive = (href === '#/' || href === '#top' || href === '#overview');
    } else if (currentHash.startsWith('#/games')) {
      isActive = (href === '#/games');
    } else if (currentHash.startsWith('#/leaderboards')) {
      isActive = (href === '#/leaderboards');
    } else if (currentHash.startsWith('#/how-to-play')) {
      isActive = (href === '#/how-to-play');
    } else if (currentHash.startsWith('#/register')) {
      isActive = (href === '#/register');
    }

    if (isActive) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

function closeMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (toggleBtn && drawer && drawer.classList.contains('is-open')) {
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('is-open');
  }
}
