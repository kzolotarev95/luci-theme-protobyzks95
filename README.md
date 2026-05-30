<p align="center">
  <img src="htdocs/luci-static/proton2025/logo.svg" width="120" alt="Proto by ZKS95">
</p>

<h1 align="center">LuCI Theme Proto by ZKS95</h1>

<p align="center">
  Кастомная тема для OpenWrt LuCI на базе Proton2025: золотой интерфейс, анимированное имя роутера, изменяемый логотип входа, 3-цветные индикаторы и автоматический сброс кэша.
</p>

<p align="center">
  <img alt="OpenWrt" src="https://img.shields.io/badge/OpenWrt-24.10.x-blue?style=for-the-badge">
  <img alt="LuCI" src="https://img.shields.io/badge/LuCI-25.x-green?style=for-the-badge">
  <img alt="Theme" src="https://img.shields.io/badge/Theme-Proton2025%20Custom-gold?style=for-the-badge">
  <img alt="Author" src="https://img.shields.io/badge/by-kzolotarev95-black?style=for-the-badge">
</p>

---

## Описание

**LuCI Theme Proto by ZKS95** — это кастомная тема для OpenWrt LuCI, сделанная на базе Proton2025.

Тема добавляет современный тёмный интерфейс, золотые акценты, анимацию имени роутера, настраиваемый логотип страницы входа, цветные progressbar-индикаторы и автоматический сброс кэша браузера после установки.

## Установка

```sh
wget -O- "https://raw.githubusercontent.com/kzolotarev95/luci-theme-protobyzks95/main/install.sh?v=$(date +%s)" | sh
```


## Удаление

```sh
wget -O- "https://raw.githubusercontent.com/kzolotarev95/luci-theme-protobyzks95/main/uninstall.sh?v=$(date +%s)" | sh
```


## Возможности

### Современный интерфейс Proton2025

- Тёмный интерфейс в стиле Proton2025
- Золотые визуальные акценты
- Улучшенные карточки и блоки интерфейса
- Чистый внешний вид LuCI
- Скрытие стандартного footer-блока LuCI / OpenWrt / Proton2025
- Поддержка русского интерфейса
- Работа через стандартные `uhttpd` и `rpcd`

---

## Анимированное имя роутера

Стандартный блок имени роутера:

```html
<span class="hostname"><a href="/">WBR3000UAX</a></span>
```

доработан и получает:

- Чёткую золотую обводку
- Мягкое золотое свечение
- Анимацию текста
- 20 режимов анимации
- Автоматическое переключение режимов по кругу
- Выбор режима через настройки темы

### Режимы анимации hostname

1. Волна
2. Вращение
3. Fade / Blur
4. Flip 3D
5. Падение
6. Сдвиг
7. Тряска
8. Неон
9. Вспышка
10. Дыхание
11. Bounce
12. Плавание
13. Swing
14. Zoom Twist
15. Glitch
16. Pulse Rotate
17. Roll Up
18. Rise Fade
19. Wobble
20. Skew Wave

---

## Настройки темы

В настройки Proton2025 добавлены дополнительные параметры:

- Включение / выключение анимации имени роутера
- Выбор режима анимации hostname
- Авто-режим с 20 эффектами по кругу
- Изменение текста логотипа входа
- Сохранение настроек в браузере через `localStorage`

---

## Кастомный логотип страницы входа

Стандартный SVG-логотип Proton2025 на странице входа заменяется на кастомную текстовую плашку.

Текст по умолчанию:

```text
by kzolotarev95
```

Возможности:

- Изменение текста через настройки темы
- Сохранение текста в браузере
- Золотой стиль плашки
- Мягкая анимация
- Автоматическое скрытие стандартного логотипа Proton2025

---

## 3-цветные progressbar-индикаторы

LuCI progressbar получает цветовую индикацию:

```html
<div class="cbi-progressbar" title="319.05 MiB / 485.76 MiB (65%)">
  <div style="width:65.00%"></div>
</div>
```

Цвета:

| Цвет | Значение |
|---|---|
| Зелёный | Норма |
| Жёлтый | Средняя нагрузка |
| Красный | Высокая / критичная нагрузка |

Особенности:

- Для строки `Свободно`: больше свободной памяти = зелёный цвет
- Для остальных значений: чем выше процент, тем хуже
- Цвет применяется только к заполнению progressbar
- Строки таблиц не перекрашиваются
- Нет мигания при обновлении данных

---

## Структура проекта

```text
.
├── htdocs/
│   └── luci-static/
│       └── proton2025/
│           ├── cascade.css
│           ├── hostname-live-20.js
│           ├── hostname-animation-settings.js
│           ├── login-logo-text.js
│           ├── login-logo-animation-fix.js
│           ├── progressbar-3colors.js
│           ├── settings-sync.js
│           ├── translations.js
│           ├── icons/
│           └── fonts/
│
├── ucode/
│   └── template/
│       └── themes/
│           └── proton2025/
│               ├── header.ut
│               ├── footer.ut
│               └── sysauth.ut
│
├── root/
│   └── usr/
│       └── bin/
│           └── proton2025-cache-reset
│
├── install.sh
├── uninstall.sh
└── README.md
```


## Совместимость

Проверялось на:

```text
OpenWrt 24.10.4
LuCI 25.x
uhttpd
rpcd
```
