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

Репозиторий:

```text
kzolotarev95/luci-theme-protobyzks95
```

---

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

## Автоматический сброс кэша браузера

После установки тема автоматически заставляет браузер загрузить свежие CSS и JS файлы.

Для этого используется versioned media path:

```text
/luci-static/proton2025-1779831234
```

Это помогает избежать ситуации, когда браузер продолжает использовать старые закэшированные файлы темы.

Устанавливается helper:

```sh
proton2025-cache-reset
```

Ручной сброс кэша:

```sh
proton2025-cache-reset
```

---

## Установка

### Публичная репа

```sh
wget -O- "https://raw.githubusercontent.com/kzolotarev95/luci-theme-protobyzks95/main/install.sh?v=$(date +%s)" | sh
```

### Приватная репа с GitHub token

```sh
read -s -p "GitHub token: " GH_TOKEN
echo
export GH_TOKEN

wget --header="Authorization: Bearer $GH_TOKEN" \
  -O /tmp/proton2025-install.sh \
  "https://raw.githubusercontent.com/kzolotarev95/luci-theme-protobyzks95/main/install.sh?v=$(date +%s)" && \
sh /tmp/proton2025-install.sh

unset GH_TOKEN
rm -f /tmp/proton2025-install.sh
```

---

## Удаление

### Публичная репа

```sh
wget -O- "https://raw.githubusercontent.com/kzolotarev95/luci-theme-protobyzks95/main/uninstall.sh?v=$(date +%s)" | sh
```

### Приватная репа с GitHub token

```sh
read -s -p "GitHub token: " GH_TOKEN
echo
export GH_TOKEN

wget --header="Authorization: Bearer $GH_TOKEN" \
  -O /tmp/proton2025-uninstall.sh \
  "https://raw.githubusercontent.com/kzolotarev95/luci-theme-protobyzks95/main/uninstall.sh?v=$(date +%s)" && \
sh /tmp/proton2025-uninstall.sh

unset GH_TOKEN
rm -f /tmp/proton2025-uninstall.sh
```

---

## Что делает `install.sh`

Установщик:

1. Создаёт бэкап текущей темы LuCI
2. Скачивает архив этого GitHub-репозитория
3. Находит `cascade.css` внутри архива
4. Устанавливает static-файлы темы в:

```text
/www/luci-static/proton2025
```

5. Устанавливает ucode-шаблоны в:

```text
/usr/share/ucode/luci/template/themes/proton2025
```

6. Устанавливает Lua-шаблоны, если они есть:

```text
/usr/lib/lua/luci/view/themes/proton2025
```

7. Устанавливает helper сброса кэша:

```text
/usr/bin/proton2025-cache-reset
```

8. Активирует тему:

```sh
uci set luci.main.mediaurlbase='/luci-static/proton2025'
uci commit luci
```

9. Делает автоматический browser cache bust
10. Чистит LuCI cache
11. Перезапускает сервисы:

```sh
/etc/init.d/rpcd restart
/etc/init.d/uhttpd restart
```

---

## Что делает `uninstall.sh`

Удалятор:

1. Создаёт бэкап перед удалением темы
2. Переключает LuCI обратно на Bootstrap:

```sh
uci set luci.main.mediaurlbase='/luci-static/bootstrap'
uci commit luci
```

3. Удаляет файлы темы:

```text
/www/luci-static/proton2025
/usr/share/ucode/luci/template/themes/proton2025
/usr/lib/lua/luci/view/themes/proton2025
/usr/bin/proton2025-cache-reset
```

4. Удаляет versioned cache symlinks:

```text
/www/luci-static/proton2025-*
```

5. Чистит LuCI cache
6. Перезапускает `rpcd` и `uhttpd`

---

## Бэкапы

Перед установкой создаётся:

```text
/root/proton2025-before-install-YYYYMMDD-HHMMSS.tar.gz
```

Файл с путём последнего install-бэкапа:

```text
/root/LAST-proton2025-install-backup.txt
```

Перед удалением создаётся:

```text
/root/proton2025-before-uninstall-YYYYMMDD-HHMMSS.tar.gz
```

Файл с путём последнего uninstall-бэкапа:

```text
/root/LAST-proton2025-uninstall-backup.txt
```

---

## Откат после установки

```sh
tar -xzf "$(cat /root/LAST-proton2025-install-backup.txt)" -C /

rm -rf /tmp/luci-* /tmp/luci-indexcache*
/etc/init.d/rpcd restart
/etc/init.d/uhttpd restart
```

---

## Откат после удаления

```sh
tar -xzf "$(cat /root/LAST-proton2025-uninstall-backup.txt)" -C /

rm -rf /tmp/luci-* /tmp/luci-indexcache*
/etc/init.d/rpcd restart
/etc/init.d/uhttpd restart
```

---

## Проверка установки

```sh
uci get luci.main.mediaurlbase
ls -la /www/luci-static | grep 'proton2025'
ls -lah /www/luci-static/proton2025 | head
```

Ожидаемый пример:

```text
/luci-static/proton2025-1779831234
proton2025
proton2025-1779831234 -> /www/luci-static/proton2025
```

---

## Логи

```sh
logread | grep -Ei 'rpcd|uhttpd|luci|404|SyntaxError|TypeError|proton' | tail -n 160
```

Live logs:

```sh
logread -f
```

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
│           ├── services-widget.js
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

---

## Основные файлы

### `cascade.css`

Главный CSS-файл темы.

Содержит:

- базовый стиль Proton2025
- золотую обводку hostname
- стили логотипа входа
- цвета progressbar
- скрытие footer
- дополнительные визуальные правки интерфейса

### `hostname-live-20.js`

Анимация имени роутера в шапке.

### `hostname-animation-settings.js`

Добавляет выбор режима анимации hostname в настройки темы.

### `login-logo-text.js`

Позволяет менять текст логотипа входа через настройки темы.

### `login-logo-animation-fix.js`

Добавляет анимацию кастомному логотипу входа.

### `progressbar-3colors.js`

Добавляет зелёный, жёлтый и красный цвета для progressbar.

### `proton2025-cache-reset`

Сбрасывает LuCI cache и заставляет браузер загрузить свежие файлы темы.

---

## Совместимость

Проверялось на:

```text
OpenWrt 24.10.4
LuCI 25.x
uhttpd
rpcd
```

---

## Автор

Custom build by:

```text
kzolotarev95
```

GitHub:

```text
https://github.com/kzolotarev95
```

---

## Важно

Это кастомная пользовательская сборка темы Proton2025.

Установщик автоматически создаёт бэкапы, но перед установкой кастомных тем всё равно рекомендуется иметь полный backup роутера.
