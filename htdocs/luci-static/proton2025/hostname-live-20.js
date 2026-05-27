(function () {
'use strict';

var MODE_COUNT = 20;
var MODE_MS = 2300;
var TIMER = null;

var ENABLE_KEY = 'protonHostnameLiveEnabled';
var MODE_KEY = 'protonHostnameLiveMode';

function getEnabled() {
return localStorage.getItem(ENABLE_KEY) !== '0';
}

function getMode() {
var value = parseInt(localStorage.getItem(MODE_KEY) || '-1', 10);

if (isNaN(value) || value < -1 || value >= MODE_COUNT)
return -1;

return value;
}

function getLink() {
return document.querySelector('span.hostname > a[href="/"]');
}

function getText(link) {
var saved = link.getAttribute('data-proton-hostname-text');
if (saved)
return saved;

var text = (link.textContent || '').replace(/\s+/g, ' ').trim();
return text || 'OpenWrt';
}

function clearModes(link) {
for (var i = 0; i < MODE_COUNT; i++)
link.classList.remove('proton-hna-mode-' + i);
}

function clearTimer() {
if (TIMER) {
clearInterval(TIMER);
TIMER = null;
}
}

function renderPlain(link, text) {
clearTimer();
clearModes(link);

link.classList.remove('proton-hostname-live');
link.removeAttribute('data-proton-hostname-ready');
link.removeAttribute('data-proton-hna-mode');
link.textContent = text;
}

function splitLetters(link, text) {
var current = '';
var letters = link.querySelectorAll('.proton-host-letter');

for (var i = 0; i < letters.length; i++)
current += letters[i].textContent === '\u00a0' ? ' ' : letters[i].textContent;

if (
link.getAttribute('data-proton-hostname-ready') === '1' &&
current === text &&
letters.length === text.length
) {
link.classList.add('proton-hostname-live');
return;
}

link.setAttribute('data-proton-hostname-text', text);
link.setAttribute('data-proton-hostname-ready', '1');
link.classList.add('proton-hostname-live');

link.textContent = '';

for (var j = 0; j < text.length; j++) {
var s = document.createElement('span');
s.className = 'proton-host-letter';
s.style.setProperty('--i', j);
s.textContent = text[j] === ' ' ? '\u00a0' : text[j];
link.appendChild(s);
}
}

function setMode(link, mode) {
clearModes(link);
link.classList.add('proton-hna-mode-' + mode);
link.setAttribute('data-proton-hna-mode', String(mode));
link.setAttribute('title', 'Hostname animation mode ' + (mode + 1) + '/' + MODE_COUNT);
}

function restartAnimation(link) {
var letters = link.querySelectorAll('.proton-host-letter');

for (var i = 0; i < letters.length; i++) {
letters[i].style.animation = 'none';
void letters[i].offsetHeight;
letters[i].style.animation = '';
}
}

function applyHostnameAnimation() {
var link = getLink();
if (!link)
return;

var text = getText(link);

if (!getEnabled()) {
renderPlain(link, text);
return;
}

splitLetters(link, text);
clearTimer();

var savedMode = getMode();

if (savedMode >= 0) {
setMode(link, savedMode);
restartAnimation(link);
return;
}

var mode = parseInt(link.getAttribute('data-proton-hna-mode') || '0', 10);
if (isNaN(mode) || mode < 0 || mode >= MODE_COUNT)
mode = 0;

setMode(link, mode);
restartAnimation(link);

TIMER = setInterval(function () {
mode = (mode + 1) % MODE_COUNT;
setMode(link, mode);
restartAnimation(link);
}, MODE_MS);
}

window.protonApplyHostnameAnimation = applyHostnameAnimation;

window.addEventListener('proton-hostname-animation-settings-change', applyHostnameAnimation);

window.addEventListener('storage', function (ev) {
if (ev.key === ENABLE_KEY || ev.key === MODE_KEY)
applyHostnameAnimation();
});

if (document.readyState === 'loading')
document.addEventListener('DOMContentLoaded', applyHostnameAnimation);
else
applyHostnameAnimation();

setTimeout(applyHostnameAnimation, 300);
setTimeout(applyHostnameAnimation, 1000);
})();
