'use strict';
const timerPage = location.origin === 'https://mortuzatonmoy.github.io' &&
  /^\/visual-timer\/(?:index\.html)?$/.test(location.pathname);
const prefix = 'interval-run-';
const runs = new Map();
let timeout, overlay;
function refresh() {
  clearTimeout(timeout);
  const now = Date.now();
  const deadlines = [...runs.values()];
  if (!deadlines.some(end => end <= now)) {
    overlay?.remove();
    overlay = null;
    if (deadlines.length) timeout = setTimeout(refresh, Math.min(...deadlines) - now);
    return;
  }
  if (overlay?.isConnected) return;
  overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed!important;inset:0!important;z-index:2147483647!important;display:grid!important;place-items:center!important;background:#34191399!important;pointer-events:auto!important';
  const root = overlay.attachShadow({mode:'closed'});
  root.innerHTML = '<style>article{box-sizing:border-box;background:#fff2e9;color:#582920;padding:32px;border:3px solid #b94c36;border-radius:18px;box-shadow:0 12px 60px #0004;text-align:center;font:16px system-ui;width:min(360px,90vw)}strong{display:block;font:700 40px system-ui;margin:8px 0 22px}button{font:600 17px system-ui;background:#672c21;color:white;padding:11px 28px;border:0;border-radius:8px;cursor:pointer}</style><article role="alert"><small>INTERVAL TIMER</small><strong>Time’s up!</strong><button>Dismiss</button></article>';
  root.querySelector('button').onclick = () => {
    const ended = [...runs].filter(([,end]) => end <= Date.now()).map(([key]) => key);
    chrome.storage.local.remove(ended);
  };
  (document.fullscreenElement || document.documentElement).append(overlay);
}
function accept(key, value) {
  if (!key.startsWith(prefix)) return;
  if (Number.isFinite(value)) runs.set(key,value);
  else runs.delete(key);
}
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  for (const [key,change] of Object.entries(changes)) accept(key,change.newValue);
  refresh();
});
chrome.storage.local.get(null).then(items => {
  for (const [key,value] of Object.entries(items)) accept(key,value);
  refresh();
});
document.addEventListener('visibilitychange',refresh);
document.addEventListener('fullscreenchange',() => {
  if (overlay) (document.fullscreenElement || document.documentElement).append(overlay);
});
if (timerPage) {
  const key = prefix + crypto.randomUUID();
  const sync = () => {
    const end = Number(document.documentElement.dataset.intervalDeadline);
    if (end > 0) chrome.storage.local.set({[key]:end});
    else chrome.storage.local.remove(key);
  };
  document.addEventListener('interval-schedule',sync);
  document.documentElement.dataset.intervalExtension = 'on';
  document.dispatchEvent(new Event('interval-connected'));
  sync();
}
