/**
 * BLACKOUT: RESTORE THE GRID
 * Cyber-Terminal Sound Effects Engine (Web Audio API)
 * Sphinx @ MNIT Jaipur
 *
 * REQUIREMENTS COMPLIANCE:
 * - OFF by default. Never plays audio on page load.
 * - 100% locally synthesized via native Web Audio API (0KB external audio assets).
 * - Subtle, short micro-clicks (10-14ms) designed strictly for intentional clicks.
 * - No audio on mouse movement, hovering, keystrokes, or scrolling.
 * - Graceful fallback if Web Audio is unsupported or restricted by browser policies.
 */

const STORAGE_KEY = 'blackout_audio_enabled';

let audioCtx = null;
let isAudioEnabled = false;

/**
 * Initialize the terminal audio engine and footer toggle control
 */
export function initTerminalAudio() {
  const toggleBtn = document.getElementById('terminal-audio-toggle');
  if (!toggleBtn) return;

  // Read saved preference from localStorage, default strictly to OFF (false)
  const savedPref = localStorage.getItem(STORAGE_KEY);
  isAudioEnabled = savedPref === 'true';

  updateToggleUI(toggleBtn, isAudioEnabled);

  toggleBtn.addEventListener('click', () => {
    isAudioEnabled = !isAudioEnabled;
    localStorage.setItem(STORAGE_KEY, isAudioEnabled ? 'true' : 'false');
    updateToggleUI(toggleBtn, isAudioEnabled);

    if (isAudioEnabled) {
      // Initialize or resume AudioContext on explicit user gesture
      ensureAudioContext();
      // Play a subtle confirmation click
      playTerminalClick(980, 0.06, 0.012);
    }
  });

  // Attach global click listener for intentional interactive elements
  bindInteractiveSoundTriggers();
}

/**
 * Update the button text, aria-pressed state, and styling
 */
function updateToggleUI(button, enabled) {
  button.setAttribute('aria-pressed', enabled.toString());
  button.textContent = enabled ? 'TERMINAL AUDIO: [ ENABLED ]' : 'TERMINAL AUDIO: [ OFF ]';
  button.classList.toggle('text-cyan', enabled);
  button.classList.toggle('text-tertiary', !enabled);
}

/**
 * Lazily initialize AudioContext on user interaction
 */
function ensureAudioContext() {
  if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
}

/**
 * Synthesize a gentle, non-intrusive cyber-terminal micro-click
 * Frequency: starting frequency in Hz
 * PeakGain: subtle volume level (0.04 - 0.08)
 * Duration: length in seconds (0.01 - 0.014s)
 */
function playTerminalClick(freq = 880, peakGain = 0.05, duration = 0.012) {
  if (!isAudioEnabled) return;

  try {
    ensureAudioContext();
    if (!audioCtx || audioCtx.state !== 'running') return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const now = audioCtx.currentTime;

    // Pitch envelope: fast downward chirp for a crisp tactile micro-click
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + duration);

    // Gain envelope: instant attack, exponential decay to prevent clicks/pops
    gain.gain.setValueAtTime(peakGain, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch (err) {
    // Graceful silent fallback if audio fails
  }
}

/**
 * Public trigger to play sound from specific high-priority UI events
 */
export function triggerTerminalSound() {
  if (!isAudioEnabled) return;
  playTerminalClick(880, 0.05, 0.012);
}

/**
 * Attach click handlers strictly to intentional navigation and button clicks
 * Excludes inputs, typing, mousemove, and the toggle button itself
 */
function bindInteractiveSoundTriggers() {
  document.addEventListener('click', (e) => {
    if (!isAudioEnabled) return;

    // Identify if the clicked element is an interactive link or button
    const target = e.target.closest('a[href], button:not(#terminal-audio-toggle)');
    if (!target) return;

    // Play subtle click
    playTerminalClick(840, 0.05, 0.012);
  }, { passive: true });
}
