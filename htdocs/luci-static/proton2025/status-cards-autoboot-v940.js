(function () {
'use strict';

/* PROTON_STATUS_CARDS_AUTOBOOT_V940 */

var KEY = 'proton-status-cards-enabled-v933';
var STYLE_ID = 'proton-status-cards-autoboot-style-v940';
var BOX_ID = 'proton-status-cards-v930';
var CHECK_IDS = [
  'proton-status-cards-toggle-v934',
  'proton-status-cards-toggle-v933'
];

function isOverview() {
  return (location.pathname || '').indexOf('/admin/status/overview') >= 0;
}

function isEnabled() {
  var v = localStorage.getItem(KEY);

  if (v === null || typeof v === 'undefined') {
    localStorage.setItem(KEY, '1');
    return true;
  }

  return v !== '0';
}

function ensureVisibility() {
  var st = document.getElementById(STYLE_ID);

  if (!st) {
    st = document.createElement('style');
    st.id = STYLE_ID;
    document.head.appendChild(st);
  }

  st.textContent = isEnabled()
    ? ''
    : '#' + BOX_ID + '{display:none!important;}';
}

function syncCheckbox() {
  CHECK_IDS.forEach(function (id) {
    var ch = document.getElementById(id);
    if (ch)
      ch.checked = isEnabled();
  });
}

function forceLoadCards() {
  if (!isOverview())
    return;

  if (!isEnabled())
    return;

  if (document.getElementById(BOX_ID))
    return;

  if (window.__protonStatusCardsAutobootLoadingV940)
    return;

  window.__protonStatusCardsAutobootLoadingV940 = true;

  var s = document.createElement('script');
  s.src = '/luci-static/proton2025/status-cards-v930.js?v=v940-' + Date.now();
  s.setAttribute('data-proton-status-cards-autoboot-v940', '1');
  s.onload = function () {
    window.__protonStatusCardsAutobootLoadingV940 = false;
  };
  s.onerror = function () {
    window.__protonStatusCardsAutobootLoadingV940 = false;
  };

  document.head.appendChild(s);
}

function boot() {
  ensureVisibility();
  syncCheckbox();
  forceLoadCards();
}

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', boot);
else
  boot();

window.addEventListener('load', boot);
window.addEventListener('storage', boot);
window.addEventListener('proton-settings-synced', boot);

setTimeout(boot, 50);
setTimeout(boot, 200);
setTimeout(boot, 600);
setTimeout(boot, 1200);
setTimeout(boot, 2500);
setTimeout(boot, 5000);
})();
