import { CONFIG } from './config.js';

const PAD = CONFIG.UI.EVASIVE_PADDING;
const MESSAGE_DURATION = CONFIG.UI.MESSAGE_DURATION;

const state = new WeakMap();
const resultEl = document.getElementById('result');

function saveBase(btn) {
  const card = btn.closest('.candidate');
  if (!card) return;
  const br = btn.getBoundingClientRect();
  const cr = card.getBoundingClientRect();
  state.set(btn, {
    baseLeft: br.left - cr.left,
    baseTop: br.top - cr.top,
    timer: state.get(btn)?.timer || null
  });
}

function move(btn) {
  const card = btn.closest('.candidate');
  if (!card) return;

  const cardRect = card.getBoundingClientRect();
  const w = btn.offsetWidth;
  const h = btn.offsetHeight;
  const maxX = cardRect.width - w - PAD * 2;
  const maxY = cardRect.height - h - PAD * 2;
  if (maxX <= 0 || maxY <= 0) return;

  const data = state.get(btn) || {};
  if (data.baseLeft == null || data.baseTop == null) saveBase(btn);
  const base = state.get(btn);

  const left = PAD + Math.random() * maxX;
  const top = PAD + Math.random() * maxY;

  btn.style.position = 'absolute';
  btn.style.right = 'auto';
  btn.style.bottom = 'auto';
  btn.style.left = left + 'px';
  btn.style.top = top + 'px';
  btn.style.transform = 'rotate(' + ((Math.random() * 12) - 6).toFixed(2) + 'deg)';
  btn.style.zIndex = '3';
  btn.style.transition = 'left 220ms cubic-bezier(0.34, 1.56, 0.64, 1), top 220ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)';
  btn.dataset.escapeLeft = String(left);
  btn.dataset.escapeTop = String(top);
  state.set(btn, base);
}

function init(btn) {
  const card = btn.closest('.candidate');
  if (card) card.style.position = 'relative';
  requestAnimationFrame(() => {
    saveBase(btn);
    const data = state.get(btn);
    if (!data) return;
    btn.style.position = 'absolute';
    btn.style.left = 'auto';
    btn.style.top = 'auto';
    btn.style.right = PAD + 'px';
    btn.style.bottom = PAD + 'px';
    btn.style.transition = 'left 220ms cubic-bezier(0.34, 1.56, 0.64, 1), top 220ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)';
  });

  function showMsg(msg) {
    const prev = state.get(btn) || {};
    if (prev.timer) clearTimeout(prev.timer);
    resultEl.textContent = msg;
    resultEl.style.color = '#c53030';
    const timer = setTimeout(() => {
      resultEl.textContent = '';
    }, MESSAGE_DURATION);
    state.set(btn, { ...prev, timer });
  }

  function handler(e) {
    e.preventDefault();
    e.stopPropagation();
    move(btn);
    showMsg('⚠️ Anda tidak bisa memilih diri sendiri! Tombol akan terus menghindar.');
  }

  btn.addEventListener('mouseover', handler);
  btn.addEventListener('click', handler);
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    move(btn);
  }, { passive: false });
}

function recalcBasePositions() {
  document.querySelectorAll('.vote-btn.evasive').forEach(btn => {
    saveBase(btn);
    btn.style.position = 'absolute';
    btn.style.right = PAD + 'px';
    btn.style.bottom = PAD + 'px';
  });
}

export { init, move, saveBase, recalcBasePositions };
