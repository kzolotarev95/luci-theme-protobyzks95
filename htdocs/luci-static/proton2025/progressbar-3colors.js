(function () {
'use strict';

var COLOR_CLASSES = [
'proton-progress-green',
'proton-progress-yellow',
'proton-progress-red'
];

function parsePercent(bar) {
var title = bar.getAttribute('title') || '';
var m = title.match(/\((\d+(?:\.\d+)?)%\)/);

if (m)
return parseFloat(m[1]);

var fill = bar.firstElementChild;
if (fill && fill.style && fill.style.width) {
var n = parseFloat(fill.style.width);
if (!isNaN(n))
return n;
}

return null;
}

function getRowLabel(bar) {
var row = bar.closest('tr, .tr');
if (!row)
return '';

var first = row.querySelector('td:first-child, .td:first-child');
return first ? (first.textContent || '').trim().toLowerCase() : '';
}

function getTargetClass(bar, percent) {
var label = getRowLabel(bar);

/* Свободно: больше свободно = зелёный */
if (label.indexOf('свобод') !== -1) {
if (percent >= 45)
return 'proton-progress-green';
if (percent >= 25)
return 'proton-progress-yellow';
return 'proton-progress-red';
}

/* Остальное: больше процент = хуже */
if (percent < 60)
return 'proton-progress-green';

if (percent < 80)
return 'proton-progress-yellow';

return 'proton-progress-red';
}

function setColorClass(bar, targetClass) {
if (!targetClass)
return;

bar.classList.add('proton-progressbar-colored');

/* Не снимаем цвет заранее — так нет мигания */
if (bar.dataset.protonProgressClass === targetClass)
return;

for (var i = 0; i < COLOR_CLASSES.length; i++) {
if (COLOR_CLASSES[i] !== targetClass)
bar.classList.remove(COLOR_CLASSES[i]);
}

bar.classList.add(targetClass);
bar.dataset.protonProgressClass = targetClass;
}

function apply() {
var bars = document.querySelectorAll('.cbi-progressbar');

for (var i = 0; i < bars.length; i++) {
var bar = bars[i];
var percent = parsePercent(bar);

if (percent === null)
continue;

setColorClass(bar, getTargetClass(bar, percent));
}
}

var raf = 0;

function schedule() {
if (raf)
return;

raf = requestAnimationFrame(function () {
raf = 0;
apply();
});
}

if (document.readyState === 'loading')
document.addEventListener('DOMContentLoaded', schedule);
else
schedule();

setTimeout(schedule, 250);
setTimeout(schedule, 1000);

new MutationObserver(schedule).observe(document.documentElement, {
childList: true,
subtree: true,
attributes: true,
attributeFilter: ['title', 'style']
});
})();
