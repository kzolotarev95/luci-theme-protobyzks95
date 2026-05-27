#!/bin/sh

REPO_OWNER="${REPO_OWNER:-kzolotarev95}"
REPO_NAME="${REPO_NAME:-luci-theme-protobyzks95}"
BRANCH="${BRANCH:-main}"

STAMP="$(date +%Y%m%d-%H%M%S)"
WORKDIR="/tmp/${REPO_NAME}-install-$$"
TGZ="/tmp/${REPO_NAME}-${BRANCH}-$$.tar.gz"
BACKUP="/root/proton2025-before-install-$STAMP.tar.gz"

echo "[proton2025] cleanup old temp/cache"
rm -rf /tmp/${REPO_NAME}-install-* /tmp/${REPO_NAME}-*.tar.gz /tmp/luci-* /tmp/luci-indexcache*
rm -rf /usr/lib/lua/luci/view/themes/proton2025
find /www/luci-static -maxdepth 1 -type l -name 'proton2025-*' -exec rm -f {} \; 2>/dev/null || true

FREE_KB="$(df -k /overlay 2>/dev/null | awk 'NR==2{print $4+0}')"
if [ -n "$FREE_KB" ] && [ "$FREE_KB" -lt 3072 ]; then
  echo "[proton2025] ERROR: not enough free flash space on /overlay"
  echo "[proton2025] free: ${FREE_KB} KB, need at least 3072 KB"
  df -h /overlay
  exit 1
fi

echo "[proton2025] backup: $BACKUP"

tar -czf "$BACKUP" \
  /www/luci-static/proton2025 \
  /usr/share/ucode/luci/template/themes/proton2025 \
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

CACHE_RESET_SRC="$(find "$WORKDIR" -type f -path '*/root/usr/bin/proton2025-cache-reset' | head -n 1)"

if [ ! -f "$CASCADE_FILE" ] || [ ! -d "$THEME_SRC" ]; then
  echo "[proton2025] ERROR: cascade.css not found in archive"
  find "$WORKDIR" -type f | sed -n '1,120p'
  rm -rf "$WORKDIR" "$TGZ"
  exit 1
fi

echo "[proton2025] theme source: $THEME_SRC"

echo "[proton2025] install static files"
rm -rf /www/luci-static/proton2025
mkdir -p /www/luci-static/proton2025
cp -a "$THEME_SRC/." /www/luci-static/proton2025/ || {
  echo "[proton2025] ERROR: failed to copy static files"
  df -h /overlay
  exit 1
}

if [ -d "$UCODE_SRC" ]; then
  echo "[proton2025] install ucode templates"
  rm -rf /usr/share/ucode/luci/template/themes/proton2025
  mkdir -p /usr/share/ucode/luci/template/themes/proton2025
  cp -a "$UCODE_SRC/." /usr/share/ucode/luci/template/themes/proton2025/ || {
    echo "[proton2025] ERROR: failed to copy ucode templates"
    df -h /overlay
    exit 1
  }
fi

if [ -f "$CACHE_RESET_SRC" ]; then
  echo "[proton2025] install cache reset helper"
  cp -a "$CACHE_RESET_SRC" /usr/bin/proton2025-cache-reset
  chmod +x /usr/bin/proton2025-cache-reset
fi

echo "[proton2025] register theme in LuCI"
uci -q get luci.themes >/dev/null 2>&1 || uci set luci.themes='internal'
uci set luci.themes.ProtoByZKS95='/luci-static/proton2025'
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

echo "[proton2025] final theme name cleanup"
uci -q delete luci.themes.Proton2025 2>/dev/null || true
uci set luci.themes.ProtoByZKS95="/luci-static/proton2025"
uci set luci.main.mediaurlbase="/luci-static/proton2025"
uci commit luci

echo "[proton2025] installed OK"
echo "[proton2025] active mediaurlbase:"
uci get luci.main.mediaurlbase 2>/dev/null || true
echo "[proton2025] registered themes:"
uci show luci.themes 2>/dev/null || true
echo "[proton2025] backup:"
cat /root/LAST-proton2025-install-backup.txt
