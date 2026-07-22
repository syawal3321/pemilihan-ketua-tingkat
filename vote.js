import { CONFIG } from './config.js';

const tableBody = document.getElementById('resultTableBody');
const totalSuaraEl = document.getElementById('totalSuara');

let votes = {};
let candidates = [];
let hasVoted = false;

function load() {
  try {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (saved) votes = JSON.parse(saved);
    hasVoted = localStorage.getItem(CONFIG.STORAGE_KEY + '_voted') === 'true';
  } catch (_) {
    votes = {};
    hasVoted = false;
  }
}

function save() {
  try {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(votes));
    localStorage.setItem(CONFIG.STORAGE_KEY + '_voted', hasVoted ? 'true' : 'false');
  } catch (_) {}
}

function reset() {
  votes = {};
  candidates.forEach(c => { votes[c.id] = 0; });
  hasVoted = false;
  save();
  renderResult();
  enableAllButtons();
}

function cast(id) {
  if (hasVoted) return;
  votes[id] = (votes[id] || 0) + 1;
  hasVoted = true;
  save();
  renderResult();
  disableAllButtons(id);
}

function init(cand) {
  candidates = cand;
  load();
  candidates.forEach(c => {
    if (votes[c.id] === undefined) votes[c.id] = 0;
  });
  renderResult();
  if (hasVoted) disableAllButtons();
}

function disableAllButtons(selectedId) {
  const sel = document.querySelectorAll('.vote-btn:not(.evasive)');
  for (const btn of sel) {
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.style.cursor = 'not-allowed';
    if (selectedId && parseInt(btn.dataset.id) === selectedId) {
      btn.textContent = '✓ Terpilih!';
      btn.style.background = '#38a169';
    } else {
      btn.textContent = 'Sudah Memilih';
      btn.style.background = '';
    }
  }
}

function enableAllButtons() {
  const sel = document.querySelectorAll('.vote-btn:not(.evasive)');
  for (const btn of sel) {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
    btn.textContent = 'Pilih';
    btn.style.background = '';
  }
}

function renderResult() {
  let total = 0;
  let maxVotes = 0;

  candidates.forEach(c => {
    const count = votes[c.id] || 0;
    total += count;
    if (count > maxVotes) {
      maxVotes = count;
    }
  });

  tableBody.textContent = '';

  candidates.forEach((c, idx) => {
    const isYou = c.name === CONFIG.YOUR_NAME;
    const count = votes[c.id] || 0;
    const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';

    const tr = document.createElement('tr');
    
    // Highlight leader row if votes exist
    const isLeader = total > 0 && count === maxVotes;
    if (isLeader) {
      tr.className = 'leader-row';
    }

    // Col 1: No
    const tdNo = document.createElement('td');
    tdNo.textContent = String(idx + 1);
    tr.appendChild(tdNo);

    // Col 2: Kandidat
    const tdName = document.createElement('td');
    tdName.textContent = c.name;
    if (isLeader) {
      const badge = document.createElement('span');
      badge.className = 'leader-badge';
      badge.textContent = ' 🏆';
      tdName.appendChild(badge);
    }
    tr.appendChild(tdName);

    // Col 3: Suara
    const tdVotes = document.createElement('td');
    tdVotes.className = 'text-right';
    tdVotes.textContent = isYou ? '—' : String(count);
    tr.appendChild(tdVotes);

    // Col 4: Persentase (with micro progress bar under)
    const tdPct = document.createElement('td');
    tdPct.className = 'text-right';
    
    if (isYou) {
      tdPct.textContent = '—';
    } else {
      const textSpan = document.createElement('span');
      textSpan.textContent = pct + '%';
      tdPct.appendChild(textSpan);

      const progCont = document.createElement('div');
      progCont.className = 'progress-container';
      
      const progBar = document.createElement('div');
      progBar.className = 'progress-bar';
      progBar.style.width = pct + '%';
      
      progCont.appendChild(progBar);
      tdPct.appendChild(progCont);
    }
    
    tr.appendChild(tdPct);
    tableBody.appendChild(tr);
  });

  totalSuaraEl.textContent = 'Total suara masuk: ' + total;
}

export function getHasVoted() {
  return hasVoted;
}

export { init, cast, reset, renderResult };
