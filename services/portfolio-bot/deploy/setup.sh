#!/usr/bin/env bash
# Portfolio-bot ni Oracle/GCE VM'ga o'rnatish va systemd xizmati sifatida ishga tushirish.
# Qayta ishga tushirish xavfsiz (idempotent) — mavjud .env va sessiyani buzmaydi.
set -euo pipefail

REPO_URL="https://github.com/baxtiyorjongaziyev/jonbranding-web.git"
APP_DIR="$HOME/jonbranding-web"
BOT_DIR="$APP_DIR/services/portfolio-bot"
SERVICE_NAME="portfolio-bot"

echo "==> Node.js tekshirilmoqda..."
if ! command -v node >/dev/null 2>&1 || [ "$(node -e 'console.log(process.versions.node.split(".")[0])')" -lt 20 ]; then
  echo "==> Node.js 22 o'rnatilmoqda (NodeSource)..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
node --version

echo "==> Repozitoriy tekshirilmoqda..."
if [ -d "$APP_DIR/.git" ]; then
  echo "==> Mavjud repo topildi, pull qilinmoqda..."
  git -C "$APP_DIR" fetch origin main
  git -C "$APP_DIR" checkout main
  git -C "$APP_DIR" pull origin main
else
  echo "==> Repo clone qilinmoqda..."
  git clone --branch main "$REPO_URL" "$APP_DIR"
fi

echo "==> Bog'liqliklar o'rnatilmoqda..."
cd "$BOT_DIR"
npm install

echo "==> Build qilinmoqda..."
npm run build

if [ ! -f "$BOT_DIR/.env" ]; then
  echo "==> .env topilmadi, .env.example dan nusxa olinmoqda..."
  cp "$BOT_DIR/.env.example" "$BOT_DIR/.env"
  echo ""
  echo "  DIQQAT: $BOT_DIR/.env faylini to'ldiring, keyin bu skriptni qayta ishga tushiring."
  echo "  Qaysi kalitlar kerakligi uchun deploy/README.md ga qarang."
  echo ""
  exit 0
fi

echo "==> systemd xizmati o'rnatilmoqda..."
sudo tee "/etc/systemd/system/${SERVICE_NAME}.service" > /dev/null <<EOF
[Unit]
Description=JonBranding Portfolio Bot (Telegram/Instagram/Drive -> Sanity AI sync)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=${BOT_DIR}
EnvironmentFile=${BOT_DIR}/.env
ExecStart=$(command -v node) ${BOT_DIR}/dist/index.js
Restart=on-failure
RestartSec=15
StandardOutput=journal
StandardError=journal
SyslogIdentifier=${SERVICE_NAME}

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable "${SERVICE_NAME}"
sudo systemctl restart "${SERVICE_NAME}"

echo ""
echo "==> Tayyor. Holatni tekshirish uchun:"
echo "    sudo systemctl status ${SERVICE_NAME}"
echo "    journalctl -u ${SERVICE_NAME} -f"
