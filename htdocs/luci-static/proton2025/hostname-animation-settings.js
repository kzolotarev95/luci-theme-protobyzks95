(function () {
'use strict';

var ENABLE_KEY = 'protonHostnameLiveEnabled';
var MODE_KEY = 'protonHostnameLiveMode';

var labels = [
'1. Волна',
'2. Вращение',
'3. Fade / Blur',
'4. Flip 3D',
'5. Падение',
'6. Сдвиг',
'7. Тряска',
'8. Неон',
'9. Вспышка',
'10. Дыхание',
'11. Bounce',
'12. Плавание',
'13. Swing',
'14. Zoom Twist',
'15. Glitch',
'16. Pulse Rotate',
'17. Roll Up',
'18. Rise Fade',
'19. Wobble',
'20. Skew Wave'
];

function getEnabled() {
return localStorage.getItem(ENABLE_KEY) !== '0';
}

function getMode() {
var value = parseInt(localStorage.getItem(MODE_KEY) || '-1', 10);

if (isNaN(value) || value < -1 || value > 19)
value = -1;

return value;
}

function fireChange() {
window.dispatchEvent(new CustomEvent('proton-hostname-animation-settings-change'));

if (typeof window.protonApplyHostnameAnimation === 'function')
window.protonApplyHostnameAnimation();
}

function buildOptions() {
var html = '<option value="-1">Авто: 20 режимов по кругу</option>';

for (var i = 0; i < labels.length; i++)
html += '<option value="' + i + '">' + labels[i] + '</option>';

return html;
}

function makeBlock() {
var root = document.getElementById('proton-theme-settings');

if (!root)
return;

if (document.getElementById('proton-hostname-animation-check'))
return;

var block = document.createElement('div');
block.className = 'cbi-value proton-hostname-animation-setting';
block.innerHTML =
'<label class="cbi-value-title" for="proton-hostname-animation-check">Анимация имени роутера</label>' +
'<div class="cbi-value-field">' +
'<div class="cbi-checkbox">' +
'<input id="proton-hostname-animation-check" type="checkbox">' +
'<label for="proton-hostname-animation-check"></label>' +
'</div>' +
'<select id="proton-hostname-animation-mode" class="cbi-input-select">' +
buildOptions() +
'</select>' +
'<div class="cbi-value-description">Выбор режима анимации текста в золотой карточке hostname.</div>' +
'</div>';

var anchor =
document.getElementById('proton-header-animation-check') ||
document.getElementById('proton-animations-check') ||
document.getElementById('proton-radius-select') ||
document.getElementById('proton-accent-select');

var anchorValue = anchor ? anchor.closest('.cbi-value') : null;

if (anchorValue && anchorValue.parentNode)
anchorValue.parentNode.insertBefore(block, anchorValue.nextSibling);
else
root.appendChild(block);

var check = document.getElementById('proton-hostname-animation-check');
var select = document.getElementById('proton-hostname-animation-mode');

check.checked = getEnabled();
select.value = String(getMode());
select.disabled = !check.checked;

check.addEventListener('change', function () {
localStorage.setItem(ENABLE_KEY, check.checked ? '1' : '0');
select.disabled = !check.checked;
fireChange();
});

select.addEventListener('change', function () {
localStorage.setItem(MODE_KEY, String(parseInt(select.value, 10)));
fireChange();
});
}

if (document.readyState === 'loading')
document.addEventListener('DOMContentLoaded', makeBlock);
else
makeBlock();

setTimeout(makeBlock, 500);
setTimeout(makeBlock, 1500);
})();
