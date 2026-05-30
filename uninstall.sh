#!/bin/sh

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="/root/proton2025-before-uninstall-$STAMP.tar.gz"

echo "[proton2025] backup before uninstall: $BACKUP"

tar -czf "$BACKUP" \
  /www/luci-static/proton2025 \
  /usr/share/ucode/luci/template/themes/proton2025 \
  /etc/config/luci \
  /usr/bin/proton2025-cache-reset 2>/tmp/proton2025-uninstall-backup-warnings.log || true

echo "$BACKUP" > /root/LAST-proton2025-uninstall-backup.txt

echo "[proton2025] switch LuCI theme to bootstrap"
uci set luci.main.mediaurlbase='/luci-static/bootstrap'

echo "[proton2025] unregister theme"
uci -q delete luci.themes.Proton2025 2>/dev/null || true
uci -q delete luci.themes.ProtoByZKS95 2>/dev/null || true
uci commit luci

echo "[proton2025] remove files"
rm -rf /www/luci-static/proton2025
find /www/luci-static -maxdepth 1 -type l -name 'proton2025-*' -exec rm -f {} \; 2>/dev/null || true
rm -rf /usr/share/ucode/luci/template/themes/proton2025
rm -rf /usr/lib/lua/luci/view/themes/proton2025
rm -f /usr/bin/proton2025-cache-reset
rm -f /www/luci-static/resources/menu-proton2025.js

echo "[proton2025] clear LuCI cache"
rm -rf /tmp/luci-* /tmp/luci-indexcache*

echo "[proton2025] restart services"
/etc/init.d/rpcd restart 2>/dev/null || true
/etc/init.d/uhttpd restart 2>/dev/null || true

echo "[proton2025] uninstalled OK"
echo "[proton2025] backup:"
cat /root/LAST-proton2025-uninstall-backup.txt


# PROTON_STATUS_CARDS_UNINSTALL_V939_BEGIN
echo "[proton2025] remove status cards helper v939"
sed -i '/proton2025-status-json-write/d' /etc/crontabs/root 2>/dev/null || true
rm -f /usr/bin/proton2025-status-json-write /www/luci-static/proton2025/status.json
/etc/init.d/cron restart 2>/dev/null || true
# PROTON_STATUS_CARDS_UNINSTALL_V939_END

# PROTON_STATUS_CARDS_WAIT_OVERVIEW_V946_UNINSTALL_BEGIN
echo "[proton2025] remove status cards wait overview v946"
rm -f /www/luci-static/proton2025/status-cards-runtime-v946.js
# PROTON_STATUS_CARDS_WAIT_OVERVIEW_V946_UNINSTALL_END

# PROTON_STATUS_CARDS_SPA_WATCH_V947_UNINSTALL_BEGIN
echo "[proton2025] remove status cards spa watch v947"
rm -f /www/luci-static/proton2025/status-cards-runtime-v947.js
# PROTON_STATUS_CARDS_SPA_WATCH_V947_UNINSTALL_END

# PROTON_STATUS_CARDS_LOGIN_STATUS_V948_UNINSTALL_BEGIN
echo "[proton2025] remove status cards login status v948"
rm -f /www/luci-static/proton2025/status-cards-runtime-v948.js
# PROTON_STATUS_CARDS_LOGIN_STATUS_V948_UNINSTALL_END

# PROTON_STATUS_CARDS_CONTENT_DETECT_V949_UNINSTALL_BEGIN
echo "[proton2025] remove status cards content detect v949"
rm -f /www/luci-static/proton2025/status-cards-runtime-v949.js
# PROTON_STATUS_CARDS_CONTENT_DETECT_V949_UNINSTALL_END
