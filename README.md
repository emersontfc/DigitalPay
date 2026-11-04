# 🚀 DigitalPay - Plataforma de Vendas e Páginas de Alta Conversão

O **DigitalPay** é uma plataforma desenvolvida no estilo **Kiwify**, criada para permitir que o administrador crie, customize e gerencie páginas de vendas completas para cada um dos seus produtos digitais.

---

## ✨ Principais Recursos

- 🎨 **Templates Prontos de Alta Conversão**:
  - **Kiwify Neon & Dark Glow**: Fundo escuro com acentos em verde neon, vídeo em destaque, contadores e botões pulsantes.
  - **Minimal Luxury & High Ticket**: Visual refinado para consultorias, mentorias e produtos de alto valor.
  - **Vanguard Black & Gold**: Foco em direct response, urgência agressiva e gatilhos de escassez.
- ⚙️ **Painel Administrativo Completo (`/admin`)**:
  - Cadastro de novos produtos e páginas dedicadas para cada um.
  - Escolha do template visual por produto.
  - Customização de headlines, vídeos (YouTube/Vimeo) e imagens.
  - Definição de preço original (riscado), preço promocional e parcelamento.
  - **Configuração do link de checkout** (Kiwify, Stripe, Mercado Pago, etc.) diretamente nos botões.
  - Módulos do treinamento, benefícios em tópicos, depoimentos com fotos e FAQs.
  - Pré-visualização ao vivo (*Live Preview*) antes de salvar.
  - Ações rápidas: Copiar link amigável (`/p/:slug`), Duplicar página e Excluir.
- ⚡ **Páginas de Vendas Responsivas (`/p/:slug`)**:
  - URLs limpas e amigáveis para divulgação.
  - Contador regressivo dinâmico.
  - Barra flutuante (*Sticky Checkout Bar*) no scroll para mobile e desktop.
  - Efeito de celebração com confetes ao clicar no botão de compra.
- 🗄️ **Banco de Dados Supabase (PostgreSQL)**:
  - Arquivo `supabase_schema.sql` pronto para execução no Supabase.
  - Modal de configuração com teste de conexão no painel.
  - Modo Offline/Local integrado (o app funciona imediatamente com dados de demonstração mesmo antes de configurar as chaves do Supabase).

---

## 🛠️ Como Executar o Projeto

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra o navegador em:
   - Vitrine Geral: `http://localhost:5173/`
   - Painel do Administrador: `http://localhost:5173/admin`
   - Exemplo de Página de Vendas: `http://localhost:5173/p/metodo-trafego-automatico`

---

## 🗄️ Como Conectar o Supabase

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. Acesse o **SQL Editor** do seu projeto no Supabase e execute o conteúdo do arquivo `supabase_schema.sql`.
3. No painel do DigitalPay, clique em **Supabase (Configurar)** no topo e informe a URL e a Anon Key (ou crie um arquivo `.env` baseado em `.env.example`).
