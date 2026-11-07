import 'server-only';
import { randomBytes } from 'node:crypto';
import { ordersCol } from '@/server/models/collections';
import type { OrderDoc } from '@/server/models/types';
import { calcPrices } from '@/lib/pricing';
import { HttpError } from '@/lib/http';
import type { CreateOrderInput } from '@/lib/validation/order';
import { findValidCoupon, recordCouponUse } from './coupons';
import { createRazorpayOrder, getRazorpayConfig } from './razorpay';

export async function createOrder(input: CreateOrderInput) {
  let couponCode: string | null = null;
  let couponPct = 0;
  if (input.couponCode) {
    const coupon = await findValidCoupon(input.couponCode);
    if (!coupon) throw new HttpError(400, 'This coupon is invalid or expired.', 'invalid_coupon');
    couponCode = coupon.code;
    couponPct = coupon.discountPct;
  }

  const price = calcPrices(input.qty, couponPct);
  if (price.total < 1) throw new HttpError(400, 'Invalid order total.');

  const publicId = randomBytes(16).toString('hex');
  const rzpOrder = await createRazorpayOrder({
    amountPaise: price.total * 100,
    receipt: publicId.slice(0, 40),
    notes: { publicId, qty: String(input.qty), coupon: couponCode ?? 'none' },
  });

  const now = new Date();
  const doc: OrderDoc = {
    publicId,
    status: 'created',
    customer: input.customer,
    qty: input.qty,
    pricing: {
      base: price.base,
      bulkPct: price.bulkPct,
      bulkAmt: price.bulkAmt,
      couponCode,
      couponPct,
      couponAmt: price.couponAmt,
      total: price.total,
    },
    razorpay: { orderId: rzpOrder.id },
    fulfilment: { status: 'new' },
    createdAt: now,
    updatedAt: now,
  };
  await (await ordersCol()).insertOne(doc);

  return {
    publicId,
    razorpayOrderId: rzpOrder.id,
    amount: price.total,
    keyId: getRazorpayConfig().keyId,
  };
}

/** Idempotent: only the first transition to "paid" counts the coupon use. */
export async function markOrderPaid(filter: { publicId: string } | { 'razorpay.orderId': string }, paymentId: string) {
  const col = await ordersCol();
  const now = new Date();
  const updated = await col.findOneAndUpdate(
    { ...filter, status: { $ne: 'paid' } },
    { $set: { status: 'paid', 'razorpay.paymentId': paymentId, paidAt: now, updatedAt: now } },
    { returnDocument: 'after' },
  );
  if (updated) {
    if (updated.pricing.couponCode) await recordCouponUse(updated.pricing.couponCode);
    return updated;
  }
  return col.findOne(filter);
}

export async function markOrderFailed(razorpayOrderId: string) {
  const col = await ordersCol();
  await col.updateOne(
    { 'razorpay.orderId': razorpayOrderId, status: 'created' },
    { $set: { status: 'failed', updatedAt: new Date() } },
  );
}

export async function getOrderByPublicId(publicId: string) {
  return (await ordersCol()).findOne({ publicId });
}

export async function getOrderByRazorpayId(razorpayOrderId: string) {
  return (await ordersCol()).findOne({ 'razorpay.orderId': razorpayOrderId });
}

/** Minimal, non-sensitive view for the thank-you page. */
export function toPublicOrder(o: OrderDoc) {
  return {
    publicId: o.publicId,
    status: o.status,
    firstName: o.customer.name.split(' ')[0],
    qty: o.qty,
    amount: o.pricing.total,
    paymentId: o.status === 'paid' ? (o.razorpay.paymentId ?? null) : null,
  };
}
