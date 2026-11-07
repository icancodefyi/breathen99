import 'server-only';
import Razorpay from 'razorpay';
import { getServerEnv, publicEnv } from '@/lib/env';
import { HttpError } from '@/lib/http';

export function getRazorpayConfig() {
  const keyId = publicEnv.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const { RAZORPAY_KEY_SECRET } = getServerEnv();
  if (!keyId || !RAZORPAY_KEY_SECRET) {
    console.error('[razorpay] key id/secret not configured');
    throw new HttpError(503, 'Payments are temporarily unavailable.', 'payments_unconfigured');
  }
  return { keyId, keySecret: RAZORPAY_KEY_SECRET };
}

export async function createRazorpayOrder(params: {
  amountPaise: number;
  receipt: string;
  notes: Record<string, string>;
}) {
  const { keyId, keySecret } = getRazorpayConfig();
  const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return rzp.orders.create({
    amount: params.amountPaise,
    currency: 'INR',
    receipt: params.receipt,
    notes: params.notes,
  });
}
