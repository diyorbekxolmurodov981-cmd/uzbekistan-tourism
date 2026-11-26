export type Currency = 'USD' | 'UZS' | 'EUR';
const RATES: Record<Currency, number> = { USD: 1, UZS: 12850, EUR: 0.92 };
export function calculatePrice(params: {
  basePrice: number;
  baseCurrency: Currency;
  targetCurrency: Currency;
  adults: number;
  children: number;
  isPrivate: boolean;
}) {
  const inUsd = params.basePrice / RATES[params.baseCurrency];
  const guestTotal = inUsd * params.adults + inUsd * 0.5 * params.children;
  const finalUsd = params.isPrivate ? guestTotal * 1.35 : guestTotal;
  const converted = finalUsd * RATES[params.targetCurrency];
  return params.targetCurrency === 'UZS' ? Math.round(converted / 1000) * 1000 : Math.round(converted);
}