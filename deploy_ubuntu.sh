#!/bin/bash
# =========================================================================
# DIGITALPAY - SCRIPT DE DEPLOY AUTOMATIZADO PARA UBUNTU
# Execute no seu servidor Ubuntu como root ou com sudo
# =========================================================================

set -e

DOMAIN="seudominio.com.br" # << SUBSTITUA PELO SEU DOMÍNIO OU IP

echo "🚀 Iniciando configuração do DigitalPay no Ubuntu..."

# 1. Atualizar pacotes e instalar Nginx
echo "📦 Instalando Nginx e Certbot..."
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx ufw

# 2. Criar diretório da aplicação
echo "📁 Criando diretório em /var/www/digitalpay..."
sudo mkdir -p /var/www/digitalpay
sudo chown -R $USER:$USER /var/www/digitalpay

# 3. Configurar Nginx para SPA (React Router /p/:slug e /admin)
echo "⚙️ Configurando Nginx..."
sudo tee /etc/nginx/sites-available/digitalpay > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    root /var/www/digitalpay;
    index index.html index.htm;

    # Compressão Gzip para carregamento instantâneo
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;

    # Cache de assets estáticos (CSS, JS, Imagens, Fontes)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Redirecionamento essencial para SPA (evita erro 404 nas rotas)
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

# 4. Ativar o site e recarregar o Nginx
echo "🔗 Ativando o site no Nginx..."
sudo ln -sf /etc/nginx/sites-available/digitalpay /etc/nginx/sites-enabled/
# Remove o default se existir para evitar conflito
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# 5. Ajustar Firewall UFW
echo "🛡️ Configurando Firewall..."
sudo ufw allow 'Nginx Full' || true

echo "✅ Nginx configurado com sucesso!"
echo "👉 Agora copie os arquivos da pasta 'dist' do seu PC para: /var/www/digitalpay/"
echo "👉 Para ativar o SSL (HTTPS grátis), execute no servidor:"
echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
