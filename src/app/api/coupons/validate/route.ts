import { clientIp, handleError, json, parseBody } from '@/lib/http';
import { validateCouponSchema } from '@/lib/validation/order';
import { enforceRateLimit } from '@/server/services/rate-limit';
import { findValidCoupon } from '@/server/services/coupons';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await enforceRateLimit(`coupon:${clientIp(req)}`, 10, 60);
    const { code } = await parseBody(req, validateCouponSchema);
    const coupon = await findValidCoupon(code);
    if (!coupon) return json({ valid: false, message: 'Invalid or expired coupon code.' });
    return json({ valid: true, code: coupon.code, discountPct: coupon.discountPct });
  } catch (err) {
    return handleError(err);
  }
}
