(function () {
'use strict';

/* PROTON_STATUS_CARDS_FORCE_LOADER_V942 */

var KEY = 'proton-status-cards-enabled-v933';
var BOX_ID = 'proton-status-cards-v930';
var SRC_MARK = 'data-proton-status-cards-v942-loader';

function isOverview() {
  return (location.pathname || '').indexOf('/admin/status/overview') >= 0;
}

function forceDefaultOn() {
  try {
    if (localStorage.getItem(KEY) === null)
      localStorage.setItem(KEY, '1');
  } catch (e) {}
}

function enabled() {
  try {
    return localStorage.getItem(KEY) !== '0';
  } catch (e) {
    return true;
  }
}

function syncCheckboxes() {
  try {
    var on = enabled();
    [
      'proton-status-cards-toggle-v934',
      'proton-status-cards-toggle-v933'
    ].forEach(function (id) {
      var el = document.getElementById(id);
      if (el)
        el.checked = on;
    });
  } catch (e) {}
}

function ensureScriptLoaded() {
  if (!isOverview())
    return;

  forceDefaultOn();

  if (!enabled())
    return;

  if (document.getElementById(BOX_ID))
    return;

  if (document.querySelector('script[' + SRC_MARK + '="1"]'))
    return;

  var s = document.createElement('script');
  s.src = '/luci-static/proton2025/status-cards-v930.js?v=v942-' + Date.now();
  s.setAttribute(SRC_MARK, '1');
  s.async = false;

  (document.head || document.documentElement).appendChild(s);
}

function makeVisible() {
  var box = document.getElementById(BOX_ID);
  if (box && enabled())
    box.style.display = '';
}

function boot() {
  forceDefaultOn();
  syncCheckboxes();
  ensureScriptLoaded();
  makeVisible();
}

boot();

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', boot);
else
  boot();

window.addEventListener('load', boot);
window.addEventListener('storage', boot);
window.addEventListener('proton-settings-synced', boot);

setTimeout(boot, 50);
setTimeout(boot, 150);
setTimeout(boot, 400);
setTimeout(boot, 900);
setTimeout(boot, 1800);
setTimeout(boot, 3500);
})();
