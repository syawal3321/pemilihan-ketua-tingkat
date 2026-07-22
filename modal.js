const overlay = document.getElementById('confirmModal');
const msgEl = document.getElementById('modalMessage');
const yesBtn = document.getElementById('modalYes');
const noBtn = document.getElementById('modalNo');

let pendingId = null;
let active = false;
let onConfirm = null;
let previousFocus = null;

function trapFocus(e) {
  if (e.key === 'Tab') {
    const focusable = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  if (e.key === 'Escape') hide();
}

function init(callback) {
  onConfirm = callback;
  yesBtn.addEventListener('click', confirm);
  noBtn.addEventListener('click', hide);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hide();
  });
}

function confirm() {
  if (pendingId !== null && onConfirm) onConfirm(pendingId);
  hide();
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

export function getActive() { return active; }
export { init, show, confirm, hide };
