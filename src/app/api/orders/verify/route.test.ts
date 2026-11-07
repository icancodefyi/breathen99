import { createHmac } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const KEY_SECRET = 'key_secret_test';
const getOrderByPublicId = vi.fn();
const markOrderPaid = vi.fn();

vi.mock('@/server/services/rate-limit', () => ({ enforceRateLimit: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/server/services/razorpay', () => ({
  getRazorpayConfig: () => ({ keyId: 'rzp_test', keySecret: KEY_SECRET }),
}));
vi.mock('@/server/services/orders', () => ({
  getOrderByPublicId,
  markOrderPaid,
  toPublicOrder: (o: { publicId: string }) => ({ publicId: o.publicId }),
}));

const { POST } = await import('./route');

const order = { publicId: 'a'.repeat(32), razorpay: { orderId: 'order_1' } };
const sig = (o: string, p: string) => createHmac('sha256', KEY_SECRET).update(`${o}|${p}`).digest('hex');
const call = (body: unknown) =>
  POST(new Request('http://x/api/orders/verify', { method: 'POST', body: JSON.stringify(body) }));
const good = {
  orderId: order.publicId,
  razorpay_order_id: 'order_1',
  razorpay_payment_id: 'pay_1',
  razorpay_signature: sig('order_1', 'pay_1'),
};

beforeEach(() => {
  vi.clearAllMocks();
  getOrderByPublicId.mockResolvedValue(order);
  markOrderPaid.mockResolvedValue(order);
});

describe('POST /api/orders/verify', () => {
  it('marks paid for a valid signature', async () => {
    const res = await call(good);
    expect(res.status).toBe(200);
    expect(markOrderPaid).toHaveBeenCalledWith({ publicId: order.publicId }, 'pay_1');
  });

  it('rejects a forged signature', async () => {
    const res = await call({ ...good, razorpay_signature: 'f'.repeat(64) });
    expect(res.status).toBe(400);
    expect(markOrderPaid).not.toHaveBeenCalled();
  });

  it('rejects a valid signature replayed with a different payment id', async () => {
    const res = await call({ ...good, razorpay_payment_id: 'pay_other' });
    expect(res.status).toBe(400);
    expect(markOrderPaid).not.toHaveBeenCalled();
  });

  it('404s when the Razorpay order id does not belong to this order', async () => {
    const res = await call({ ...good, razorpay_order_id: 'order_999', razorpay_signature: sig('order_999', 'pay_1') });
    expect(res.status).toBe(404);
    expect(markOrderPaid).not.toHaveBeenCalled();
  });

  it('404s for an unknown order', async () => {
    getOrderByPublicId.mockResolvedValue(null);
    expect((await call(good)).status).toBe(404);
  });

  it('400s on a malformed body', async () => {
    expect((await call({ orderId: 'x' })).status).toBe(400);
  });
});
