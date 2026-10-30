/**
 * BLACKOUT: RESTORE THE GRID
 * Client API & Environment Configuration (Phase 3B.4)
 * Sphinx @ MNIT Jaipur
 *
 * This module provides centralized API endpoint resolution.
 * In development, defaults to the local FastAPI backend (http://localhost:8000/api/v1).
 * In production, the backend URL can be configured via window.__BLACKOUT_API_URL__.
 */

function resolveBaseUrl() {
  if (typeof window !== 'undefined' && window.__BLACKOUT_API_URL__) {
    return window.__BLACKOUT_API_URL__;
  }
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000/api/v1';
    }
  }
  // Production default pointing to live Render backend
  return 'https://blackout-api-0ibm.onrender.com/api/v1';
}

export const API_CONFIG = {
  baseUrl: resolveBaseUrl(),
  timeoutMs: 15000,
};

/**
 * Construct full API URL for a relative endpoint path.
 * @param {string} path - Endpoint path (e.g. '/register' or 'games/game-01/leaderboard')
 * @returns {string} Fully qualified URL
 */
export function getApiUrl(path) {
  const base = API_CONFIG.baseUrl.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${base}/${cleanPath}`;
}

/**
 * Probe live backend health.
 * @returns {Promise<{ ok: boolean, status: string, database?: string }>}
 */
export async function checkApiHealth() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs);
    const res = await fetch(getApiUrl('/health'), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      return { ok: false, status: 'degraded' };
    }
    const data = await res.json();
    return { ok: true, status: data.status, database: data.database };
  } catch (err) {
    return { ok: false, status: 'offline' };
  }
}
