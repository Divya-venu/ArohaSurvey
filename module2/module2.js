// ── State ──
const state = {
  q1: null,   // scale 1–5
  q2: null,   // radio  1–3  (mapped to 1–5)
  q3: null,   // scale 1–5
  q4: [],     // checkboxes (count → score)
  q5: null,   // scale 1–5
  q6: false   // textarea filled?
};

// ── Scoring helpers ──

/**
 * Map radio value (1-3) to 1-5 scale so max option → 5
 * 1 → 1, 2 → 3, 3 → 5
 */
function radioToScore(v) {
  return v === 1 ? 1 : v === 2 ? 3 : 5;
}

/**
 * Map checkbox selection count (0–6) to 0–5 scale.
 * Any selection → minimum 1, all 6 → 5.
 */
function checkboxToScore(arr) {
  if (!arr.length) return 0;
  return Math.min(5, Math.round((arr.length / 6) * 5 * 10) / 10);
}

function countAnswered() {
  let n = 0;
  if (state.q1 !== null) n++;
  if (state.q2 !== null) n++;
  if (state.q3 !== null) n++;
  if (state.q4.length > 0) n++;
  if (state.q5 !== null) n++;
  if (state.q6) n++;
  return n;
}

function computeScore() {
  const vals = [];

  if (state.q1 !== null) vals.push(state.q1);
  if (state.q2 !== null) vals.push(radioToScore(state.q2));
  if (state.q3 !== null) vals.push(state.q3);
  if (state.q4.length > 0) vals.push(checkboxToScore(state.q4));
  if (state.q5 !== null) vals.push(state.q5);
  if (state.q6) vals.push(5); // full-text answer counts as 5

  if (!vals.length) return 0;
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round(avg * 10) / 10;
}

// ── UI update ──
function updateUI() {
  const answered = countAnswered();
  const score = computeScore();

  document.getElementById('answered-count').textContent = answered + '/6';
  document.getElementById('progress-fill').style.width = (answered / 6 * 100) + '%';
  document.getElementById('score-display').textContent = score.toFixed(1);
}

// ── Interaction handlers ──

function selectScale(btn) {
  // Deselect siblings in the same scale-row
  btn.closest('.scale-row').querySelectorAll('.scale-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state[btn.dataset.q] = parseInt(btn.dataset.v);
  updateUI();
}

function selectRadio(label, q) {
  document.getElementById(q + '-radio').querySelectorAll('.radio-option').forEach(l => l.classList.remove('selected'));
  label.classList.add('selected');
  label.querySelector('input').checked = true;
  state[q] = parseInt(label.querySelector('input').value);
  updateUI();
}

function toggleCheck(checkbox) {
  const label = checkbox.closest('.check-option');
  if (checkbox.checked) {
    label.classList.add('selected');
  } else {
    label.classList.remove('selected');
  }

  const checked = document.querySelectorAll('#q4-check .check-option input:checked');
  state.q4 = Array.from(checked).map((_, i) => i + 1);
  updateUI();
}

function onTextChange() {
  state.q6 = document.getElementById('q6-text').value.trim().length > 0;
  updateUI();
}

// ── Navigation ──
function goNext() {
  // Navigate to Module 3 (screenshot page)
  window.location.href = 'module3.html';
}

// ── Init ──
updateUI();