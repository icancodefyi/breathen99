import { describe, expect, it } from 'vitest';
import { calcPrices } from './pricing';

describe('calcPrices', () => {
  it('charges base price for 1–3 cans', () => {
    expect(calcPrices(1).total).toBe(495);
    expect(calcPrices(3).total).toBe(1485);
  });

  it('applies the Buy 4 Get 2 Free tier from 4 cans', () => {
    const p = calcPrices(4);
    expect(p.base).toBe(1980);
    expect(p.bulkPct).toBe(33);
    expect(p.total).toBe(1327);
  });

  it('applies coupon on top of the bulk discount', () => {
    expect(calcPrices(1, 10).couponAmt).toBe(50);
    expect(calcPrices(1, 10).total).toBe(445);
    expect(calcPrices(4, 10).total).toBe(1327 - Math.round(1327 * 0.1));
  });

  it('never returns a fractional rupee total', () => {
    for (let q = 1; q <= 50; q++)
      for (const c of [0, 5, 10, 33]) expect(Number.isInteger(calcPrices(q, c).total)).toBe(true);
  });
});
