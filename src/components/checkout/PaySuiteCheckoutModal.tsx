import React, { useState } from 'react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/currency';
import { createCheckoutOrder } from '../../lib/orders';
import { BrandLogo } from '../common/BrandLogo';
import {
  X,
  Lock,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Mail,
  User,
  Loader2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface PaySuiteCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  currency?: string;
  promoPrice?: number;
}

export const PaySuiteCheckoutModal: React.FC<PaySuiteCheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  currency = 'MZN',
  promoPrice
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const finalPrice = promoPrice !== undefined ? promoPrice : product.promo_price;
  const isMozambique = currency === 'MZN' || currency === 'MT';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName || cleanName.length < 3) {
      setErrorMessage('Por favor, digite seu nome completo.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    setLoading(true);

    try {
      const result = await createCheckoutOrder({
        productId: product.id,
        productName: product.name,
        amount: finalPrice,
        currency,
        customer: {
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone || undefined
        },
        deliveryMode: product.delivery_mode || 'automatic'
      });

      if (!result.success) {
        throw new Error(result.message || 'Falha ao gerar pagamento PaySuite');
      }

      // Redireciona para o checkout do PaySuite ou retorno de simulação
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        window.location.href = `/pagamento/retorno?ref=${result.reference}&token=${result.accessToken}`;
      }
    } catch (err: any) {
      console.error('Erro no checkout PaySuite:', err);
      setErrorMessage(err?.message || 'Falha na conexão com o PaySuite. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/30 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative flex flex-col">
        {/* Top Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrandLogo size="sm" variant="neon" showText={false} />
            <div>
              <span className="text-sm font-black text-white flex items-center gap-1">
                Digitall<span className="text-emerald-400">Pay</span>
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-emerald-400" /> Checkout Seguro PaySuite
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumo da Compra */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-b border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Você está adquirindo:
              </span>
              <h4 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-sm">
                {product.name}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                ⚡ Acesso e entregáveis liberados imediatamente após o pagamento
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
              <span className="text-lg sm:text-xl font-black text-emerald-400">
                {formatPrice(finalPrice, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Formulário de Identificação do Comprador */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Nome Completo *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Manuel Silva"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* E-mail */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              E-mail para Recebimento *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              📧 Os links de acesso, comprovativo e entregáveis serão vinculados a este e-mail.
            </p>
          </div>

          {/* Telefone / M-Pesa / WhatsApp */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Telemóvel (M-Pesa / E-Mola / WhatsApp)
            </label>
            <div className="relative">
              <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder={isMozambique ? '+258 84/85/86/87 ...' : '+55 (11) 99999-9999'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Formas de Pagamento Aceitas via PaySuite */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Aceita: M-Pesa, E-Mola, Visa, Mastercard</span>
            </span>
            <span className="text-[10px] font-bold uppercase text-emerald-400">
              Gateway PaySuite
            </span>
          </div>

          {/* Botão de Pagamento */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Iniciando PaySuite...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 stroke-[2.5]" />
                <span>Pagar {formatPrice(finalPrice, currency)} com PaySuite</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Transação 100% Criptografada • Seus dados nunca são partilhados</span>
          </p>
        </form>
      </div>
    </div>
  );
};
