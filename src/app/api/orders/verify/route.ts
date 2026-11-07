import { clientIp, handleError, HttpError, json, parseBody } from '@/lib/http';
import { verifyPaymentSchema } from '@/lib/validation/order';
import { verifyPaymentSignature } from '@/lib/razorpay-signature';
import { enforceRateLimit } from '@/server/services/rate-limit';
import { getOrderByPublicId, markOrderPaid, toPublicOrder } from '@/server/services/orders';
import { getRazorpayConfig } from '@/server/services/razorpay';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await enforceRateLimit(`verify:${clientIp(req)}`, 20, 600);
    const body = await parseBody(req, verifyPaymentSchema);

    const order = await getOrderByPublicId(body.orderId);
    if (!order || order.razorpay.orderId !== body.razorpay_order_id) {
      throw new HttpError(404, 'Order not found.');
    }

    const { keySecret } = getRazorpayConfig();
    if (!verifyPaymentSignature(body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature, keySecret)) {
      throw new HttpError(400, 'Payment verification failed.', 'bad_signature');
    }

    const paid = await markOrderPaid({ publicId: order.publicId }, body.razorpay_payment_id);
    return json({ order: toPublicOrder(paid ?? order) });
  } catch (err) {
    return handleError(err);
  }
}
