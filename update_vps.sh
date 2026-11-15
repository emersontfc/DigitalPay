#!/bin/bash
# =========================================================================
# SCRIPT DE ATUALIZAÇÃO RÁPIDA NA VPS UBUNTU - DIGITALPAY
# Execute na VPS: bash /var/www/digitalpay/update_vps.sh
# =========================================================================

set -e

echo "🚀 Atualizando Digitall Pay com a versão mais recente do GitHub..."

# 1. Ajusta permissões para o usuário atual e configura diretório seguro
sudo chown -R $USER:$USER /var/www/digitalpay
git config --global --add safe.directory /var/www/digitalpay || true

cd /var/www/digitalpay

# 2. Sincroniza com a branch main do GitHub
git fetch origin main
git reset --hard origin/main

# 3. Instala novas dependências e compila o React
echo "📦 Instalando dependências e compilando..."
npm install
npm run build

# 4. Atualiza configuração do Nginx com suporte a API
echo "⚙️ Atualizando configuração do Nginx..."
sudo cp /var/www/digitalpay/nginx.conf /etc/nginx/sites-available/digitalpay 2>/dev/null || true
sudo ln -sf /etc/nginx/sites-available/digitalpay /etc/nginx/sites-enabled/ 2>/dev/null || true
sudo nginx -t
sudo systemctl reload nginx

# 5. Inicia ou reinicia o backend Node.js via PM2
echo "🔄 Gerenciando serviço do backend Node.js (PM2)..."
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2 globalmente..."
    sudo npm install -g pm2
fi

pm2 restart digitalpay-api || pm2 start ecosystem.config.cjs
pm2 save || true

echo ""
echo "=========================================================="
echo "🎉 Digitall Pay atualizado com sucesso no servidor!"
echo "Frontend: https://digitallpay.store"
echo "Backend & PaySuite Webhook: https://digitallpay.store/api/webhooks/paysuite"
echo "Retorno de Pagamento: https://digitallpay.store/pagamento/retorno"
echo "Painel Admin: https://digitallpay.store/admin"
echo "=========================================================="
