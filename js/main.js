/**
 * BLACKOUT: RESTORE THE GRID
 * Main Application Logic & Accessible Navigation
 * Sphinx @ MNIT Jaipur
 */

import { TelemetryMonitor } from './telemetry.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize HUD telemetry
  TelemetryMonitor.init();

  // Initialize navigation & interactions
  initMobileNavigation();
  initSmoothScrollAndActiveNav();
  initLeaderboardTabs();
  initSlotInspectorModal();
  initSchematicInteractivity();
});

/**
 * 1. Mobile Drawer Navigation
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

  // Close drawer when clicking any link inside it
  drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('is-open');
    });
  });
}

/**
 * 2. Active Section Spy via IntersectionObserver
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
 * 3. Leaderboard Tabs (WCAG 2.2 Accessible Tablist)
 */
function initLeaderboardTabs() {
  const tablist = document.querySelector('[role="tablist"]');
  if (!tablist) return;

  const tabs = tablist.querySelectorAll('[role="tab"]');
  const channelTitle = document.getElementById('lb-channel-title');
  const channelSubstation = document.getElementById('lb-channel-substation');

  const substationNames = [
    'Substation Alpha (High-Voltage Core)',
    'Substation Beta (Frequency Stabilizer)',
    'Substation Gamma (Transformer Array)',
    'Substation Delta (Cyber Telemetry Relay)',
    'Substation Epsilon (Distribution Matrix)'
  ];

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      activateTab(tab, index);
    });

    // Keyboard navigation (Left, Right, Home, End)
    tab.addEventListener('keydown', (e) => {
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
      activateTab(tabs[nextIndex], nextIndex);
    });
  });

  function activateTab(activeTab, idx) {
    tabs.forEach(t => {
      t.setAttribute('aria-selected', 'false');
      t.classList.remove('is-active');
      t.setAttribute('tabindex', '-1');
    });

    activeTab.setAttribute('aria-selected', 'true');
    activeTab.classList.add('is-active');
    activeTab.setAttribute('tabindex', '0');

    const slotNum = idx + 1;
    if (channelTitle) {
      channelTitle.textContent = `CHANNEL 0${slotNum} // GAME 0${slotNum} TELEMETRY`;
    }
    if (channelSubstation) {
      channelSubstation.textContent = substationNames[idx] || `Substation 0${slotNum}`;
    }
  }
}

/**
 * 4. Game Slot Inspector Modal
 */
function initSlotInspectorModal() {
  const dialog = document.getElementById('slot-inspector-dialog');
  const closeBtn = document.getElementById('dialog-close-btn');
  const modalDismissBtn = document.getElementById('dialog-dismiss-btn');
  const inspectButtons = document.querySelectorAll('[data-inspect-slot]');
  const dialogTitle = document.getElementById('dialog-slot-title');
  const dialogSubstation = document.getElementById('dialog-substation-name');

  if (!dialog) return;

  let lastFocusedElement = null;

  inspectButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      lastFocusedElement = btn;
      const slotId = btn.getAttribute('data-inspect-slot');
      const slotName = btn.getAttribute('data-slot-name') || `Game ${slotId}`;
      const substationName = btn.getAttribute('data-substation') || `Substation ${slotId}`;

      if (dialogTitle) dialogTitle.textContent = `DOCK INSPECTION: ${slotName.toUpperCase()}`;
      if (dialogSubstation) dialogSubstation.textContent = substationName;

      dialog.showModal();
    });
  });

  const closeModal = () => {
    dialog.close();
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);

  // Close when clicking dialog backdrop
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
 * 5. Interactive SVG Circuit Nodes
 */
function initSchematicInteractivity() {
  const nodes = document.querySelectorAll('.grid-node-substation');
  const readout = document.getElementById('schematic-active-node-readout');

  nodes.forEach(node => {
    const slot = node.getAttribute('data-slot-target');
    const label = node.getAttribute('data-node-label');

    node.addEventListener('mouseenter', () => {
      if (readout) {
        readout.textContent = `HOVERING: ${label} [OFFLINE]`;
        readout.classList.add('text-amber');
      }
    });

    node.addEventListener('mouseleave', () => {
      if (readout) {
        readout.textContent = 'SYSTEM DIAGNOSTIC: 05 NODES DESYNCHRONIZED';
        readout.classList.remove('text-amber');
      }
    });

    node.addEventListener('click', () => {
      const targetCard = document.querySelector(`.game-slot-card[data-slot="${slot}"]`);
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
