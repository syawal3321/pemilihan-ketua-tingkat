import { CONFIG } from './config.js';
import * as Vote from './vote.js';
import * as EscapeButton from './escapeButton.js';

const container = document.getElementById('candidateContainer');
document.getElementById('yourNameDisplay').textContent = CONFIG.YOUR_NAME;

const overlay = document.getElementById('confirmModal');
const msgEl = document.getElementById('modalMessage');
const yesBtn = document.getElementById('modalYes');
const noBtn = document.getElementById('modalNo');

let pendingId = null;
let active = false;
let previousFocus = null;

function trapFocus(e) {
  if (e.key === 'Tab') {
    const focusable = overlay.querySelectorAll('button');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  if (e.key === 'Escape') hide();
}

function initModal(onConfirm) {
  yesBtn.addEventListener('click', () => {
    if (pendingId !== null) onConfirm(pendingId);
    hide();
  });
  noBtn.addEventListener('click', hide);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) hide(); });
}

function show(message, voteId) {
  if (active) return;
  active = true;
  pendingId = voteId;
  msgEl.textContent = message;
  overlay.classList.add('active');
  previousFocus = document.activeElement;
  yesBtn.focus();
  document.addEventListener('keydown', trapFocus);
}

function hide() {
  if (!active) return;
  active = false;
  pendingId = null;
  overlay.classList.remove('active');
  document.removeEventListener('keydown', trapFocus);
  if (previousFocus && previousFocus.focus) previousFocus.focus();
}

function getModalActive() { return active; }

Vote.init(CONFIG.CANDIDATES);
initModal((id) => Vote.cast(id));

function render() {
  container.innerHTML = '';
  CONFIG.CANDIDATES.forEach(c => {
    const isYou = c.name === CONFIG.YOUR_NAME;

    const div = document.createElement('div');
    div.className = 'candidate' + (isYou ? ' you' : '');

    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.textContent = c.name;

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = isYou ? '🚫 tidak bisa dipilih' : '✔️ tersedia';

    const btn = document.createElement('button');
    btn.className = 'vote-btn' + (isYou ? ' evasive' : '');
    btn.type = 'button';
    btn.dataset.id = c.id;
    btn.setAttribute('aria-label', isYou ? 'Tombol pilih untuk diri sendiri, akan menghindar' : 'Pilih kandidat ' + c.name);
    btn.textContent = isYou ? '❌ Hindar' : 'Pilih';
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });

    if (isYou) {
      div.classList.add('you');
      EscapeButton.init(btn);
    } else {
      btn.addEventListener('click', () => {
        if (Vote.getHasVoted()) return;
        if (getModalActive()) return;
        show('Anda yakin memilih "' + c.name + '"?', c.id);
      });
    }

    div.appendChild(nameSpan);
    div.appendChild(badge);
    div.appendChild(btn);
    container.appendChild(div);
  });
}

render();

let resizeTimer = null;
window.addEventListener('resize', () => {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    EscapeButton.recalcBasePositions();
  }, CONFIG.UI.RESIZE_DEBOUNCE);
});
