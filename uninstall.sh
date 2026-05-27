#!/bin/sh

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="/root/proton2025-before-uninstall-$STAMP.tar.gz"

echo "[proton2025] backup before uninstall: $BACKUP"

tar -czf "$BACKUP" \
  /www/luci-static/proton2025 \
  /www/luci-static/proton2025-* \
  /usr/share/ucode/luci/template/themes/proton2025 \
  /usr/lib/lua/luci/view/themes/proton2025 \
  /etc/config/luci \
  /usr/bin/proton2025-cache-reset 2>/tmp/proton2025-uninstall-backup-warnings.log || true

echo "$BACKUP" > /root/LAST-proton2025-uninstall-backup.txt

echo "[proton2025] switch LuCI theme to bootstrap"
echo "[proton2025] unregister theme from LuCI theme list"
uci -q delete luci.themes.ProtoByZKS95 2>/dev/null || true
uci set luci.main.mediaurlbase='/luci-static/bootstrap'
uci commit luci

echo "[proton2025] remove Proton2025 files"
rm -rf /www/luci-static/proton2025
find /www/luci-static -maxdepth 1 -type l -name 'proton2025-*' -exec rm -f {} \; 2>/dev/null || true
rm -rf /usr/share/ucode/luci/template/themes/proton2025
rm -rf /usr/lib/lua/luci/view/themes/proton2025
rm -f /usr/bin/proton2025-cache-reset

echo "[proton2025] clear LuCI cache"
rm -rf /tmp/luci-* /tmp/luci-indexcache*

echo "[proton2025] restart services"
/etc/init.d/rpcd restart 2>/dev/null || true
/etc/init.d/uhttpd restart 2>/dev/null || true

echo "[proton2025] uninstalled OK"
echo "[proton2025] backup:"
cat /root/LAST-proton2025-uninstall-backup.txt
