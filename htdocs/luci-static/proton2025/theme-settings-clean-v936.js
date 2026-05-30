(function () {
'use strict';

/* PROTON_REMOVE_LOG_HIGHLIGHT_SETTING_V936 */

function norm(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function removeRow(el) {
  if (!el)
    return;

  var row = el.closest('.cbi-value, .cbi-section-node, tr, li, .form-group, .control-group');
  if (row) {
    row.remove();
    return;
  }

  el.remove();
}

function cleanKnownIds() {
  [
    'proton-log-highlight',
    'proton-log-highlight-check',
    'proton-log-highlight-enabled',
    'proton-log-highlight-select'
  ].forEach(function (id) {
    var el = document.getElementById(id);
    if (el)
      removeRow(el);
  });
}

function cleanByText() {
  var root = document.getElementById('proton-theme-settings');
  if (!root)
    return;

  var phrases = [
    'Подсветка логов',
    'Подсвечивать логи',
    'Log highlight',
    'Highlight logs'
  ];

  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  var nodes = [];
  var n;

  while ((n = walker.nextNode())) {
    var text = norm(n.nodeValue);
    for (var i = 0; i < phrases.length; i++) {
      if (text.indexOf(phrases[i]) !== -1) {
        nodes.push(n);
        break;
      }
    }
  }

  nodes.forEach(function (node) {
    removeRow(node.parentElement);
  });
}

function clean() {
  cleanKnownIds();
  cleanByText();
}

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', clean);
else
  clean();

window.addEventListener('load', clean);
window.addEventListener('proton-settings-synced', clean);

var tries = 0;
var t = setInterval(function () {
  clean();
  tries++;
  if (tries >= 20)
    clearInterval(t);
}, 500);
})();
