(function () {
'use strict';

/* PROTON_STATUS_TEXT_CLEAN_V932 */

function cleanTextNode(node) {
  if (!node || node.nodeType !== 3)
    return;

  var t = node.nodeValue || '';

  if (t.indexOf('Нагрузка / температура / память / uptime') !== -1)
    node.nodeValue = t.replace('Нагрузка / температура / память / uptime', '');

  if (t.indexOf('Нагрузка (за 1, 5, 15 мин)') !== -1)
    node.nodeValue = t.replace('Нагрузка (за 1, 5, 15 мин)', 'Нагрузка');

  if (t.indexOf('Load average (1, 5, 15 min)') !== -1)
    node.nodeValue = t.replace('Load average (1, 5, 15 min)', 'Load average');
}

function walk(root) {
  root = root || document.getElementById('maincontent') || document.body;
  if (!root)
    return;

  var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  var n;

  while ((n = w.nextNode()))
    cleanTextNode(n);
}

function cleanCards() {
  var note = document.querySelector('#proton-status-cards-v930 .psc-note');
  if (note)
    note.textContent = '';
}

function run() {
  cleanCards();
  walk();
}

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', run);
else
  run();

window.addEventListener('load', run);
setTimeout(run, 300);
setTimeout(run, 1000);
setTimeout(run, 2500);
})();
