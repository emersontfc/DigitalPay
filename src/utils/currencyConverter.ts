/**
 * Conversor dinâmico de moedas para precificação internacional no checkout e páginas de vendas
 */
export function convertCurrency(amount: number, fromCurrency = 'BRL', toCurrency = 'USD'): number {
  if (!amount || amount <= 0) return 0;
  const from = (fromCurrency || 'BRL').toUpperCase();
  const to = (toCurrency || 'USD').toUpperCase();
  if (from === to) return amount;

  // 1. Normalização para BRL
  let amountInBrl = amount;
  if (from === 'USD') amountInBrl = amount * 5.50;
  else if (from === 'EUR') amountInBrl = amount * 6.00;
  else if (from === 'GBP') amountInBrl = amount * 7.00;
  else if (from === 'AOA') amountInBrl = amount * 0.006;
  else if (from === 'MZN') amountInBrl = amount * 0.086;

  // 2. De BRL para a moeda de destino
  let converted = amountInBrl;
  if (to === 'USD') converted = amountInBrl / 5.50;
  else if (to === 'EUR') converted = amountInBrl / 6.00;
  else if (to === 'GBP') converted = amountInBrl / 7.00;
  else if (to === 'AOA') converted = amountInBrl / 0.006;
  else if (to === 'MZN') converted = amountInBrl / 0.086;
  else if (to === 'BRL') converted = amountInBrl;

  // 3. Arredondamento inteligente de alta conversão por moeda
  if (to === 'MZN') {
    // Em Moçambique arredonda para múltiplos de 10 (ex: 430 MT, 1.130 MT, 2.290 MT)
    return Math.round(converted / 10) * 10;
  }
  if (to === 'AOA') {
    // Em Angola arredonda para centenas (ex: 15.000 Kz, 32.800 Kz)
    return Math.round(converted / 100) * 100;
  }
  if (converted <= 15) return Math.round(converted * 2) / 2 || 9;
  if (converted <= 100) return Math.round(converted);
  return Math.round(converted);
}
