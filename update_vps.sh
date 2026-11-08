#!/bin/bash
# =========================================================================
# SCRIPT DE ATUALIZAÇÃO RÁPIDA NA VPS UBUNTU
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

# 4. Recarrega o servidor Nginx
echo "🔄 Recarregando Nginx..."
sudo systemctl reload nginx

echo ""
echo "=========================================================="
echo "🎉 Digitall Pay atualizado com sucesso no servidor!"
echo "Acesse: https://digitallpay.store/admin"
echo "=========================================================="
