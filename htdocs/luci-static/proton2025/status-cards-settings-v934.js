(function () {
'use strict';

/* PROTON_HIDE_NATIVE_LOAD_AND_CARD_TOGGLE_V934 */

var KEY = 'proton-status-cards-enabled-v933';
var STYLE_ID = 'proton-status-cards-toggle-style-v934';
var CHECK_ID = 'proton-status-cards-toggle-v934';

function enabled() {
  return localStorage.getItem(KEY) !== '0';
}

function setEnabled(v) {
  localStorage.setItem(KEY, v ? '1' : '0');
  applyCardsVisibility();
}

function applyCardsVisibility() {
  var st = document.getElementById(STYLE_ID);

  if (!st) {
    st = document.createElement('style');
    st.id = STYLE_ID;
    document.head.appendChild(st);
  }

  st.textContent = enabled()
    ? ''
    : '#proton-status-cards-v930{display:none!important;}';
}

function addThemeSetting() {
  var root = document.getElementById('proton-theme-settings');
  if (!root)
    return;

  var old = document.getElementById(CHECK_ID);
  if (old) {
    old.checked = enabled();
    return;
  }

  var block = document.createElement('div');
  block.className = 'cbi-value proton-status-cards-toggle-setting-v934';
  block.innerHTML =
    '<label class="cbi-value-title" for="' + CHECK_ID + '">Карточки состояния</label>' +
    '<div class="cbi-value-field">' +
      '<div class="cbi-checkbox">' +
        '<input id="' + CHECK_ID + '" type="checkbox">' +
        '<label for="' + CHECK_ID + '"></label>' +
      '</div>' +
      '<div class="cbi-value-description">Показывать карточки нагрузки, температуры, RAM и uptime на странице Статус → Обзор.</div>' +
    '</div>';

  var anchor =
    document.getElementById('proton-login-logo-text') ||
    document.getElementById('proton-hostname-animation-check') ||
    document.getElementById('proton-animations-check') ||
    document.getElementById('proton-accent-select');

  var row = anchor ? anchor.closest('.cbi-value') : null;

  if (row && row.parentNode)
    row.parentNode.insertBefore(block, row.nextSibling);
  else
    root.appendChild(block);

  var check = document.getElementById(CHECK_ID);
  check.checked = enabled();
  check.addEventListener('change', function () {
    setEnabled(check.checked);
  });
}

function isNativeLoadText(text) {
  text = String(text || '').replace(/\s+/g, ' ').trim();

  if (text === 'Нагрузка')
    return true;

  if (text === 'Load average' || text === 'Load')
    return true;

  if (text.indexOf('Нагрузка' + ' (за 1, 5, 15 мин)') !== -1)
    return true;

  if (text.indexOf('Load average' + ' (1, 5, 15 min)') !== -1)
    return true;

  return false;
}

function hideNativeLoadRow() {
  if ((location.pathname || '').indexOf('/admin/status/overview') < 0)
    return;

  var root = document.getElementById('maincontent') || document.body;
  if (!root)
    return;

  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  var nodes = [];
  var n;

  while ((n = walker.nextNode())) {
    if (isNativeLoadText(n.nodeValue))
      nodes.push(n);
  }

  nodes.forEach(function (node) {
    var el = node.parentElement;
    if (!el)
      return;

    if (el.closest('#proton-status-cards-v930'))
      return;

    var dt = el.closest('dt');
    if (dt) {
      dt.style.display = 'none';
      dt.setAttribute('data-proton-hidden-load-v934', '1');

      var next = dt.nextElementSibling;
      if (next && String(next.tagName || '').toLowerCase() === 'dd') {
        next.style.display = 'none';
        next.setAttribute('data-proton-hidden-load-v934', '1');
      }
      return;
    }

    var row = el.closest('tr, .tr, .table-row, .cbi-value, li');
    if (row) {
      row.style.display = 'none';
      row.setAttribute('data-proton-hidden-load-v934', '1');
      return;
    }

    el.style.display = 'none';
    el.setAttribute('data-proton-hidden-load-v934', '1');
  });
}

function boot() {
  applyCardsVisibility();
  addThemeSetting();
  hideNativeLoadRow();
}

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', boot);
else
  boot();

window.addEventListener('load', boot);
window.addEventListener('storage', boot);
window.addEventListener('proton-settings-synced', boot);

var tries = 0;
var t = setInterval(function () {
  hideNativeLoadRow();
  tries++;
  if (tries >= 30)
    clearInterval(t);
}, 500);

setTimeout(boot, 300);
setTimeout(boot, 1000);
setTimeout(boot, 2500);
setTimeout(boot, 5000);
})();
