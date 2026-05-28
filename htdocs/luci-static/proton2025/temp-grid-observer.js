(function () {
'use strict';

var rendering = false;
var lastJson = '';
var timer = null;

function esc(s) {
return String(s || '')
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;');
}

function rawName(s) {
return String(s || '').toLowerCase();
}

function isCpu(name) {
var n = rawName(name);
return n.indexOf('cpu') !== -1 || n.indexOf('thermal') !== -1;
}

function niceName(name) {
var n = rawName(name);

if (isCpu(name))
return 'Процессор Thermal';

if (n.indexOf('mt7915_phy0') !== -1 || n.indexOf('mt7915 phy0') !== -1)
return 'Mt7915 Phy0';

if (n.indexOf('mt7915_phy1') !== -1 || n.indexOf('mt7915 phy1') !== -1)
return 'Mt7915 Phy1';

return String(name || 'sensor');
}

function filteredSensors(sensors) {
var out = [];
var seenCpu = false;

for (var i = 0; i < sensors.length; i++) {
var s = sensors[i] || {};
var name = s.name || '';

if (isCpu(name)) {
if (seenCpu)
continue;
seenCpu = true;
}

s._niceName = niceName(name);
out.push(s);
}

return out;
}

function status(level) {
if (level === 'critical')
return 'Критично';
if (level === 'hot')
return 'Горячо';
if (level === 'warm')
return 'Тепло';
return 'Норма';
}

function pct(temp) {
var n = parseFloat(temp || 0);
if (!isFinite(n))
n = 0;
return Math.max(4, Math.min(100, Math.round(n)));
}

function needFill(grid) {
if (!grid)
return false;

var text = String(grid.textContent || '').replace(/\s+/g, ' ').trim();

if (!grid.querySelector('.proton-temp-card'))
return true;

if (text === '' || text.indexOf('Проверка') !== -1)
return true;

return false;
}

function render(data) {
var grid = document.getElementById('proton-temp-grid');
if (!grid)
return false;

var sensors = filteredSensors(data && data.sensors ? data.sensors : []);
var json = JSON.stringify(sensors);

if (grid.getAttribute('data-proton-temp-filled') === '1' && json === lastJson && !needFill(grid))
return true;

lastJson = json;
rendering = true;

var html = '';

if (!sensors.length) {
html = '<div class="proton-temp-empty">Датчики температуры не найдены</div>';
} else {
for (var i = 0; i < sensors.length; i++) {
var s = sensors[i] || {};
var level = s.level || 'normal';
var temp = s.temp || '?';
var name = s._niceName || niceName(s.name);

html += '<div class="proton-temp-card" data-level="' + esc(level) + '">' +
'<div class="proton-temp-value-container">' +
'<div class="proton-temp-value-wrapper">' +
'<span class="proton-temp-value">' + esc(temp) + '</span>' +
'<span class="proton-temp-unit">°C</span>' +
'</div>' +
'<h4 class="proton-temp-sensor-name" title="' + esc(name) + '">' + esc(name) + '</h4>' +
'</div>' +
'<div class="proton-temp-bar-container">' +
'<div class="proton-temp-bar ' + esc(level) + '" style="width:' + pct(temp) + '%"></div>' +
'</div>' +
'<div class="proton-temp-status">' +
'<span class="proton-temp-status-dot"></span>' +
'<span class="proton-temp-status-text">' + status(level) + '</span>' +
'<span class="proton-temp-peak">Пик: ' + esc(temp) + '°C</span>' +
'</div>' +
'</div>';
}
}

grid.innerHTML = html;
grid.setAttribute('data-proton-temp-filled', '1');

setTimeout(function () {
rendering = false;
}, 100);

return true;
}

function load() {
var xhr = new XMLHttpRequest();
xhr.open('GET', '/luci-static/proton2025/temperature.json?v=' + Date.now(), true);

xhr.onreadystatechange = function () {
if (xhr.readyState !== 4)
return;

if (xhr.status >= 200 && xhr.status < 300) {
try {
render(JSON.parse(xhr.responseText));
} catch (e) {
console.warn('[Proton2025] temperature json parse failed:', e);
}
}
};

xhr.send();
}

function schedule() {
if (rendering)
return;

clearTimeout(timer);
timer = setTimeout(load, 160);
}

function startObserver() {
var obs = new MutationObserver(function () {
if (!rendering)
schedule();
});

obs.observe(document.body, {
childList: true,
subtree: true,
characterData: true
});
}

if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', function () {
load();
startObserver();
});
} else {
load();
startObserver();
}

setTimeout(load, 500);
setTimeout(load, 1500);
setTimeout(load, 3000);
setInterval(load, 5000);
})();
