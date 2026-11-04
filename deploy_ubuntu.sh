#!/bin/bash
# =========================================================================
# DIGITALPAY - DEPLOY DIRETO NO IP NO UBUNTU
# =========================================================================

set -e

echo "🚀 Configurando DigitalPay no Ubuntu diretamente pelo IP..."

# 1. Atualizar e instalar Nginx
sudo apt update
sudo apt install -y nginx

# 2. Criar diretório
sudo mkdir -p /var/www/digitalpay
sudo chown -R $USER:$USER /var/www/digitalpay

# 3. Configurar Nginx para responder no IP
sudo tee /etc/nginx/sites-available/digitalpay > /dev/null <<'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /var/www/digitalpay;
    index index.html index.htm;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# 4. Ativar site
sudo ln -sf /etc/nginx/sites-available/digitalpay /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Nginx pronto e ouvindo no IP do servidor!"
echo "👉 Agora transfira a pasta dist/ para: /var/www/digitalpay/"
