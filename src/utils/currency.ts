export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileiro (R$)' },
  { code: 'USD', symbol: '$', name: 'Dólar Americano ($)' },
  { code: 'EUR', symbol: '€', name: 'Euro (€)' },
  { code: 'AOA', symbol: 'Kz', name: 'Kwanza Angolano (Kz)' },
  { code: 'MZN', symbol: 'MT', name: 'Metical Moçambicano (MT)' },
  { code: 'CVE', symbol: 'Esc', name: 'Escudo Cabo-verdiano (Esc)' },
  { code: 'GBP', symbol: '£', name: 'Libra Esterlina (£)' },
];

export function getCurrencySymbol(code?: string): string {
  if (!code) return 'R$';
  const match = SUPPORTED_CURRENCIES.find(
    (c) => c.code.toUpperCase() === code.toUpperCase() || c.symbol === code
  );
  return match ? match.symbol : code;
}

export function formatPrice(amount: number | undefined | null, currencyCode?: string): string {
  const val = Number(amount) || 0;
  const symbol = getCurrencySymbol(currencyCode);
  const code = (currencyCode || 'BRL').toUpperCase();

  if (code === 'USD' || code === 'GBP') {
    return `${symbol} ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  if (code === 'EUR') {
    return `${symbol} ${val.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return `${symbol} ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export { convertCurrency } from './currencyConverter';
