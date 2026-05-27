(function () {
'use strict';

var KEY = 'protonLoginLogoText';
var DEFAULT_TEXT = 'by kzolotarev95';

function getText() {
var value = localStorage.getItem(KEY);
if (!value || !value.trim())
value = DEFAULT_TEXT;
return value.trim();
}

function apply() {
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

badge.classList.add('proton-login-logo-animated');
badge.textContent = getText();
badge.title = getText();
badge.setAttribute('aria-label', getText());
}

if (document.readyState === 'loading')
document.addEventListener('DOMContentLoaded', apply);
else
apply();

setTimeout(apply, 300);
setTimeout(apply, 1000);
setTimeout(apply, 2000);
})();
