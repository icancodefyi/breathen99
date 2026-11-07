import { handleError, HttpError, json } from '@/lib/http';
import { verifyWebhookSignature } from '@/lib/razorpay-signature';
import { getServerEnv } from '@/lib/env';
import { getOrderByRazorpayId, markOrderFailed, markOrderPaid } from '@/server/services/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RzpPaymentEntity {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
}
interface RzpWebhook {
  event: string;
  payload?: { payment?: { entity?: RzpPaymentEntity } };
}

export async function POST(req: Request) {
  try {
    const { RAZORPAY_WEBHOOK_SECRET } = getServerEnv();
    if (!RAZORPAY_WEBHOOK_SECRET) throw new HttpError(503, 'Webhook not configured.');

    const raw = await req.text();
    const signature = req.headers.get('x-razorpay-signature') ?? '';
    if (!signature || !verifyWebhookSignature(raw, signature, RAZORPAY_WEBHOOK_SECRET)) {
      throw new HttpError(400, 'Invalid signature.');
    }

    let event: RzpWebhook;
    try {
      event = JSON.parse(raw);
    } catch {
      throw new HttpError(400, 'Invalid payload.');
    }

    const payment = event.payload?.payment?.entity;
    if (!payment?.order_id) return json({ ok: true, ignored: true });

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const order = await getOrderByRazorpayId(payment.order_id);
      if (!order) return json({ ok: true, ignored: true });
      // Never trust a payment whose amount differs from what we priced.
      if (payment.amount !== order.pricing.total * 100 || payment.currency !== 'INR') {
        console.error('[webhook] amount mismatch', { order: order.publicId, got: payment.amount });
        return json({ ok: true, ignored: true });
      }
      await markOrderPaid({ 'razorpay.orderId': payment.order_id }, payment.id);
    } else if (event.event === 'payment.failed') {
      await markOrderFailed(payment.order_id);
    }

    return json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}
