import 'server-only';
import type { Filter } from 'mongodb';
import { ordersCol } from '@/server/models/collections';
import type { FulfilmentStatus, OrderDoc } from '@/server/models/types';
import type { OrderFilters } from '@/lib/validation/admin';

export const PAGE_SIZE = 25;
export const EXPORT_LIMIT = 5000;

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function buildFilter(f: Pick<OrderFilters, 'q' | 'status' | 'fulfilment'>): Filter<OrderDoc> {
  const filter: Filter<OrderDoc> = {};
  if (f.status !== 'all') filter.status = f.status as OrderDoc['status'];
  if (f.fulfilment !== 'all') {
    // Orders created before fulfilment tracking count as "new".
    filter.$and = [
      f.fulfilment === 'new'
        ? { $or: [{ 'fulfilment.status': 'new' }, { fulfilment: { $exists: false } }] }
        : { 'fulfilment.status': f.fulfilment },
    ];
  }
  if (f.q) {
    const rx = new RegExp(escapeRegex(f.q), 'i');
    filter.$or = [
      { 'customer.name': rx },
      { 'customer.email': rx },
      { 'customer.phone': rx },
      { 'customer.city': rx },
      { publicId: new RegExp('^' + escapeRegex(f.q.toLowerCase())) },
      { 'razorpay.paymentId': rx },
    ];
  }
  return filter;
}

export async function listOrders(f: OrderFilters) {
  const col = await ordersCol();
  const filter = buildFilter(f);
  const [orders, total] = await Promise.all([
    col
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((f.page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray(),
    col.countDocuments(filter),
  ]);
  return { orders, total, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function orderStats() {
  const col = await ordersCol();
  const [row] = await col
    .aggregate<{ count: number; revenue: number; cans: number }>([
      { $match: { status: 'paid' } },
      { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: '$pricing.total' }, cans: { $sum: '$qty' } } },
    ])
    .toArray();
  const toShip = await col.countDocuments({
    status: 'paid',
    $or: [{ 'fulfilment.status': 'new' }, { fulfilment: { $exists: false } }],
  });
  return { paidOrders: row?.count ?? 0, revenue: row?.revenue ?? 0, cans: row?.cans ?? 0, toShip };
}

export async function exportOrders(f: Pick<OrderFilters, 'q' | 'status' | 'fulfilment'>) {
  const col = await ordersCol();
  return col.find(buildFilter(f)).sort({ createdAt: -1 }).limit(EXPORT_LIMIT).toArray();
}

export async function getAdminOrder(publicId: string) {
  return (await ordersCol()).findOne({ publicId });
}

export async function updateFulfilment(publicId: string, status: FulfilmentStatus, note?: string) {
  const col = await ordersCol();
  return col.findOneAndUpdate(
    { publicId },
    { $set: { fulfilment: { status, ...(note ? { note } : {}), updatedAt: new Date() }, updatedAt: new Date() } },
    { returnDocument: 'after' },
  );
}
