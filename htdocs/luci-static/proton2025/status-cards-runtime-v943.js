(function () {
'use strict';

/* PROTON_STATUS_CARDS_RUNTIME_V943 */

var KEY = 'proton-status-cards-enabled-v933';
var MIG = 'proton-status-cards-runtime-v943-once';
var BOX = 'proton-status-cards-v930';
var STYLE = 'proton-status-cards-runtime-v943-style';
var URL = '/luci-static/proton2025/status.json';
var LAST = 'proton-status-cards-runtime-v943-last';
var CHECK = 'proton-status-cards-toggle-v934';
var timer = null;

try {
  if (localStorage.getItem(MIG) !== '1') {
    localStorage.setItem(KEY, '1');
    localStorage.setItem(MIG, '1');
  }
} catch (e) {}

function enabled() {
  try { return localStorage.getItem(KEY) !== '0'; }
  catch (e) { return true; }
}

function setEnabled(v) {
  try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) {}
  applyVisibility();
  render();
}

function isOverview() {
  return (location.pathname || '').indexOf('/admin/status/overview') >= 0;
}

function fmtMB(n) {
  return Math.round(Number(n || 0) / 1048576) + ' MB';
}

function uptime(s) {
  s = Number(s || 0);
  var d = Math.floor(s / 86400);
  var h = Math.floor((s % 86400) / 3600);
  var m = Math.floor((s % 3600) / 60);
  if (d > 0) return d + 'д ' + h + 'ч';
  if (h > 0) return h + 'ч ' + m + 'м';
  return m + 'м';
}

function state(type, v) {
  v = Number(v || 0);
  if (type === 'load') return v >= 2 ? 'bad' : (v >= 1 ? 'warn' : 'good');
  if (type === 'temp') return v >= 75 ? 'bad' : (v >= 55 ? 'warn' : 'good');
  if (type === 'ram') return v >= 85 ? 'bad' : (v >= 65 ? 'warn' : 'good');
  return 'neutral';
}

function style() {
  if (document.getElementById(STYLE)) return;

  var s = document.createElement('style');
  s.id = STYLE;
  s.textContent =
'#' + BOX + '{margin:0 0 18px 0!important;padding:16px!important;border-radius:18px!important;border:1px solid rgba(120,160,255,.18)!important;background:linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.03))!important;box-shadow:0 10px 28px rgba(0,0,0,.14)!important}' +
'#' + BOX + ' .psc-head{text-align:center!important;margin-bottom:12px!important}' +
'#' + BOX + ' .psc-title{font-size:16px!important;font-weight:700!important;line-height:1.2!important}' +
'#' + BOX + ' .psc-grid{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(160px,1fr))!important;gap:12px!important}' +
'#' + BOX + ' .psc-card{min-height:98px!important;padding:14px 12px!important;border-radius:16px!important;border:1px solid rgba(255,255,255,.10)!important;background:rgba(255,255,255,.05)!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;text-align:center!important;box-sizing:border-box!important}' +
'#' + BOX + ' .psc-label{width:100%!important;font-size:11px!important;opacity:.72!important;font-weight:600!important;margin-bottom:8px!important;text-align:center!important}' +
'#' + BOX + ' .psc-value{width:100%!important;font-size:20px!important;line-height:24px!important;font-weight:700!important;text-align:center!important;font-variant-numeric:tabular-nums!important}' +
'#' + BOX + ' .psc-sub{width:100%!important;margin-top:8px!important;font-size:10px!important;line-height:13px!important;font-weight:500!important;opacity:.68!important;text-align:center!important}' +
'#' + BOX + ' .psc-dot{display:inline-block!important;width:8px!important;height:8px!important;border-radius:50%!important;margin-right:6px!important;vertical-align:middle!important}' +
'#' + BOX + ' .good{border-color:rgba(70,200,120,.34)!important;box-shadow:0 0 0 1px rgba(70,200,120,.08),0 10px 22px rgba(20,120,40,.10)!important}' +
'#' + BOX + ' .good .psc-dot{background:#56d67e!important;box-shadow:0 0 10px rgba(86,214,126,.45)!important}' +
'#' + BOX + ' .warn{border-color:rgba(245,200,70,.40)!important;box-shadow:0 0 0 1px rgba(245,200,70,.10),0 10px 22px rgba(150,110,20,.12)!important}' +
'#' + BOX + ' .warn .psc-dot{background:#f4c44d!important;box-shadow:0 0 12px rgba(244,196,77,.55)!important}' +
'#' + BOX + ' .bad{border-color:rgba(255,90,90,.45)!important;box-shadow:0 0 0 1px rgba(255,90,90,.12),0 12px 24px rgba(150,30,30,.14)!important}' +
'#' + BOX + ' .bad .psc-dot{background:#ff6767!important;box-shadow:0 0 14px rgba(255,103,103,.65)!important}' +
'#' + BOX + ' .neutral{border-color:rgba(120,160,255,.24)!important}' +
'#' + BOX + ' .neutral .psc-dot{background:#78a0ff!important;box-shadow:0 0 10px rgba(120,160,255,.45)!important}' +
'@media(max-width:700px){#' + BOX + ' .psc-grid{grid-template-columns:repeat(2,minmax(130px,1fr))!important}}' +
'@media(max-width:430px){#' + BOX + ' .psc-grid{grid-template-columns:1fr!important}}';

  (document.head || document.documentElement).appendChild(s);
}

function card(id, label) {
  return '<div class="psc-card neutral" data-card="' + id + '">' +
    '<div class="psc-label"><span class="psc-dot"></span>' + label + '</div>' +
    '<div class="psc-value">...</div>' +
    '<div class="psc-sub">загрузка...</div>' +
  '</div>';
}

function ensureBox() {
  if (!isOverview()) return null;

  var b = document.getElementById(BOX);
  if (b) return b;

  style();

  var main = document.getElementById('maincontent') || document.querySelector('main') || document.body;
  if (!main) return null;

  b = document.createElement('div');
  b.id = BOX;
  b.innerHTML =
    '<div class="psc-head"><div class="psc-title">Карточки состояния</div></div>' +
    '<div class="psc-grid">' +
    card('load', 'Нагрузка CPU') +
    card('temp', 'Температура') +
    card('ram', 'RAM') +
    card('uptime', 'Uptime') +
    '</div>';

  main.insertBefore(b, main.firstChild);
  return b;
}

function setCard(id, cls, value, sub) {
  var b = ensureBox();
  if (!b) return;

  var c = b.querySelector('[data-card="' + id + '"]');
  if (!c) return;

  c.className = 'psc-card ' + cls;

  var v = c.querySelector('.psc-value');
  var s = c.querySelector('.psc-sub');

  if (v) v.textContent = String(value);
  if (s) s.textContent = String(sub);
}

function apply(d) {
  if (!d) return;

  try { localStorage.setItem(LAST, JSON.stringify(d)); } catch (e) {}

  var load = Number(d.load1 || 0);
  var total = Number(d.mem_total || 0);
  var avail = Number(d.mem_avail || 0);
  var used = total > 0 ? total - avail : 0;
  var ram = total > 0 ? Math.round((used / total) * 100) : 0;
  var temp = d.temp === null || typeof d.temp === 'undefined' ? null : Number(d.temp);

  setCard('load', state('load', load), load.toFixed(2), 'load average 1 мин');
  setCard('temp', temp === null ? 'neutral' : state('temp', temp), temp === null ? 'н/д' : temp.toFixed(1) + '°C', 'датчик роутера');
  setCard('ram', total > 0 ? state('ram', ram) : 'neutral', total > 0 ? ram + '%' : 'н/д', fmtMB(used) + ' / ' + fmtMB(total));
  setCard('uptime', 'neutral', uptime(d.uptime || 0), 'время работы');
}

function cached() {
  try {
    var c = localStorage.getItem(LAST);
    if (c) apply(JSON.parse(c));
  } catch (e) {}
}

function fetchData() {
  if (!isOverview() || !enabled()) return;

  ensureBox();

  var x = new XMLHttpRequest();
  x.open('GET', URL + '?v=' + Date.now(), true);
  x.onreadystatechange = function () {
    if (x.readyState !== 4) return;

    if (x.status >= 200 && x.status < 300) {
      try { apply(JSON.parse(x.responseText || '{}')); }
      catch (e) { cached(); }
    } else {
      cached();
    }
  };
  x.send(null);
}

function applyVisibility() {
  var b = document.getElementById(BOX);
  if (b) b.style.display = enabled() ? '' : 'none';
}

function setting() {
  var root = document.getElementById('proton-theme-settings');
  if (!root) return;

  var old = document.getElementById(CHECK);
  if (old) {
    old.checked = enabled();
    return;
  }

  var block = document.createElement('div');
  block.className = 'cbi-value proton-status-cards-toggle-setting-v943';
  block.innerHTML =
    '<label class="cbi-value-title" for="' + CHECK + '">Карточки состояния</label>' +
    '<div class="cbi-value-field">' +
      '<div class="cbi-checkbox">' +
        '<input id="' + CHECK + '" type="checkbox">' +
        '<label for="' + CHECK + '"></label>' +
      '</div>' +
      '<div class="cbi-value-description">Показывать карточки нагрузки, температуры, RAM и uptime.</div>' +
    '</div>';

  var anchor = document.getElementById('proton-login-logo-text') ||
               document.getElementById('proton-hostname-animation-check') ||
               document.getElementById('proton-animations-check') ||
               document.getElementById('proton-accent-select');

  var row = anchor ? anchor.closest('.cbi-value') : null;

  if (row && row.parentNode) row.parentNode.insertBefore(block, row.nextSibling);
  else root.appendChild(block);

  var ch = document.getElementById(CHECK);
  ch.checked = enabled();
  ch.addEventListener('change', function () {
    setEnabled(ch.checked);
  });
}

function boot() {
  setting();
  applyVisibility();

  if (enabled()) {
    ensureBox();
    cached();
    fetchData();
  }

  if (!timer)
    timer = setInterval(fetchData, 15000);
}

boot();

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', boot);
else
  boot();

window.addEventListener('load', boot);
window.addEventListener('storage', boot);
window.addEventListener('popstate', boot);
window.addEventListener('hashchange', boot);
window.addEventListener('proton-settings-synced', boot);

if (!window.__protonStatusCardsRuntimeV943Observer) {
  window.__protonStatusCardsRuntimeV943Observer = new MutationObserver(function () {
    boot();
  });

  window.__protonStatusCardsRuntimeV943Observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

setTimeout(boot, 50);
setTimeout(boot, 250);
setTimeout(boot, 800);
setTimeout(boot, 1600);
setTimeout(boot, 3200);
})();
