#!/bin/sh
# PROTON2025_CLEAN_INSTALLER_NO_WIDGETS_V917

set -u

REPO_OWNER="${REPO_OWNER:-kzolotarev95}"
REPO_NAME="${REPO_NAME:-luci-theme-protobyzks95}"
REPO_REF="${REPO_REF:-main}"

TS="$(date +%Y%m%d-%H%M%S)"
PID="$$"

WORKDIR="/tmp/${REPO_NAME}-install-${PID}"
TGZ="/tmp/${REPO_NAME}-${REPO_REF}-${PID}.tar.gz"
BACKUP="/root/proton2025-before-install-${TS}.tar.gz"

THEME_DST="/www/luci-static/proton2025"
RES_DST="/www/luci-static/resources"
UCODE_DST="/usr/share/ucode/luci/template/themes/proton2025"
CACHE_RESET="/usr/bin/proton2025-cache-reset"

URL="https://github.com/${REPO_OWNER}/${REPO_NAME}/archive/${REPO_REF}.tar.gz"

say() {
echo "[proton2025] $*"
}

fail() {
echo "[proton2025] ERROR: $*" >&2
rm -rf "$WORKDIR" "$TGZ" 2>/dev/null || true
exit 1
}

say "cleanup old widget/temp runtime"

rm -f "$THEME_DST/services-widget.js"
rm -f "$THEME_DST/service-widget.js"
rm -f "$THEME_DST/temp-grid-observer.js"
rm -f "$THEME_DST/temp-grid-polish.js"
rm -f "$THEME_DST/temp-grid-static.js"
rm -f "$THEME_DST/temp-grid-native.js"
rm -f "$THEME_DST/native-temp-fill.js"
rm -f "$THEME_DST/temperature-widget.js"
rm -f "$THEME_DST/temperature-inline-fix.js"
rm -f "$THEME_DST/load-widget.js"
rm -f "$THEME_DST/log-widget.js"
rm -f "$THEME_DST/widgets.js"
rm -f "$THEME_DST/system-widgets.js"
rm -f "$THEME_DST/widget-settings-cleaner.js"
rm -f "$THEME_DST/temperature.json"
rm -f /usr/bin/proton2025-temperature-json

sed -i '/proton2025-temperature-json/d' /etc/crontabs/root 2>/dev/null || true
/etc/init.d/cron restart 2>/dev/null || true

say "backup: $BACKUP"

tar -czf "$BACKUP" \
"$THEME_DST" \
"$RES_DST/menu-proton2025.js" \
"$UCODE_DST" \
/etc/config/luci \
"$CACHE_RESET" 2>/tmp/proton2025-install-backup-warnings.log || true

rm -rf "$WORKDIR" "$TGZ"
mkdir -p "$WORKDIR"

say "download: $URL"

wget -O "$TGZ" "${URL}?v=$(date +%s)" || fail "download failed"

tar -xzf "$TGZ" -C "$WORKDIR" || fail "extract failed"

THEME_SRC="$(find "$WORKDIR" -type d -path '*/htdocs/luci-static/proton2025' | head -n 1)"
UCODE_SRC="$(find "$WORKDIR" -type d -path '*/ucode/template/themes/proton2025' | head -n 1)"
RESOURCE_SRC="$(find "$WORKDIR" -type d -path '*/htdocs/luci-static/resources' | head -n 1)"
CACHE_RESET_SRC="$(find "$WORKDIR" -type f -path '*/root/usr/bin/proton2025-cache-reset' | head -n 1)"

[ -n "$THEME_SRC" ] || fail "theme source not found"
[ -n "$UCODE_SRC" ] || fail "ucode templates not found"

say "theme source: $THEME_SRC"

say "install static files"
rm -rf "$THEME_DST"
mkdir -p "$THEME_DST"
cp -a "$THEME_SRC/." "$THEME_DST/"

say "install ucode templates"
rm -rf "$UCODE_DST"
mkdir -p "$UCODE_DST"
cp -a "$UCODE_SRC/." "$UCODE_DST/"

say "install LuCI shared resources"
if [ -n "$RESOURCE_SRC" ]; then
mkdir -p "$RES_DST"
cp -a "$RESOURCE_SRC/." "$RES_DST/"
else
say "WARNING: shared resources directory not found"
fi

say "install cache reset helper"
if [ -n "$CACHE_RESET_SRC" ]; then
cp -a "$CACHE_RESET_SRC" "$CACHE_RESET"
chmod +x "$CACHE_RESET"
else
say "WARNING: cache reset helper not found"
fi

say "final cleanup widget leftovers"

rm -f "$THEME_DST/services-widget.js"
rm -f "$THEME_DST/service-widget.js"
rm -f "$THEME_DST/temp-grid-observer.js"
rm -f "$THEME_DST/temp-grid-polish.js"
rm -f "$THEME_DST/temp-grid-static.js"
rm -f "$THEME_DST/temp-grid-native.js"
rm -f "$THEME_DST/native-temp-fill.js"
rm -f "$THEME_DST/temperature-widget.js"
rm -f "$THEME_DST/temperature-inline-fix.js"
rm -f "$THEME_DST/load-widget.js"
rm -f "$THEME_DST/log-widget.js"
rm -f "$THEME_DST/widgets.js"
rm -f "$THEME_DST/system-widgets.js"
rm -f "$THEME_DST/widget-settings-cleaner.js"
rm -f "$THEME_DST/temperature.json"
rm -f /usr/bin/proton2025-temperature-json

find "$UCODE_DST" -type f 2>/dev/null | while read F; do
sed -i \
-e '/services-widget\.js/d' \
-e '/service-widget\.js/d' \
-e '/temp-grid-observer\.js/d' \
-e '/temp-grid-polish\.js/d' \
-e '/temp-grid-static\.js/d' \
-e '/temp-grid-native\.js/d' \
-e '/native-temp-fill\.js/d' \
-e '/temperature-widget\.js/d' \
-e '/temperature-inline-fix\.js/d' \
-e '/load-widget\.js/d' \
-e '/log-widget\.js/d' \
-e '/widgets\.js/d' \
-e '/system-widgets\.js/d' \
-e '/widget-settings-cleaner\.js/d' \
"$F" 2>/dev/null || true
done

sed -i '/proton2025-temperature-json/d' /etc/crontabs/root 2>/dev/null || true
/etc/init.d/cron restart 2>/dev/null || true

say "register theme in LuCI"

uci -q delete luci.themes.Proton2025 2>/dev/null || true
uci set luci.themes.ProtoByZKS95='/luci-static/proton2025'
uci set luci.main.mediaurlbase='/luci-static/proton2025'
uci commit luci

say "clear LuCI/browser cache safely"

rm -rf /tmp/luci-* /tmp/luci-indexcache* 2>/dev/null || true

if [ -x "$CACHE_RESET" ]; then
"$CACHE_RESET" 2>/dev/null || true
fi

/etc/init.d/rpcd restart 2>/dev/null || true
/etc/init.d/uhttpd restart 2>/dev/null || true

say "active mediaurlbase:"
uci get luci.main.mediaurlbase 2>/dev/null || true

say "registered themes:"
uci show luci | grep '^luci.themes' || true

say "installed OK"
say "backup:"
echo "$BACKUP"

rm -rf "$WORKDIR" "$TGZ" 2>/dev/null || true
