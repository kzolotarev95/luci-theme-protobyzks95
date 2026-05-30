(function () {
'use strict';

/* PROTON_HIDE_NATIVE_LOAD_EARLY_HEAD_V935 */

function cleanText(t) {
  return String(t || '').replace(/\s+/g, ' ').trim();
}

function isNativeLoadLabel(t) {
  t = cleanText(t);

  if (t === 'Нагрузка')
    return true;

  if (t === 'Нагрузка (за 1, 5, 15 мин)')
    return true;

  if (t === 'Load')
    return true;

  if (t === 'Load average')
    return true;

  if (t === 'Load average (1, 5, 15 min)')
    return true;

  return false;
}

function hideNode(node) {
  var el = node && node.parentElement;
  if (!el)
    return;

  if (el.closest('#proton-status-cards-v930'))
    return;

  var dt = el.closest('dt');
  if (dt) {
    dt.style.display = 'none';
    dt.setAttribute('data-proton-hide-load-v935', '1');

    var dd = dt.nextElementSibling;
    if (dd && String(dd.tagName || '').toLowerCase() === 'dd') {
      dd.style.display = 'none';
      dd.setAttribute('data-proton-hide-load-v935', '1');
    }
    return;
  }

  var row = el.closest('tr, .tr, .table-row, .cbi-value, li');
  if (row) {
    row.style.display = 'none';
    row.setAttribute('data-proton-hide-load-v935', '1');
    return;
  }

  el.style.display = 'none';
  el.setAttribute('data-proton-hide-load-v935', '1');
}

function scan(root) {
  root = root || document.getElementById('maincontent') || document.body || document.documentElement;
  if (!root)
    return;

  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  var n;

  while ((n = walker.nextNode())) {
    if (isNativeLoadLabel(n.nodeValue))
      hideNode(n);
  }
}

function boot() {
  scan();

  if (!window.__protonHideLoadObserverV935) {
    window.__protonHideLoadObserverV935 = new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < list[i].addedNodes.length; j++) {
          var n = list[i].addedNodes[j];
          if (n && n.nodeType === 1)
            scan(n);
        }
      }
    });

    window.__protonHideLoadObserverV935.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
}

boot();

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', boot);
else
  boot();

window.addEventListener('load', boot);

setTimeout(boot, 50);
setTimeout(boot, 150);
setTimeout(boot, 300);
setTimeout(boot, 700);
setTimeout(boot, 1500);
})();
