/**
 * BLACKOUT: RESTORE THE GRID
 * Registration View (Page D)
 * Sphinx @ MNIT Jaipur
 */

import { getApiUrl } from '../config.js';

export function renderRegisterView() {
  return `
    <div class="section">
      <div class="container">
        <a href="#/" class="page-nav-back">
          ← Back to Command Center
        </a>

        <div class="page-header-block" style="text-align: center; max-width: 640px; margin-left: auto; margin-right: auto;">
          <span class="section-eyebrow">
            OPERATOR INTAKE // REGISTRATION
          </span>
          <h1 class="section-title">TERMINAL REGISTRATION</h1>
          <p class="section-subtitle">
            Provide your identification details to participate in Blackout: Restore the Grid.
          </p>
        </div>

        <div class="form-card">
          <form id="registration-form" novalidate aria-label="Participant registration form">
            <!-- Field 1: Full Name -->
            <div class="form-group">
              <label for="reg-fullname" class="form-label">
                <span>Full Name <span class="req-star" aria-hidden="true">*</span></span>
                <span id="fullname-error" class="text-crimson font-mono text-2xs" role="alert"></span>
              </label>
              <input 
                type="text" 
                id="reg-fullname" 
                name="fullname" 
                class="form-input" 
                placeholder="e.g. Alex Sharma" 
                required 
                aria-required="true"
                autocomplete="name"
              >
              <span class="form-hint">Enter your complete legal or student name.</span>
            </div>

            <!-- Field 2: College ID -->
            <div class="form-group">
              <label for="reg-collegeid" class="form-label">
                <span>College ID <span class="req-star" aria-hidden="true">*</span></span>
                <span id="collegeid-error" class="text-crimson font-mono text-2xs" role="alert"></span>
              </label>
              <input 
                type="text" 
                id="reg-collegeid" 
                name="collegeid" 
                class="form-input" 
                placeholder="e.g. 2024UMT1042" 
                required 
                aria-required="true"
                autocomplete="off"
              >
              <span class="form-hint">Your official roll number or institutional student ID.</span>
            </div>

            <!-- Field 3: College Name -->
            <div class="form-group">
              <label for="reg-collegename" class="form-label">
                <span>College Name <span class="req-star" aria-hidden="true">*</span></span>
                <span id="collegename-error" class="text-crimson font-mono text-2xs" role="alert"></span>
              </label>
              <input 
                type="text" 
                id="reg-collegename" 
                name="collegename" 
                class="form-input" 
                placeholder="e.g. MNIT Jaipur" 
                required 
                aria-required="true"
                autocomplete="organization"
              >
              <span class="form-hint">Full name of your institution or university campus.</span>
            </div>

            <!-- Live Intake Policy Notice -->
            <aside class="protocol-disclaimer-box" role="note" style="margin-top: var(--space-6);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber" aria-hidden="true" style="flex-shrink: 0;">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <div>
                <strong>LIVE INTAKE PROTOCOL:</strong> Registration credentials are processed directly by the Blackout API. 
                If your College ID is already registered, your details will be updated atomically without duplicate creation.
              </div>
            </aside>

            <!-- Dynamic Feedback Area -->
            <div id="form-feedback-box" class="form-feedback" role="status" aria-live="polite"></div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" id="btn-submit-registration">
                Register Operator
              </button>
              <button type="button" class="btn btn-secondary" id="btn-reset-registration">
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

export function initRegisterInteractions() {
  const form = document.getElementById('registration-form');
  const feedbackBox = document.getElementById('form-feedback-box');
  const submitBtn = document.getElementById('btn-submit-registration');
  const resetBtn = document.getElementById('btn-reset-registration');

  if (!form) return;

  const fullNameInput = document.getElementById('reg-fullname');
  const collegeIdInput = document.getElementById('reg-collegeid');
  const collegeNameInput = document.getElementById('reg-collegename');

  const fullNameErr = document.getElementById('fullname-error');
  const collegeIdErr = document.getElementById('collegeid-error');
  const collegeNameErr = document.getElementById('collegename-error');

  const clearErrors = () => {
    if (fullNameErr) fullNameErr.textContent = '';
    if (collegeIdErr) collegeIdErr.textContent = '';
    if (collegeNameErr) collegeNameErr.textContent = '';
    if (feedbackBox) {
      feedbackBox.className = 'form-feedback';
      feedbackBox.textContent = '';
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    const fullName = fullNameInput ? fullNameInput.value.trim() : '';
    const collegeId = collegeIdInput ? collegeIdInput.value.trim() : '';
    const collegeName = collegeNameInput ? collegeNameInput.value.trim() : '';

    if (!fullName) {
      if (fullNameErr) fullNameErr.textContent = 'Required field';
      isValid = false;
    }

    if (!collegeId) {
      if (collegeIdErr) collegeIdErr.textContent = 'Required field';
      isValid = false;
    }

    if (!collegeName) {
      if (collegeNameErr) collegeNameErr.textContent = 'Required field';
      isValid = false;
    }

    if (!isValid) {
      if (feedbackBox) {
        feedbackBox.className = 'form-feedback is-visible is-error';
        feedbackBox.textContent = 'Validation Error: Please fill in all three required fields.';
      }
      return;
    }

    // Lock submit button during API transmission
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting Credentials...';
    }

    try {
      const response = await fetch(getApiUrl('/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          collegeId,
          collegeName,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.status === 201 && data && data.operator) {
        // HTTP 201 Created — New Operator Registered
        const op = data.operator;
        if (feedbackBox) {
          feedbackBox.className = 'form-feedback is-visible is-success';
          feedbackBox.innerHTML = `
            <strong>✓ OPERATOR REGISTERED SUCCESSFULLY (HTTP 201)</strong><br>
            Operator: <em>${escapeHtml(op.fullName)}</em> &nbsp;|&nbsp; 
            College ID: <em>${escapeHtml(op.collegeId)}</em> &nbsp;|&nbsp; 
            Institution: <em>${escapeHtml(op.collegeName)}</em><br><br>
            <span style="color: var(--text-secondary);">
              Registration recorded in the central database. System access initialized for Sphinx @ MNIT Jaipur.
            </span>
          `;
        }
      } else if (response.status === 200 && data && data.operator) {
        // HTTP 200 OK — Duplicate College ID Updated
        const op = data.operator;
        if (feedbackBox) {
          feedbackBox.className = 'form-feedback is-visible is-success';
          feedbackBox.innerHTML = `
            <strong>✓ OPERATOR RECORD SYNCHRONIZED (HTTP 200)</strong><br>
            Existing registration for College ID <em>${escapeHtml(op.collegeId)}</em> was updated.<br>
            Operator: <em>${escapeHtml(op.fullName)}</em> &nbsp;|&nbsp; 
            Institution: <em>${escapeHtml(op.collegeName)}</em><br><br>
            <span style="color: var(--text-secondary);">
              In accordance with duplicate registration rules, existing details were updated atomically without duplicate row generation.
            </span>
          `;
        }
      } else if (response.status === 422) {
        // Validation Error from Backend
        const detailMsg = (data && data.detail && Array.isArray(data.detail))
          ? data.detail.map(d => d.msg || 'Invalid input').join(', ')
          : 'Server rejected the submission due to validation failure.';
        if (feedbackBox) {
          feedbackBox.className = 'form-feedback is-visible is-error';
          feedbackBox.textContent = `Server Validation Error (HTTP 422): ${detailMsg}`;
        }
      } else {
        const errorMsg = (data && data.detail) ? data.detail : `Unexpected response status ${response.status}.`;
        if (feedbackBox) {
          feedbackBox.className = 'form-feedback is-visible is-error';
          feedbackBox.textContent = `Registration Failed: ${errorMsg}`;
        }
      }
    } catch (err) {
      if (feedbackBox) {
        feedbackBox.className = 'form-feedback is-visible is-error';
        feedbackBox.innerHTML = `
          <strong>CONNECTION OFFLINE:</strong> Unable to connect to the Blackout API service.<br>
          <span style="color: var(--text-secondary); font-size: 0.85em;">
            Please ensure the backend server is running and accessible at <code>${escapeHtml(getApiUrl('/register'))}</code>.
          </span>
        `;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register Operator';
      }
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      clearErrors();
      if (fullNameInput) fullNameInput.focus();
    });
  }
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
