#!/bin/sh

REPO_OWNER="${REPO_OWNER:-kzolotarev95}"
REPO_NAME="${REPO_NAME:-luci-theme-protobyzks95}"
BRANCH="${BRANCH:-main}"

STAMP="$(date +%Y%m%d-%H%M%S)"
WORKDIR="/tmp/${REPO_NAME}-install-$$"
TGZ="/tmp/${REPO_NAME}-${BRANCH}-$$.tar.gz"
BACKUP="/root/proton2025-before-install-$STAMP.tar.gz"

echo "[proton2025] backup: $BACKUP"

tar -czf "$BACKUP" \
  /www/luci-static/proton2025 \
  /www/luci-static/proton2025-* \
  /usr/share/ucode/luci/template/themes/proton2025 \
  /usr/lib/lua/luci/view/themes/proton2025 \
  /etc/config/luci \
  /usr/bin/proton2025-cache-reset 2>/tmp/proton2025-install-backup-warnings.log || true

echo "$BACKUP" > /root/LAST-proton2025-install-backup.txt

rm -rf "$WORKDIR" "$TGZ"
mkdir -p "$WORKDIR"

URL="https://github.com/$REPO_OWNER/$REPO_NAME/archive/refs/heads/$BRANCH.tar.gz"

echo "[proton2025] download: $URL"

if [ -n "${GH_TOKEN:-}" ]; then
  wget --header="Authorization: Bearer $GH_TOKEN" -O "$TGZ" "$URL?v=$(date +%s)"
else
  wget -O "$TGZ" "$URL?v=$(date +%s)"
fi

if [ ! -s "$TGZ" ]; then
  echo "[proton2025] ERROR: download failed"
  rm -rf "$WORKDIR" "$TGZ"
  exit 1
fi

tar -xzf "$TGZ" -C "$WORKDIR"

CASCADE_FILE="$(find "$WORKDIR" -type f -path '*/htdocs/luci-static/proton2025/cascade.css' | head -n 1)"
THEME_SRC="$(dirname "$CASCADE_FILE" 2>/dev/null)"

UCODE_HEADER="$(find "$WORKDIR" -type f -path '*/ucode/template/themes/proton2025/header.ut' | head -n 1)"
UCODE_SRC="$(dirname "$UCODE_HEADER" 2>/dev/null)"

LUA_HEADER="$(find "$WORKDIR" -type f -path '*/luasrc/view/themes/proton2025/header.htm' | head -n 1)"
LUA_SRC="$(dirname "$LUA_HEADER" 2>/dev/null)"

CACHE_RESET_SRC="$(find "$WORKDIR" -type f -path '*/root/usr/bin/proton2025-cache-reset' | head -n 1)"

if [ ! -f "$CASCADE_FILE" ] || [ ! -d "$THEME_SRC" ]; then
  echo "[proton2025] ERROR: cascade.css not found in archive"
  echo "[proton2025] archive files sample:"
  find "$WORKDIR" -type f | sed -n '1,120p'
  rm -rf "$WORKDIR" "$TGZ"
  exit 1
fi

echo "[proton2025] theme source: $THEME_SRC"

echo "[proton2025] install static files"
rm -rf /www/luci-static/proton2025
find /www/luci-static -maxdepth 1 -type l -name 'proton2025-*' -exec rm -f {} \; 2>/dev/null || true

mkdir -p /www/luci-static/proton2025
cp -a "$THEME_SRC/." /www/luci-static/proton2025/

if [ -d "$UCODE_SRC" ]; then
  echo "[proton2025] install ucode templates"
  rm -rf /usr/share/ucode/luci/template/themes/proton2025
  mkdir -p /usr/share/ucode/luci/template/themes/proton2025
  cp -a "$UCODE_SRC/." /usr/share/ucode/luci/template/themes/proton2025/
fi

if [ -d "$LUA_SRC" ]; then
  echo "[proton2025] install lua templates"
  rm -rf /usr/lib/lua/luci/view/themes/proton2025
  mkdir -p /usr/lib/lua/luci/view/themes/proton2025
  cp -a "$LUA_SRC/." /usr/lib/lua/luci/view/themes/proton2025/
fi

if [ -f "$CACHE_RESET_SRC" ]; then
  echo "[proton2025] install cache reset helper"
  cp -a "$CACHE_RESET_SRC" /usr/bin/proton2025-cache-reset
  chmod +x /usr/bin/proton2025-cache-reset
else
  echo "[proton2025] WARNING: cache reset helper not found in archive"
fi

echo "[proton2025] register theme in LuCI theme list"
uci -q get luci.themes >/dev/null 2>&1 || uci set luci.themes="internal"
uci set luci.themes.ProtoByZKS95="/luci-static/proton2025"

echo "[proton2025] set active LuCI theme"
uci set luci.main.mediaurlbase='/luci-static/proton2025'
uci commit luci

echo "[proton2025] clear LuCI/browser cache safely"
if command -v proton2025-cache-reset >/dev/null 2>&1; then
  proton2025-cache-reset
else
  rm -rf /tmp/luci-* /tmp/luci-indexcache*
  /etc/init.d/rpcd restart 2>/dev/null || true
  /etc/init.d/uhttpd restart 2>/dev/null || true
fi

rm -rf "$WORKDIR" "$TGZ"

echo "[proton2025] installed OK"
echo "[proton2025] active mediaurlbase:"
uci get luci.main.mediaurlbase 2>/dev/null || true
echo "[proton2025] backup:"
cat /root/LAST-proton2025-install-backup.txt
