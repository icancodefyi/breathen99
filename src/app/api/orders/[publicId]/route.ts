import { clientIp, handleError, HttpError, json } from '@/lib/http';
import { enforceRateLimit } from '@/server/services/rate-limit';
import { getOrderByPublicId, toPublicOrder } from '@/server/services/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request, ctx: { params: Promise<{ publicId: string }> }) {
  try {
    const { publicId } = await ctx.params;
    if (!/^[a-f0-9]{32}$/.test(publicId)) throw new HttpError(404, 'Order not found.');
    await enforceRateLimit(`order-get:${clientIp(req)}`, 30, 60);
    const order = await getOrderByPublicId(publicId);
    if (!order) throw new HttpError(404, 'Order not found.');
    return json({ order: toPublicOrder(order) });
  } catch (err) {
    return handleError(err);
  }
}
