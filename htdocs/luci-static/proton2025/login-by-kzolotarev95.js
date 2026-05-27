(function () {
'use strict';

function applyLoginBrand() {
var header = document.querySelector('.login-header');
if (!header)
return;

var logo = header.querySelector('.login-logo');
if (logo)
logo.style.display = 'none';

if (!header.querySelector('.proton-login-by')) {
var badge = document.createElement('div');
badge.className = 'proton-login-by';
badge.setAttribute('aria-label', 'by kzolotarev95');
header.appendChild(badge);
}
}

if (document.readyState === 'loading')
document.addEventListener('DOMContentLoaded', applyLoginBrand);
else
applyLoginBrand();

setTimeout(applyLoginBrand, 300);
setTimeout(applyLoginBrand, 1000);
})();
