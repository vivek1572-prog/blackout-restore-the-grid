/**
 * BLACKOUT: RESTORE THE GRID
 * Main Frontend Logic & Dynamic Card Rendering
 * Sphinx @ MNIT Jaipur
 */

import { GAMES_CONFIG } from './games-config.js';

document.addEventListener('DOMContentLoaded', () => {
  renderGameCards();
  renderLeaderboardTabs();
  initMobileNavigation();
  initSmoothScrollAndActiveNav();
  initSlotInspectorModal();
  initSchematicInteractivity();
});

/**
 * 1. Centralized Game Card Rendering
 * Renders exactly five game cards dynamically from GAMES_CONFIG.
 */
function renderGameCards() {
  const container = document.getElementById('games-container');
  if (!container) return;

  container.innerHTML = '';

  GAMES_CONFIG.forEach((game, index) => {
    const card = document.createElement('article');
    card.className = 'game-slot-card';
    card.setAttribute('data-slot', (index + 1).toString());
    card.setAttribute('aria-labelledby', `slot-title-${game.id}`);

    card.innerHTML = `
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
        <button class="btn btn-secondary" type="button" data-inspect-slot="${game.id}">
          Inspect Slot
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * 2. Centralized Leaderboard Channel Tabs
 * Renders the 5 game channel tabs from GAMES_CONFIG.
 */
function renderLeaderboardTabs() {
  const tablist = document.getElementById('leaderboard-tablist');
  const panelTitle = document.getElementById('lb-channel-title');
  const panelDesc = document.getElementById('lb-channel-desc');
  if (!tablist) return;

  tablist.innerHTML = '';

  GAMES_CONFIG.forEach((game, index) => {
    const btn = document.createElement('button');
    btn.className = `lb-tab-btn ${index === 0 ? 'is-active' : ''}`;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('id', `tab-${game.id}`);
    btn.setAttribute('aria-controls', 'panel-game');
    btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    btn.setAttribute('tabindex', index === 0 ? '0' : '-1');
    btn.textContent = `CHANNEL ${game.slot} // ${game.name.toUpperCase()}`;

    btn.addEventListener('click', () => {
      activateLeaderboardTab(btn, game);
    });

    btn.addEventListener('keydown', (e) => {
      const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
      let nextIndex = index;

      if (e.key === 'ArrowRight') {
        nextIndex = (index + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = tabs.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      tabs[nextIndex].focus();
      activateLeaderboardTab(tabs[nextIndex], GAMES_CONFIG[nextIndex]);
    });

    tablist.appendChild(btn);
  });

  function activateLeaderboardTab(activeBtn, game) {
    const allTabs = tablist.querySelectorAll('[role="tab"]');
    allTabs.forEach(t => {
      t.setAttribute('aria-selected', 'false');
      t.classList.remove('is-active');
      t.setAttribute('tabindex', '-1');
    });

    activeBtn.setAttribute('aria-selected', 'true');
    activeBtn.classList.add('is-active');
    activeBtn.setAttribute('tabindex', '0');

    const panel = document.getElementById('panel-game');
    if (panel) {
      panel.setAttribute('aria-labelledby', activeBtn.id);
    }

    if (panelTitle) {
      panelTitle.textContent = `CHANNEL ${game.slot} // ${game.name.toUpperCase()} LEADERBOARD`;
    }
    if (panelDesc) {
      panelDesc.textContent = `Dedicated ranking channel for ${game.name}. A single unified leaderboard tracks this game across all stages.`;
    }
  }
}

/**
 * 3. Mobile Navigation Drawer
 */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', (!isExpanded).toString());
    drawer.classList.toggle('is-open', !isExpanded);
  });

  drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('is-open');
    });
  });
}

/**
 * 4. Active Navigation via IntersectionObserver
 */
function initSmoothScrollAndActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/**
 * 5. Accessible Slot Inspector Modal
 */
function initSlotInspectorModal() {
  const dialog = document.getElementById('slot-inspector-dialog');
  const closeBtn = document.getElementById('dialog-close-btn');
  const dismissBtn = document.getElementById('dialog-dismiss-btn');
  const dialogTitle = document.getElementById('dialog-slot-title');
  const dialogDesc = document.getElementById('dialog-slot-desc');

  if (!dialog) return;

  let lastFocusedElement = null;

  // Use event delegation for dynamically rendered cards
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-inspect-slot]');
    if (!trigger) return;

    lastFocusedElement = trigger;
    const gameId = trigger.getAttribute('data-inspect-slot');
    const game = GAMES_CONFIG.find(g => g.id === gameId);

    if (game) {
      if (dialogTitle) dialogTitle.textContent = `SLOT INSPECTION: ${game.name.toUpperCase()}`;
      if (dialogDesc) {
        dialogDesc.textContent = `${game.name} specifications, mechanics, scoring systems, and stage designs are unconfirmed and currently under development for Sphinx at MNIT Jaipur.`;
      }
      dialog.showModal();
    }
  });

  const closeModal = () => {
    dialog.close();
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      closeModal();
    }
  });
}

/**
 * 6. Interactive Power Grid SVG Schematic
 */
function initSchematicInteractivity() {
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
