import 'server-only';
import type { Collection } from 'mongodb';
import { getDb } from '@/lib/db/mongo';
import type { CouponDoc, OrderDoc, RateLimitDoc } from './types';

let indexesReady: Promise<void> | null = null;

async function ensureIndexes() {
  const db = await getDb();
  await Promise.all([
    db
      .collection('orders')
      .createIndexes([
        { key: { publicId: 1 }, unique: true },
        { key: { 'razorpay.orderId': 1 }, unique: true },
        { key: { createdAt: -1 } },
        { key: { status: 1, createdAt: -1 } },
      ]),
    db.collection('coupons').createIndex({ code: 1 }, { unique: true }),
    db.collection('rate_limits').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);
}

function ready() {
  indexesReady ??= ensureIndexes().catch((e) => {
    indexesReady = null;
    throw e;
  });
  return indexesReady;
}

export async function ordersCol(): Promise<Collection<OrderDoc>> {
  await ready();
  return (await getDb()).collection<OrderDoc>('orders');
}

export async function couponsCol(): Promise<Collection<CouponDoc>> {
  await ready();
  return (await getDb()).collection<CouponDoc>('coupons');
}

export async function rateLimitsCol(): Promise<Collection<RateLimitDoc>> {
  await ready();
  return (await getDb()).collection<RateLimitDoc>('rate_limits');
}
