import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCustomerPurchases } from '../../lib/orders';
import { Order } from '../../types';
import { formatPrice } from '../../utils/currency';
import { BrandLogo } from '../../components/common/BrandLogo';
import {
  ShoppingBag,
  Search,
  Mail,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Clock,
  Sparkles,
  Lock,
  Download,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const CustomerPurchasesPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Por favor, digite um e-mail válido.');
      return;
    }

    setLoading(true);
    try {
      const results = await fetchCustomerPurchases(cleanEmail);
      setOrders(results);
      setSearched(true);
    } catch (err: any) {
      console.error('Erro ao buscar compras:', err);
      setErrorMessage('Erro ao consultar compras. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <BrandLogo size="sm" variant="neon" showText={false} />
            <span className="text-base sm:text-lg font-black text-white">
              Digitall<span className="text-emerald-400">Pay</span>
            </span>
          </Link>

          <Link
            to="/"
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            ← Voltar para a Loja
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Banner de Boas-Vindas */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Minhas Compras & Entregáveis
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Consulte seu histórico de compras aprovadas e acesse novamente os links, arquivos e materiais adquiridos na Digitall Pay.
          </p>
        </div>

        {/* Formulário de Busca por E-mail */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                E-mail utilizado na compra
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Consultando...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Aceder aos Meus Produtos</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Resultados da Busca */}
        {searched && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                {orders.length > 0
                  ? `Encontramos ${orders.length} produto(s) comprado(s)`
                  : 'Nenhum produto aprovado encontrado para este e-mail'}
              </h3>
              <span className="text-xs text-slate-500">{email}</span>
            </div>

            {orders.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-400">
                  Verifique se digitou o mesmo e-mail informado no checkout. Se você acabou de pagar via M-Pesa/E-Mola, aguarde alguns instantes pela confirmação da rede.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {orders.map(order => (
                  <div
                    key={order.id || order.reference}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white truncate">
                          {order.product_name}
                        </h4>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                          Aprovado
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 font-mono">
                        <span>Ref: {order.reference}</span>
                        <span>•</span>
                        <span>{formatPrice(order.amount, order.currency)}</span>
                        {order.paid_at && (
                          <>
                            <span>•</span>
                            <span>{new Date(order.paid_at).toLocaleDateString('pt-BR')}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/pagamento/retorno?ref=${order.reference}&token=${order.access_token}`}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 shrink-0"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Aceder aos Entregáveis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>Digitall Pay • Área Segura do Cliente</p>
      </footer>
    </div>
  );
};
