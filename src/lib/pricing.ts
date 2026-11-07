import { pricing } from '@/config/pricing';

export interface PriceBreakdown {
  base: number;
  bulkPct: number;
  bulkAmt: number;
  couponPct: number;
  couponAmt: number;
  total: number;
}

export function getTier(qty: number) {
  return pricing.bulkTiers.find((t) => qty >= t.min && qty <= t.max) ?? pricing.bulkTiers[0];
}

/** Single source of truth for price math. Used by the server (authoritative) and the UI (display). All amounts are whole rupees. */
export function calcPrices(qty: number, couponPct = 0): PriceBreakdown & { tier: ReturnType<typeof getTier> } {
  const tier = getTier(qty);
  const base = pricing.basePrice * qty;
  const bulkAmt = Math.round((base * tier.discountPct) / 100);
  const afterBulk = base - bulkAmt;
  const couponAmt = couponPct > 0 ? Math.round((afterBulk * couponPct) / 100) : 0;
  return { base, bulkPct: tier.discountPct, bulkAmt, couponPct, couponAmt, total: afterBulk - couponAmt, tier };
}
