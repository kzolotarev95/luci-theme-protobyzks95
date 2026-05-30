(function () {
'use strict';

/* PROTON_STATUS_CARDS_V930 */

var BOX_ID = 'proton-status-cards-v930';
var STYLE_ID = 'proton-status-cards-v930-style';
var URL = '/luci-static/proton2025/status.json';
var LAST_KEY = 'proton_status_cards_v930_last';
var REFRESH_MS = 15000;
var timer = null;

function bytesToMB(n) {
  n = Number(n || 0);
  return Math.round(n / 1048576);
}

function fmtUptime(sec) {
  sec = Number(sec || 0);
  var d = Math.floor(sec / 86400);
  var h = Math.floor((sec % 86400) / 3600);
  var m = Math.floor((sec % 3600) / 60);

  if (d > 0) return d + 'д ' + h + 'ч';
  if (h > 0) return h + 'ч ' + m + 'м';
  return m + 'м';
}

function stateForLoad(v) {
  v = Number(v || 0);
  if (v >= 2.0) return 'bad';
  if (v >= 1.0) return 'warn';
  return 'good';
}

function stateForTemp(v) {
  v = Number(v || 0);
  if (v >= 75) return 'bad';
  if (v >= 55) return 'warn';
  return 'good';
}

function stateForRam(v) {
  v = Number(v || 0);
  if (v >= 85) return 'bad';
  if (v >= 65) return 'warn';
  return 'good';
}

function ensureStyle() {
  if (document.getElementById(STYLE_ID))
    return;

  var st = document.createElement('style');
  st.id = STYLE_ID;
  st.textContent = `
#${BOX_ID}{
  margin: 0 0 18px 0 !important;
  padding: 16px !important;
  border-radius: 18px !important;
  border: 1px solid rgba(120,160,255,.18) !important;
  background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.03)) !important;
  box-shadow: 0 10px 28px rgba(0,0,0,.14) !important;
}
#${BOX_ID} .psc-head{
  text-align:center !important;
  margin-bottom:14px !important;
}
#${BOX_ID} .psc-title{
  font-size:18px !important;
  font-weight:800 !important;
  line-height:1.2 !important;
}
#${BOX_ID} .psc-note{
  font-size:12px !important;
  opacity:.7 !important;
  margin-top:4px !important;
}
#${BOX_ID} .psc-grid{
  display:grid !important;
  grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)) !important;
  gap:12px !important;
  align-items:stretch !important;
}
#${BOX_ID} .psc-card{
  min-height:105px !important;
  padding:14px 12px !important;
  border-radius:16px !important;
  border:1px solid rgba(255,255,255,.10) !important;
  background:rgba(255,255,255,.05) !important;
  display:flex !important;
  flex-direction:column !important;
  align-items:center !important;
  justify-content:center !important;
  text-align:center !important;
  box-sizing:border-box !important;
}
#${BOX_ID} .psc-label{
  width:100% !important;
  font-size:12px !important;
  opacity:.75 !important;
  font-weight:700 !important;
  margin-bottom:8px !important;
  text-align:center !important;
}
#${BOX_ID} .psc-value{
  width:100% !important;
  font-size:24px !important;
  line-height:1 !important;
  font-weight:900 !important;
  text-align:center !important;
}
#${BOX_ID} .psc-sub{
  width:100% !important;
  margin-top:8px !important;
  font-size:11px !important;
  opacity:.72 !important;
  text-align:center !important;
}
#${BOX_ID} .psc-dot{
  display:inline-block !important;
  width:8px !important;
  height:8px !important;
  border-radius:50% !important;
  margin-right:6px !important;
  vertical-align:middle !important;
}
#${BOX_ID} .good{
  border-color:rgba(70,200,120,.34) !important;
  box-shadow:0 0 0 1px rgba(70,200,120,.08), 0 10px 22px rgba(20,120,40,.10) !important;
}
#${BOX_ID} .good .psc-dot{
  background:#56d67e !important;
  box-shadow:0 0 10px rgba(86,214,126,.45) !important;
}
#${BOX_ID} .warn{
  border-color:rgba(245,200,70,.40) !important;
  box-shadow:0 0 0 1px rgba(245,200,70,.10), 0 10px 22px rgba(150,110,20,.12) !important;
}
#${BOX_ID} .warn .psc-dot{
  background:#f4c44d !important;
  box-shadow:0 0 12px rgba(244,196,77,.55) !important;
  animation: pscWarnPulse 1.6s ease-in-out infinite !important;
}
#${BOX_ID} .bad{
  border-color:rgba(255,90,90,.45) !important;
  box-shadow:0 0 0 1px rgba(255,90,90,.12), 0 12px 24px rgba(150,30,30,.14) !important;
}
#${BOX_ID} .bad .psc-dot{
  background:#ff6767 !important;
  box-shadow:0 0 14px rgba(255,103,103,.65) !important;
  animation: pscBadPulse 1s ease-in-out infinite !important;
}
#${BOX_ID} .neutral{
  border-color:rgba(120,160,255,.24) !important;
}
#${BOX_ID} .neutral .psc-dot{
  background:#78a0ff !important;
  box-shadow:0 0 10px rgba(120,160,255,.45) !important;
}
@keyframes pscWarnPulse {0%,100%{opacity:.75}50%{opacity:1}}
@keyframes pscBadPulse {0%,100%{opacity:.68}50%{opacity:1}}
@media (max-width:700px){
  #${BOX_ID} .psc-grid{
    grid-template-columns:repeat(2, minmax(130px, 1fr)) !important;
  }
}
@media (max-width:430px){
  #${BOX_ID} .psc-grid{
    grid-template-columns:1fr !important;
  }
}`;
  document.head.appendChild(st);
}

function makeCard(id, label) {
  return '<div class="psc-card neutral" data-card="' + id + '">' +
    '<div class="psc-label"><span class="psc-dot"></span>' + label + '</div>' +
    '<div class="psc-value">...</div>' +
    '<div class="psc-sub">загрузка...</div>' +
    '</div>';
}

function ensureBox() {
  var box = document.getElementById(BOX_ID);
  if (box)
    return box;

  if ((location.pathname || '').indexOf('/admin/status/overview') < 0)
    return null;

  ensureStyle();

  var main = document.getElementById('maincontent') ||
             document.querySelector('.main-right') ||
             document.querySelector('main') ||
             document.body;

  if (!main)
    return null;

  box = document.createElement('div');
  box.id = BOX_ID;
  box.innerHTML =
    '<div class="psc-head">' +
      '<div class="psc-title">Карточки состояния</div>' +
      '<div class="psc-note">Нагрузка / температура / память / uptime</div>' +
    '</div>' +
    '<div class="psc-grid">' +
      makeCard('load', 'Нагрузка CPU') +
      makeCard('temp', 'Температура') +
      makeCard('ram', 'RAM') +
      makeCard('uptime', 'Uptime') +
    '</div>';

  if (main.firstChild)
    main.insertBefore(box, main.firstChild);
  else
    main.appendChild(box);

  return box;
}

function setCard(id, cls, value, sub) {
  var box = ensureBox();
  if (!box)
    return;

  var card = box.querySelector('[data-card="' + id + '"]');
  if (!card)
    return;

  card.className = 'psc-card ' + cls;

  var v = card.querySelector('.psc-value');
  var s = card.querySelector('.psc-sub');

  if (v) v.textContent = String(value);
  if (s) s.textContent = String(sub);
}

function applyData(d) {
  if (!d)
    return;

  try {
    localStorage.setItem(LAST_KEY, JSON.stringify(d));
  } catch (e) {}

  var load = Number(d.load1 || 0);
  var total = Number(d.mem_total || 0);
  var avail = Number(d.mem_avail || 0);
  var used = total > 0 ? total - avail : 0;
  var ramPct = total > 0 ? Math.round((used / total) * 100) : 0;
  var temp = (d.temp === null || typeof d.temp === 'undefined') ? null : Number(d.temp);

  setCard('load', stateForLoad(load), load.toFixed(2), 'load average 1 мин');
  setCard('temp', temp === null ? 'neutral' : stateForTemp(temp), temp === null ? 'н/д' : temp.toFixed(1) + '°C', 'датчик роутера');
  setCard('ram', total > 0 ? stateForRam(ramPct) : 'neutral', total > 0 ? ramPct + '%' : 'н/д', bytesToMB(used) + ' MB / ' + bytesToMB(total) + ' MB');
  setCard('uptime', 'neutral', fmtUptime(d.uptime || 0), 'время работы');
}

function applyCached() {
  try {
    var c = localStorage.getItem(LAST_KEY);
    if (c)
      applyData(JSON.parse(c));
  } catch (e) {}
}

function fetchData() {
  ensureBox();

  var x = new XMLHttpRequest();
  x.open('GET', URL + '?v=' + Date.now(), true);
  x.onreadystatechange = function () {
    if (x.readyState !== 4)
      return;

    if (x.status >= 200 && x.status < 300) {
      try {
        applyData(JSON.parse(x.responseText || '{}'));
      } catch (e) {
        applyCached();
      }
    } else {
      applyCached();
    }
  };
  x.send(null);
}

function boot() {
  ensureBox();
  applyCached();
  fetchData();

  if (!timer)
    timer = setInterval(fetchData, REFRESH_MS);
}

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', boot);
else
  boot();

window.addEventListener('load', boot);
setTimeout(boot, 400);
setTimeout(boot, 1200);
})();
