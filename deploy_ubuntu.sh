#!/bin/bash
# =========================================================================
# DIGITALPAY - DEPLOY AUTOMÁTICO VIA GITHUB NO UBUNTU
# =========================================================================

set -e

echo "🚀 Iniciando deploy automático do DigitalPay via GitHub..."

# 1. Instalar Node.js 22 LTS, Git e Nginx (se não estiverem instalados)
if ! command -v node &> /dev/null; then
    echo "📦 Instalando Node.js 22..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt install -y nodejs
fi

if ! command -v nginx &> /dev/null; then
    echo "📦 Instalando Nginx..."
    sudo apt update
    sudo apt install -y nginx git
fi

# 2. Clonar ou atualizar o repositório em /var/www/digitalpay
sudo mkdir -p /var/www
if [ -d "/var/www/digitalpay/.git" ]; then
    echo "🔄 Atualizando código com git pull..."
    cd /var/www/digitalpay
    sudo git pull origin main
else
    echo "📥 Clonando repositório do GitHub..."
    sudo rm -rf /var/www/digitalpay
    sudo git clone https://github.com/emersontfc/DigitalPay.git /var/www/digitalpay
    cd /var/www/digitalpay
fi

# 3. Permissões, instalação e build
echo "🔨 Instalando dependências e compilando..."
sudo chown -R $USER:$USER /var/www/digitalpay
npm install
npm run build

# 4. Configurar Nginx
echo "⚙️ Configurando Nginx para servir no IP..."
sudo cp /var/www/digitalpay/nginx.conf /etc/nginx/sites-available/digitalpay
sudo ln -sf /etc/nginx/sites-available/digitalpay /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "=========================================================="
echo "🎉 SUCESSO! DigitalPay está no ar diretamente pelo IP!"
echo "Acesse no navegador: http://$(curl -s ifconfig.me)/"
echo "Painel Admin: http://$(curl -s ifconfig.me)/admin"
echo "=========================================================="
