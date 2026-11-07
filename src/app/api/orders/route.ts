import { clientIp, handleError, json, parseBody } from '@/lib/http';
import { createOrderSchema } from '@/lib/validation/order';
import { enforceRateLimit } from '@/server/services/rate-limit';
import { createOrder } from '@/server/services/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await enforceRateLimit(`order:${clientIp(req)}`, 10, 600);
    const input = await parseBody(req, createOrderSchema);
    return json(await createOrder(input), { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
