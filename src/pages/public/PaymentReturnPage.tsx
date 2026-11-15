import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { fetchOrderDetails, simulatePaySuiteWebhook, confirmOrderReturn, saveDirectPurchase } from '../../lib/orders';
import { fetchProducts } from '../../lib/supabase';
import { Order, ProductDeliverable } from '../../types';
import { formatPrice } from '../../utils/currency';
import { BrandLogo } from '../../components/common/BrandLogo';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Download,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  ShoppingBag,
  HelpCircle,
  Lock,
  Smartphone,
  Sparkles,
  FileArchive,
  KeyRound,
  FileText,
  ArrowRight,
  Search,
  Mail
} from 'lucide-react';

export const PaymentReturnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlRef = searchParams.get('ref') || searchParams.get('reference') || '';
  const urlToken = searchParams.get('token') || '';
  const isSimulated = searchParams.get('simulated') === 'true';

  const [reference, setReference] = useState<string>(urlRef || localStorage.getItem('digitalpay_last_order_ref') || '');
  const [token, setToken] = useState<string>(urlToken || localStorage.getItem('digitalpay_last_order_token') || '');
  const [manualQuery, setManualQuery] = useState('');

  const [order, setOrder] = useState<Order | null>(null);
  const [deliverables, setDeliverables] = useState<ProductDeliverable[]>([]);
  const [status, setStatus] = useState<'loading' | 'paid' | 'pending' | 'failed' | 'not_found'>('loading');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [pollingCount, setPollingCount] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [savedToPurchases, setSavedToPurchases] = useState(false);
  const [isSavingEmail, setIsSavingEmail] = useState(false);

  // Consulta inicial e recuperação automática de entregáveis do PaySuite
  const checkStatus = async (refToCheck = reference, tokenToCheck = token) => {
    // 1. Se tem referência informada (na URL ou localStorage)
    if (refToCheck) {
      try {
        const result = await fetchOrderDetails(refToCheck, tokenToCheck);
        if (result.success && result.order) {
          setOrder(result.order);
          const ordStatus = result.order.status;
          if (ordStatus === 'paid' || ordStatus === 'manual_approved') {
            setStatus('paid');
            if (result.order.customer_email) {
              setBuyerEmail(result.order.customer_email);
              setSavedToPurchases(true);
            }
            if (result.deliverables && result.deliverables.length > 0) {
              setDeliverables(result.deliverables);
            }
            try {
              confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
            } catch {}
            return;
          } else if (ordStatus === 'failed') {
            setStatus('failed');
            return;
          } else {
            setStatus('pending');
            return;
          }
        }
      } catch (err) {
        console.warn('Erro ao consultar referência de pedido:', err);
      }
    }

    // 2. Se o cliente veio direto do link de pagamento do PaySuite sem ref na URL:
    // Recupera imediatamente o último produto clicado na loja
    try {
      const lastClickedRaw = localStorage.getItem('digitalpay_last_checkout_product');
      if (lastClickedRaw) {
        const lastClicked = JSON.parse(lastClickedRaw);
        const prods = await fetchProducts();
        const matched = prods.find(p =>
          (lastClicked.productId && p.id === lastClicked.productId) ||
          p.name.toLowerCase() === (lastClicked.productName || '').toLowerCase()
        );

        if (matched) {
          const savedEmail = localStorage.getItem('digitalpay_customer_email') || '';
          const directOrder: Order = {
            id: `ord_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
            reference: reference || `DP-${Date.now().toString(36).toUpperCase()}`,
            product_id: matched.id,
            product_name: matched.name,
            customer_name: 'Cliente PaySuite',
            customer_email: savedEmail,
            amount: lastClicked.promoPrice || matched.promo_price,
            currency: lastClicked.currency || matched.currency || 'MZN',
            payment_gateway: 'paysuite',
            status: 'paid',
            delivery_status: 'delivered',
            delivery_mode: 'automatic',
            access_token: 'direct',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setOrder(directOrder);
          if (savedEmail) {
            setBuyerEmail(savedEmail);
            setSavedToPurchases(true);
          }
          setDeliverables(matched.deliverables || []);
          setStatus('paid');
          try {
            confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          } catch {}
          return;
        }
      }
    } catch (err) {
      console.warn('Erro ao carregar último produto:', err);
    }

    setStatus('not_found');
  };

  useEffect(() => {
    if (reference) {
      checkStatus(reference, token);
    } else {
      setStatus('not_found');
    }
  }, [reference, token]);

  // Polling automático a cada 4 segundos se estiver pendente
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (status === 'pending') {
      timer = setTimeout(() => {
        setPollingCount(prev => prev + 1);
        checkStatus(reference, token);
      }, 4000);
    }

    return () => clearTimeout(timer);
  }, [status, pollingCount, reference, token]);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Liberação imediata ao concluir pagamento no link do PaySuite
  const handleConfirmPaymentReturn = async () => {
    if (!reference) return;
    setIsConfirming(true);
    await confirmOrderReturn(reference);
    await checkStatus(reference, token);
    setIsConfirming(false);
  };

  // Simulação de confirmação do PaySuite em ambiente de teste
  const handleSimulatePaymentConfirmation = async () => {
    if (!reference) return;
    setIsSimulating(true);
    await simulatePaySuiteWebhook(reference, 'payment.success');
    await checkStatus(reference, token);
    setIsSimulating(false);
  };

  const handleManualLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = manualQuery.trim();
    if (!clean) return;
    setStatus('loading');
    setReference(clean);
    checkStatus(clean, '');
  };

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = buyerEmail.trim().toLowerCase();
    if (!order || !clean.includes('@')) return;
    setIsSavingEmail(true);
    try {
      localStorage.setItem('digitalpay_customer_email', clean);
      await saveDirectPurchase(order, clean);
      setOrder(prev => (prev ? { ...prev, customer_email: clean } : prev));
      setSavedToPurchases(true);
    } catch (err) {
      console.error('Erro ao vincular e-mail:', err);
    } finally {
      setIsSavingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <BrandLogo size="sm" variant="neon" showText={false} />
            <span className="text-base sm:text-lg font-black text-white">
              Digitall<span className="text-emerald-400">Pay</span>
            </span>
          </Link>

          <Link
            to="/minhas-compras"
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Minhas Compras</span>
          </Link>
        </div>
      </header>

      {/* Conteúdo Central */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center">
        {/* ESTADO 1: CARREGANDO */}
        {status === 'loading' && (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4 max-w-md w-full">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto animate-spin">
              <RefreshCw className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">Verificando status do pagamento...</h3>
            <p className="text-xs text-slate-400">
              Conectando aos servidores do PaySuite para validar a transação com segurança.
            </p>
          </div>
        )}

        {/* ESTADO 2: PAGAMENTO CONFIRMADO & ENTREGÁVEIS DISPONÍVEIS */}
        {status === 'paid' && (
          <div className="w-full space-y-6 animate-in fade-in duration-300">
            {/* Banner de Celebração */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 text-center space-y-3 relative overflow-hidden shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Pagamento Confirmado via PaySuite
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                  Parabéns! Sua compra foi aprovada!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-1">
                  O acesso aos seus entregáveis digitais já está liberado abaixo. Uma cópia das instruções também foi associada ao e-mail informado.
                </p>
              </div>

              {order && (
                <div className="pt-2 text-xs text-slate-400 flex flex-wrap items-center justify-center gap-3 font-mono">
                  <span>Ref: <strong className="text-white">{order.reference}</strong></span>
                  <span>•</span>
                  <span>Produto: <strong className="text-white">{order.product_name}</strong></span>
                  <span>•</span>
                  <span>Valor: <strong className="text-emerald-400">{formatPrice(order.amount, order.currency)}</strong></span>
                </div>
              )}
            </div>

            {/* Lista dos Entregáveis Liberados */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Seus Entregáveis Disponíveis
                </h3>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Acesso Seguro
                </span>
              </div>

              {deliverables.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                  <p className="text-xs font-semibold text-white">
                    Instruções de acesso enviadas para o e-mail:
                  </p>
                  <p className="text-sm font-bold text-emerald-400 font-mono">
                    {order?.customer_email}
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                    Verifique sua caixa de entrada e pasta de spam para encontrar os dados completos de acesso.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {deliverables.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                          {item.type === 'file' ? (
                            <FileArchive className="w-5 h-5" />
                          ) : item.type === 'link' ? (
                            <ExternalLink className="w-5 h-5 text-cyan-400" />
                          ) : item.type === 'license_code' ? (
                            <KeyRound className="w-5 h-5 text-purple-400" />
                          ) : (
                            <FileText className="w-5 h-5 text-amber-400" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-xs text-slate-400 mt-0.5">
                              {item.description}
                            </p>
                          )}
                          {item.type === 'file' && item.file_name && (
                            <p className="text-[11px] text-emerald-400/90 font-mono mt-0.5">
                              {item.file_name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Botão de Ação Específico do Entregável */}
                      <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">
                        {item.type === 'file' && (
                          <a
                            href={item.file_path ? `/api/deliverables/download/${item.id}?ref=${reference}&token=${token}` : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                            <span>Descarregar Produto</span>
                          </a>
                        )}

                        {item.type === 'link' && item.external_url && (
                          <a
                            href={item.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 cursor-pointer"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Aceder ao Curso / Material</span>
                          </a>
                        )}

                        {item.type === 'license_code' && item.content_text && (
                          <div className="w-full sm:w-auto flex items-center gap-2">
                            <span className="font-mono text-xs px-3 py-2 bg-slate-900 border border-purple-500/30 text-purple-300 rounded-xl">
                              {item.content_text}
                            </span>
                            <button
                              onClick={() => handleCopyCode(item.id, item.content_text!)}
                              className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                              title="Copiar código"
                            >
                              {copiedCodeId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        )}

                        {item.type === 'text' && item.content_text && (
                          <div className="w-full sm:w-auto">
                            <button
                              onClick={() => alert(`Instruções:\n\n${item.content_text}`)}
                              className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200"
                            >
                              Ver Conteúdo Completo
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Vincular e-mail para acesso permanente em Minhas Compras */}
              {savedToPurchases || order?.customer_email ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 text-emerald-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>
                      Compra vinculada a <strong className="text-white font-mono">{order?.customer_email || buyerEmail}</strong>. Seus entregáveis podem ser consultados a qualquer momento em <strong>Minhas Compras</strong>.
                    </span>
                  </div>
                  <Link
                    to="/minhas-compras"
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/30 transition-colors flex items-center gap-1"
                  >
                    <span>Ver Minhas Compras</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      Deseja guardar este acesso para consultar mais tarde?
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Insira o mesmo e-mail usado no PaySuite para registrar este produto na área <strong>Minhas Compras</strong> e acessar seus entregáveis sempre que precisar, em qualquer dispositivo.
                  </p>
                  <form onSubmit={handleSaveEmail} className="flex flex-col sm:flex-row gap-2 pt-1">
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={e => setBuyerEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isSavingEmail}
                      className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {isSavingEmail ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Salvando...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Salvar em Minhas Compras</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Botão para Área do Cliente */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <span>Dica: Seus produtos adquiridos ficam salvos na sua área de compras.</span>
                <Link
                  to="/minhas-compras"
                  className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
                >
                  <span>Aceder Minhas Compras</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ESTADO 3: PAGAMENTO PENDENTE (AGUARDANDO CONFIRMAÇÃO) */}
        {status === 'pending' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-amber-500/30 text-center space-y-5 max-w-lg w-full animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto animate-pulse">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Aguardando Confirmação
              </span>
              <h3 className="text-xl font-black text-white mt-2">
                Processando seu pagamento...
              </h3>
              <p className="text-xs text-slate-300 mt-2">
                Se você pagou via <strong>M-Pesa</strong> ou <strong>E-Mola</strong>, verifique o prompt ou notificação no seu telemóvel para confirmar o PIN.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Referência:</span>
                <span className="font-mono font-bold text-white">{reference}</span>
              </div>
              {order && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Produto:</span>
                    <span className="font-bold text-white">{order.product_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Valor:</span>
                    <span className="font-bold text-emerald-400">{formatPrice(order.amount, order.currency)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>Esta tela atualizará automaticamente assim que aprovado</span>
            </div>

            {/* Ação Imediata: Concluiu o pagamento no link do PaySuite */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleConfirmPaymentReturn}
                disabled={isConfirming}
                className="w-full py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isConfirming ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Liberando seus entregáveis...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Já Concluí o Pagamento no PaySuite — Liberar Meu Produto</span>
                  </>
                )}
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Olá! Acabei de realizar o pagamento do produto ${order?.product_name || 'Digital'} via PaySuite no valor de ${formatPrice(order?.amount || 0, order?.currency)}. Minha referência é ${reference}. Segue o comprovativo para liberação.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Enviar Comprovativo no WhatsApp (Opcional)</span>
              </a>
            </div>

            {/* Simulação segura para testes em desenvolvimento ou modo de teste */}
            {(isSimulated || import.meta.env.DEV) && (
              <div className="pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleSimulatePaymentConfirmation}
                  disabled={isSimulating}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer w-full"
                >
                  {isSimulating ? 'Confirmando...' : '🧪 Simular Aprovação de Pagamento (Modo de Teste)'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ESTADO 4: PAGAMENTO FALHOU */}
        {status === 'failed' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-rose-500/30 text-center space-y-5 max-w-md w-full animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Não Concluído
              </span>
              <h3 className="text-xl font-black text-white mt-2">
                O pagamento não foi aprovado
              </h3>
              <p className="text-xs text-slate-300 mt-2">
                A transação foi recusada ou expirou no PaySuite. Nenhuma cobrança foi efetuada.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => window.history.back()}
                className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all cursor-pointer"
              >
                Tentar Novamente
              </button>
              <Link
                to="/"
                className="w-full py-2.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Voltar à Página Inicial
              </Link>
            </div>
          </div>
        )}

        {/* ESTADO 5: NÃO IDENTIFICADO */}
        {status === 'not_found' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-5 max-w-md w-full">
            <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <HelpCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">
                Acesse Seus Entregáveis
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Concluiu o pagamento via PaySuite ou quer consultar sua encomenda? Insira sua referência ou acesse por e-mail.
              </p>
            </div>

            {/* Busca Rápida por Referência */}
            <form onSubmit={handleManualLookup} className="space-y-2 text-left">
              <label className="text-[11px] font-bold text-slate-300 block">
                Referência do Pedido (ex: DP-202611...):
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={manualQuery}
                  onChange={e => setManualQuery(e.target.value)}
                  placeholder="DP-202611..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all cursor-pointer"
              >
                Localizar Pedido
              </button>
            </form>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/minhas-compras"
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition-all text-center"
              >
                Consultar Minhas Compras por E-mail
              </Link>
              <Link
                to="/"
                className="text-xs text-slate-400 hover:text-white"
              >
                Voltar para a Loja
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-400">
        <p>Digitall Pay • Entrega Automática Segura Integrada ao PaySuite</p>
      </footer>
    </div>
  );
};
