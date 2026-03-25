/* ═══════════════════════════════════════════
   module1.js  –  Aroha AI Maturity Assessment
   Module 1: Strategy & Business Alignment
   ═══════════════════════════════════════════ */

/* ─────────────────────────────────────────
   STATE
   ───────────────────────────────────────── */
const state = {
  q1: null,   // scale 1–5
  q2: null,   // radio 1–4 (mapped to 1–5)
  q3: null,   // scale 1–5
  q4: [],     // checkboxes → count → score
  q5: null,   // scale 1–5
  q6: false   // textarea filled?
};


/* ─────────────────────────────────────────
   SCORING HELPERS
   ───────────────────────────────────────── */

/**
 * Map radio value (1–4) → 1–5 scale
 * 1→1, 2→2.3, 3→3.7, 4→5
 */
function radioToScore(v) {
  const map = { 1: 1, 2: 2.3, 3: 3.7, 4: 5 };
  return map[v] ?? 1;
}

/**
 * Map checkbox count (0–6) → 0–5 scale
 */
function checkboxToScore(arr) {
  if (!arr.length) return 0;
  return Math.min(5, Math.round((arr.length / 6) * 5 * 10) / 10);
}

function countAnswered() {
  let n = 0;
  if (state.q1 !== null)    n++;
  if (state.q2 !== null)    n++;
  if (state.q3 !== null)    n++;
  if (state.q4.length > 0)  n++;
  if (state.q5 !== null)    n++;
  if (state.q6)             n++;
  return n;
}

function computeScore() {
  const vals = [];

  if (state.q1 !== null)   vals.push(state.q1);
  if (state.q2 !== null)   vals.push(radioToScore(state.q2));
  if (state.q3 !== null)   vals.push(state.q3);
  if (state.q4.length > 0) vals.push(checkboxToScore(state.q4));
  if (state.q5 !== null)   vals.push(state.q5);
  if (state.q6)            vals.push(5);

  if (!vals.length) return 0;
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round(avg * 10) / 10;
}


/* ─────────────────────────────────────────
   UI UPDATE
   ───────────────────────────────────────── */
function updateUI() {
  const answered = countAnswered();
  const score    = computeScore();

  document.getElementById('answered-count').textContent    = `${answered}/6`;
  document.getElementById('progress-fill').style.width     = `${(answered / 6) * 100}%`;
  document.getElementById('score-display').textContent     = score.toFixed(1);
}


/* ─────────────────────────────────────────
   INTERACTION HANDLERS
   ───────────────────────────────────────── */

/**
 * Scale button click
 */
function selectScale(btn) {
  // Deselect all siblings in the same .scale-row
  btn.closest('.scale-row').querySelectorAll('.scale-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state[btn.dataset.q] = parseInt(btn.dataset.v);
  updateUI();
}

/**
 * Radio option click
 */
function selectRadio(label, q) {
  document.getElementById(`${q}-radio`).querySelectorAll('.radio-option').forEach(l => l.classList.remove('selected'));
  label.classList.add('selected');
  label.querySelector('input').checked = true;
  state[q] = parseInt(label.querySelector('input').value);
  updateUI();
}

/**
 * Checkbox toggle
 */
function toggleCheck(checkbox) {
  const label = checkbox.closest('.check-option');
  checkbox.checked ? label.classList.add('selected') : label.classList.remove('selected');

  const checked = document.querySelectorAll('#q4-check .check-option input:checked');
  state.q4 = Array.from(checked).map((_, i) => i + 1);
  updateUI();
}

/**
 * Textarea change
 */
function onTextChange() {
  state.q6 = document.getElementById('q6-text').value.trim().length > 0;
  updateUI();
}


/* ─────────────────────────────────────────
   REGISTRATION MODAL
   ───────────────────────────────────────── */

function submitRegistration() {
  const name    = document.getElementById('reg-name').value.trim();
  const company = document.getElementById('reg-company').value.trim();
  const email   = document.getElementById('reg-email').value.trim();
  const phone   = document.getElementById('reg-phone').value.trim();

  let valid = true;

  // Validate name
  if (!name) {
    document.getElementById('reg-name').classList.add('error');
    document.getElementById('err-name').classList.add('show');
    valid = false;
  } else {
    document.getElementById('reg-name').classList.remove('error');
    document.getElementById('err-name').classList.remove('show');
  }

  // Validate company
  if (!company) {
    document.getElementById('reg-company').classList.add('error');
    document.getElementById('err-company').classList.add('show');
    valid = false;
  } else {
    document.getElementById('reg-company').classList.remove('error');
    document.getElementById('err-company').classList.remove('show');
  }

  // Validate email
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    document.getElementById('reg-email').classList.add('error');
    document.getElementById('err-email').classList.add('show');
    valid = false;
  } else {
    document.getElementById('reg-email').classList.remove('error');
    document.getElementById('err-email').classList.remove('show');
  }

  // Validate phone
  if (!phone) {
    document.getElementById('reg-phone').classList.add('error');
    document.getElementById('err-phone').classList.add('show');
    valid = false;
  } else {
    document.getElementById('reg-phone').classList.remove('error');
    document.getElementById('err-phone').classList.remove('show');
  }

  if (!valid) return;

  // Persist user details across all modules
  sessionStorage.setItem('userName',    name);
  sessionStorage.setItem('userCompany', company);
  sessionStorage.setItem('userEmail',   email);
  sessionStorage.setItem('userPhone',   phone);

  // Close modal
  document.getElementById('reg-modal').classList.add('hidden');

  // Show user info in score card
  document.getElementById('user-name-display').textContent    = name;
  document.getElementById('user-company-display').textContent = company;
  document.getElementById('user-info-card').classList.remove('hidden');
}


/* ─────────────────────────────────────────
   NAVIGATION
   ───────────────────────────────────────── */

function goNext() {
  // Save this module's score before leaving
  sessionStorage.setItem('module1Score', computeScore());
  window.location.href = '../module2/module2.html';
}


/* ─────────────────────────────────────────
   EVENT LISTENERS
   ───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // Scale buttons
  document.querySelectorAll('.scale-btn').forEach(btn => {
    btn.addEventListener('click', () => selectScale(btn));
  });

  // Radio options
  document.querySelectorAll('.radio-option').forEach(label => {
    label.addEventListener('click', () => {
      const q = label.closest('.radio-group').id.replace('-radio', '');
      selectRadio(label, q);
    });
  });

  // Checkboxes
  document.querySelectorAll('#q4-check .check-option input').forEach(cb => {
    cb.addEventListener('change', () => toggleCheck(cb));
  });

  // Textarea
  document.getElementById('q6-text').addEventListener('input', onTextChange);

  // Next button
  document.getElementById('btn-next').addEventListener('click', goNext);

  // Registration start button
  document.getElementById('btn-start-assessment').addEventListener('click', submitRegistration);

  // Allow Enter key in registration fields
  document.querySelectorAll('.reg-input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') submitRegistration();
    });
  });

  // Init UI
  updateUI();
});