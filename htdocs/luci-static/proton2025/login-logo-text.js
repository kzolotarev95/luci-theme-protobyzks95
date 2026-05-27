(function () {
'use strict';

var KEY = 'protonLoginLogoText';
var DEFAULT_TEXT = 'by kzolotarev95';

function text() {
var value = localStorage.getItem(KEY);
if (!value || !value.trim())
value = DEFAULT_TEXT;
return value.trim();
}

function save(value) {
value = (value || '').trim();
if (!value)
value = DEFAULT_TEXT;

localStorage.setItem(KEY, value);
localStorage.setItem('proton2025CacheStamp', String(Date.now()));
applyLoginLogo();
}

function applyLoginLogo() {
var header = document.querySelector('.login-header');
if (!header)
return;

var logos = header.querySelectorAll('.login-logo, svg.login-logo');
for (var i = 0; i < logos.length; i++)
logos[i].style.display = 'none';

var badge = header.querySelector('.proton-login-custom-logo');
if (!badge) {
badge = document.createElement('div');
badge.className = 'proton-login-custom-logo';
header.appendChild(badge);
}

badge.textContent = text();
badge.title = text();
badge.setAttribute('aria-label', text());
}

function makeSettings() {
var root = document.getElementById('proton-theme-settings');
if (!root)
return;

if (document.getElementById('proton-login-logo-text'))
return;

var block = document.createElement('div');
block.className = 'cbi-value proton-login-logo-setting';
block.innerHTML =
'<label class="cbi-value-title" for="proton-login-logo-text">Текст логотипа входа</label>' +
'<div class="cbi-value-field">' +
'<input id="proton-login-logo-text" class="cbi-input-text" type="text">' +
'<button type="button" id="proton-login-logo-save" class="cbi-button cbi-button-save">Сохранить</button>' +
'<button type="button" id="proton-login-logo-reset" class="cbi-button">Сброс</button>' +
'<div class="cbi-value-description">Меняет надпись вместо Proton2025 logo на странице входа. После сохранения открой login через Ctrl+F5.</div>' +
'</div>';

var anchor =
document.getElementById('proton-hostname-animation-check') ||
document.getElementById('proton-header-animation-check') ||
document.getElementById('proton-animations-check') ||
document.getElementById('proton-accent-select');

var anchorValue = anchor ? anchor.closest('.cbi-value') : null;

if (anchorValue && anchorValue.parentNode)
anchorValue.parentNode.insertBefore(block, anchorValue.nextSibling);
else
root.appendChild(block);

var input = document.getElementById('proton-login-logo-text');
var btnSave = document.getElementById('proton-login-logo-save');
var btnReset = document.getElementById('proton-login-logo-reset');

input.value = text();

btnSave.addEventListener('click', function () {
save(input.value);
btnSave.textContent = 'Сохранено';
setTimeout(function () { btnSave.textContent = 'Сохранить'; }, 900);
});

btnReset.addEventListener('click', function () {
save(DEFAULT_TEXT);
input.value = DEFAULT_TEXT;
});

input.addEventListener('input', function () {
save(input.value);
});

input.addEventListener('keydown', function (ev) {
if (ev.key === 'Enter') {
ev.preventDefault();
save(input.value);
}
});
}

function boot() {
applyLoginLogo();
makeSettings();
}

window.addEventListener('storage', function (ev) {
if (ev.key === KEY)
applyLoginLogo();
});

if (document.readyState === 'loading')
document.addEventListener('DOMContentLoaded', boot);
else
boot();

setTimeout(boot, 300);
setTimeout(boot, 1000);
})();
