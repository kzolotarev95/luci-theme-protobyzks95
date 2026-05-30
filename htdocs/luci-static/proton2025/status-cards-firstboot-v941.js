(function () {
'use strict';

/* PROTON_STATUS_CARDS_FIRSTBOOT_V941 */

var KEY = 'proton-status-cards-enabled-v933';
var MIG = 'proton-status-cards-firstboot-v941-done';

try {
  if (localStorage.getItem(MIG) !== '1') {
    localStorage.setItem(KEY, '1');
    localStorage.setItem(MIG, '1');
  }
} catch (e) {}

function syncCheck() {
  try {
    var on = localStorage.getItem(KEY) !== '0';
    [
      'proton-status-cards-toggle-v934',
      'proton-status-cards-toggle-v933'
    ].forEach(function (id) {
      var el = document.getElementById(id);
      if (el)
        el.checked = on;
    });

    var box = document.getElementById('proton-status-cards-v930');
    if (box && on)
      box.style.display = '';
  } catch (e) {}
}

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', syncCheck);
else
  syncCheck();

window.addEventListener('load', syncCheck);
setTimeout(syncCheck, 100);
setTimeout(syncCheck, 500);
setTimeout(syncCheck, 1500);
})();
