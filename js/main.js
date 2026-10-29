/**
 * BLACKOUT: RESTORE THE GRID
 * Main Application Entry Point & Navigation Controller
 * Sphinx @ MNIT Jaipur
 */

import { initRouter } from './router.js';
import { GAMES_CONFIG } from './games-config.js';

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initGlobalDialog();
  initRouter();
});

/**
 * Mobile Navigation Drawer Toggle
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
}

/**
 * Accessible Modal Controller for [data-inspect-slot]
 */
function initGlobalDialog() {
  const dialog = document.getElementById('slot-inspector-dialog');
  const closeBtn = document.getElementById('dialog-close-btn');
  const dismissBtn = document.getElementById('dialog-dismiss-btn');
  const dialogTitle = document.getElementById('dialog-slot-title');
  const dialogDesc = document.getElementById('dialog-slot-desc');

  if (!dialog) return;

  let lastFocusedElement = null;

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
