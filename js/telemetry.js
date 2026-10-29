/**
 * BLACKOUT: RESTORE THE GRID
 * HUD Telemetry & Diagnostic Monitor
 * Sphinx @ MNIT Jaipur
 */

export const TelemetryMonitor = {
  init() {
    this.bindNetworkStatus();
    this.bindAudioToggle();
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  },

  /**
   * Monitor online / local network state truthfully
   */
  bindNetworkStatus() {
    const statusPill = document.getElementById('network-status-indicator');
    const statusLabel = document.getElementById('network-status-text');
    if (!statusPill || !statusLabel) return;

    const updateStatus = () => {
      if (navigator.onLine) {
        statusPill.className = 'status-indicator is-active';
        statusLabel.textContent = 'LINK: ONLINE';
      } else {
        statusPill.className = 'status-indicator is-alert';
        statusLabel.textContent = 'LINK: STANDALONE';
      }
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
  },

  /**
   * Accessible HUD Audio Toggle (Sound FX Placeholder)
   */
  bindAudioToggle() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (!audioBtn) return;

    let isMuted = true;
    audioBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      audioBtn.setAttribute('aria-pressed', (!isMuted).toString());
      const label = audioBtn.querySelector('.audio-label');
      if (label) {
        label.textContent = isMuted ? 'AUDIO: OFF' : 'AUDIO: STANDBY';
      }
      audioBtn.classList.toggle('is-active', !isMuted);
    });
  },

  /**
   * Real-time tactical clock in UTC / IST
   */
  updateClock() {
    const clockEl = document.getElementById('hud-system-clock');
    if (!clockEl) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}:${seconds} SYS`;
  }
};
