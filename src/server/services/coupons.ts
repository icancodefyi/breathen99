import 'server-only';
import { couponsCol } from '@/server/models/collections';

export interface ValidCoupon {
  code: string;
  discountPct: number;
}

/** Returns the coupon if it can be used right now, otherwise null. */
export async function findValidCoupon(code: string): Promise<ValidCoupon | null> {
  const col = await couponsCol();
  const c = await col.findOne({ code });
  if (!c || !c.active) return null;
  if (c.expiresAt && c.expiresAt.getTime() < Date.now()) return null;
  if (c.usageLimit != null && c.usedCount >= c.usageLimit) return null;
  return { code: c.code, discountPct: c.discountPct };
}

export async function recordCouponUse(code: string) {
  const col = await couponsCol();
  await col.updateOne({ code }, { $inc: { usedCount: 1 } });
}
