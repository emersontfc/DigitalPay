import React, { useState, useEffect } from 'react';
import { Order, WebhookLog } from '../../types';
import {
  fetchAdminOrders,
  manualApproveOrder,
  simulatePaySuiteWebhook,
  fetchWebhookLogs
} from '../../lib/orders';
import { formatPrice } from '../../utils/currency';
import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Search,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  AlertCircle,
  Activity,
  User,
  Mail,
  Smartphone,
  Sparkles,
  Lock,
  ChevronRight,
  Filter
} from 'lucide-react';

export const SalesAndDeliveriesTab: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'webhooks'>('orders');

  // Modal de detalhes ou autorização manual
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [manualReason, setManualReason] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // KPIs
  const [kpis, setKpis] = useState({
    totalOrders: 0,
    confirmedOrders: 0,
    pendingOrders: 0,
    failedOrders: 0,
    confirmedRevenue: 0,
    deliveriesCompleted: 0,
    deliveriesPending: 0
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const ordersRes = await fetchAdminOrders({
        search: searchTerm,
        status: statusFilter
      });

      if (ordersRes.success) {
        setOrders(ordersRes.orders);
        setKpis(ordersRes.kpis);
      }

      const logs = await fetchWebhookLogs();
      setWebhookLogs(logs);
    } catch (err) {
      console.error('Erro ao carregar dados de vendas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, statusFilter]);

  const handleCopyAccessLink = (order: Order) => {
    const fullUrl = `${window.location.origin}/pagamento/retorno?ref=${order.reference}&token=${order.access_token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedRef(order.reference);
    setTimeout(() => setCopiedRef(null), 2500);
  };

  const handleManualDeliver = async (orderId: string) => {
    if (!manualReason.trim()) {
      alert('Por favor, informe a justificativa da autorização manual para auditoria.');
      return;
    }

    setIsProcessingAction(true);
    try {
      const ok = await manualApproveOrder(orderId, 'admin@digitallpay.store', manualReason.trim());
      if (ok) {
        setActionSuccessMessage('Entrega autorizada manualmente com sucesso!');
        setTimeout(() => setActionSuccessMessage(null), 3000);
        setSelectedOrder(null);
        setManualReason('');
        await loadData();
      } else {
        alert('Erro ao autorizar entrega.');
      }
    } catch (e: any) {
      alert('Falha na autorização: ' + e?.message);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleSimulateWebhook = async (ref: string) => {
    if (window.confirm(`Deseja simular a confirmação de pagamento do PaySuite para a encomenda ${ref}?`)) {
      setIsProcessingAction(true);
      await simulatePaySuiteWebhook(ref, 'payment.success');
      await loadData();
      setIsProcessingAction(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. KPIs de Vendas e Entregas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Vendas */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Pedidos</span>
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{kpis.totalOrders}</div>
          <span className="text-[10px] text-slate-500">Transações criadas</span>
        </div>

        {/* Receita Confirmada */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 bg-emerald-950/10">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Receita Aprovada</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 truncate">
            {formatPrice(kpis.confirmedRevenue, 'MZN')}
          </div>
          <span className="text-[10px] text-emerald-400/80 font-medium">Pagamentos confirmados</span>
        </div>

        {/* Pagamentos Aprovados */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Aprovados</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{kpis.confirmedOrders}</div>
          <span className="text-[10px] text-slate-500">PaySuite + Manual</span>
        </div>

        {/* Pagamentos Pendentes */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pendentes</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{kpis.pendingOrders}</div>
          <span className="text-[10px] text-slate-500">Aguardando PIN/M-Pesa</span>
        </div>

        {/* Entregas Concluídas */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Entregas OK</span>
            <Truck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{kpis.deliveriesCompleted}</div>
          <span className="text-[10px] text-slate-500">Liberados aos clientes</span>
        </div>

        {/* Pagamentos Falhados */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Recusados</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">{kpis.failedOrders}</div>
          <span className="text-[10px] text-slate-500">Cancelados / expirados</span>
        </div>
      </div>

      {/* 2. Barra de Ferramentas & Sub-Abas */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'orders'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Encomendas & Vendas ({orders.length})
          </button>

          <button
            onClick={() => setActiveSubTab('webhooks')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'webhooks'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Logs Webhook PaySuite ({webhookLogs.length})</span>
          </button>
        </div>

        {activeSubTab === 'orders' && (
          <div className="flex items-center gap-2">
            {/* Campo de Pesquisa */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar ref, cliente, e-mail..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Filtro de Status */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="paid">Confirmados</option>
              <option value="pending">Pendentes</option>
              <option value="failed">Falhados</option>
            </select>

            <button
              onClick={loadData}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
              title="Recarregar"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {actionSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* 3. Tabela de Encomendas & Vendas */}
      {activeSubTab === 'orders' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
          {orders.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Nenhuma encomenda registrada</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                As vendas realizadas através do PaySuite nas suas páginas de vendas aparecerão aqui automaticamente com os respectivos entregáveis liberados.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Referência & Data</th>
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Produto</th>
                    <th className="py-3 px-4">Valor</th>
                    <th className="py-3 px-4">Status Pagamento</th>
                    <th className="py-3 px-4">Entrega</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.map(order => (
                    <tr key={order.id || order.reference} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-white">{order.reference}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(order.created_at).toLocaleString('pt-BR')}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{order.customer_name}</div>
                        <div className="text-[10px] text-slate-400">{order.customer_email}</div>
                        {order.customer_phone && (
                          <div className="text-[10px] text-emerald-400/80">{order.customer_phone}</div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200 truncate max-w-[180px]">
                          {order.product_name}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-black text-emerald-400">
                          {formatPrice(order.amount, order.currency)}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {order.status === 'paid' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Aprovado
                          </span>
                        )}
                        {order.status === 'manual_approved' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                            Aprov. Manual
                          </span>
                        )}
                        {order.status === 'pending' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            Pendente
                          </span>
                        )}
                        {order.status === 'failed' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            Falhou
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {order.delivery_status === 'delivered' ? (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Liberado
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Bloqueado
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Reenviar / Copiar Acesso */}
                          <button
                            onClick={() => handleCopyAccessLink(order)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Copiar Link Seguro de Acesso do Cliente"
                          >
                            {copiedRef === order.reference ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          {/* Simular confirmação (se pendente) */}
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleSimulateWebhook(order.reference)}
                              className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                              title="Simular Webhook PaySuite (Aprovar)"
                            >
                              ⚡ Testar Webhook
                            </button>
                          )}

                          {/* Autorizar Manualmente (se pendente ou falhado) */}
                          {order.status !== 'paid' && order.status !== 'manual_approved' && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setManualReason('Comprovativo recebido via WhatsApp');
                              }}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
                            >
                              Aprovar Manual
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 4. Logs de Webhooks PaySuite */}
      {activeSubTab === 'webhooks' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Histórico de Eventos e Webhooks do PaySuite
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Rastreabilidade completa de todas as notificações assíncronas recebidas em <code>/api/webhooks/paysuite</code>
              </p>
            </div>

            <button
              onClick={loadData}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {webhookLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Nenhum log de webhook registrado ainda. Os eventos do PaySuite aparecerão aqui quando forem recebidos.
            </div>
          ) : (
            <div className="space-y-2.5 font-mono text-xs">
              {webhookLogs.map(log => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        log.status === 'processed' ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                    <span className="font-bold text-white">{log.event_type}</span>
                    {log.reference && (
                      <span className="text-slate-400">Ref: <strong className="text-emerald-400">{log.reference}</strong></span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>Assinatura: {log.signature_valid ? '✅ Válida' : '❌ Inválida'}</span>
                    <span>•</span>
                    <span>{new Date(log.created_at).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL DE AUTORIZAÇÃO MANUAL DE ENTREGA (COM AUDITORIA) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Autorizar Entrega Manualmente
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div>Ref: <strong className="text-white">{selectedOrder.reference}</strong></div>
              <div>Cliente: <strong className="text-white">{selectedOrder.customer_name}</strong> ({selectedOrder.customer_email})</div>
              <div>Produto: <strong className="text-white">{selectedOrder.product_name}</strong></div>
              <div>Valor: <strong className="text-emerald-400">{formatPrice(selectedOrder.amount, selectedOrder.currency)}</strong></div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Justificativa da Liberação Manual (Registro de Auditoria) *
              </label>
              <textarea
                rows={3}
                required
                value={manualReason}
                onChange={e => setManualReason(e.target.value)}
                placeholder="Ex: Pagamento confirmado manualmente via extrato bancário / M-Pesa direto"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800"
              >
                Cancelar
              </button>
              <button
                disabled={isProcessingAction}
                onClick={() => handleManualDeliver(selectedOrder.id)}
                className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessingAction ? 'Autorizando...' : 'Confirmar e Liberar Entregáveis'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
