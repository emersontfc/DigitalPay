#!/bin/bash
# =========================================================================
# SCRIPT DE ATUALIZAÇÃO RÁPIDA NA VPS UBUNTU
# Execute na VPS: bash /var/www/digitalpay/update_vps.sh
# =========================================================================

set -e

echo "🚀 Atualizando Digitall Pay com a versão mais recente do GitHub..."

# Ajusta permissões para o usuário atual caso algum arquivo tenha ficado com dono root
sudo chown -R $USER:$USER /var/www/digitalpay

cd /var/www/digitalpay

# Sincroniza com a branch main
git fetch origin main
git reset --hard origin/main

# Instala novas dependências e gera o build do React
echo "📦 Instalando dependências e compilando..."
npm install
npm run build

# Recarrega o Nginx
echo "🔄 Recarregando Nginx..."
sudo systemctl reload nginx

echo ""
echo "=========================================================="
echo "🎉 Digitall Pay atualizado com sucesso no servidor!"
echo "Acesse: https://digitallpay.store/admin"
echo "=========================================================="
