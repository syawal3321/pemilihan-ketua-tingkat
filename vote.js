import { CONFIG } from './config.js';

const resultEl = document.getElementById('result');
let votes = {};
let candidates = [];

function load() {
  try {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (saved) votes = JSON.parse(saved);
  } catch (_) { votes = {}; }
}

function save() {
  try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(votes)); } catch (_) {}
}

function cast(id) {
  votes[id] = (votes[id] || 0) + 1;
  save();
  renderResult();
  flash(id);
}

function init(cand) {
  candidates = cand;
  load();
  candidates.forEach(c => { if (votes[c.id] === undefined) votes[c.id] = 0; });
  renderResult();
}

function flash(id) {
  const sel = document.querySelectorAll('.vote-btn:not(.evasive)');
  for (const btn of sel) {
    if (parseInt(btn.dataset.id) === id) {
      btn.textContent = '✓ Terpilih!';
      btn.style.background = '#38a169';
      if (btn._flashTimer) clearTimeout(btn._flashTimer);
      btn._flashTimer = setTimeout(() => {
        btn.textContent = 'Pilih';
        btn.style.background = '';
        btn._flashTimer = null;
      }, CONFIG.UI.FLASH_DURATION);
      break;
    }
  }
}

function renderResult() {
  let total = 0, maxVotes = 0, winners = [];
  candidates.forEach(c => {
    const count = votes[c.id] || 0;
    total += count;
    if (count > maxVotes) { maxVotes = count; winners = [c.id]; }
    else if (count === maxVotes && count > 0) { winners.push(c.id); }
  });

  if (total === 0) {
    resultEl.textContent = 'Belum ada suara masuk. Silakan pilih kandidat (kecuali diri sendiri).';
    resultEl.style.color = '#4a5568';
    return;
  }

  const names = winners.map(id => {
    const c = candidates.find(c => c.id === id);
    return c ? c.name : '?';
  });
  const leader = names.length > 1
    ? 'Seri antara ' + names.join(' dan ')
    : 'Pemimpin: ' + names[0];

  // Use DOM nodes instead of innerHTML
  resultEl.textContent = '';
  const strong = document.createElement('strong');
  strong.textContent = '📊 Hasil sementara: ';
  resultEl.appendChild(strong);
  resultEl.appendChild(document.createTextNode(
    'Total suara: ' + total + ' | ' + leader + ' (' + maxVotes + ' suara)'
  ));
  resultEl.style.color = '#2d3748';
}

export { init, cast, renderResult };
