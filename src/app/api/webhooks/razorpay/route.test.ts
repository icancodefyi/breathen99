import { createHmac } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const SECRET = 'whsec_test';
const markOrderPaid = vi.fn();
const markOrderFailed = vi.fn();
const getOrderByRazorpayId = vi.fn();
const sendOrderEmailsOnce = vi.fn();

vi.mock('@/lib/env', () => ({ getServerEnv: () => ({ RAZORPAY_WEBHOOK_SECRET: SECRET }) }));
vi.mock('@/lib/after', () => ({ runAfter: (fn: () => unknown) => void fn() }));
vi.mock('@/server/services/notifications', () => ({ sendOrderEmailsOnce }));
vi.mock('@/server/services/orders', () => ({ markOrderPaid, markOrderFailed, getOrderByRazorpayId }));

const { POST } = await import('./route');

const sign = (body: string) => createHmac('sha256', SECRET).update(body).digest('hex');
const call = (event: unknown, signature?: string) => {
  const body = JSON.stringify(event);
  return POST(
    new Request('http://x/api/webhooks/razorpay', {
      method: 'POST',
      headers: { 'x-razorpay-signature': signature ?? sign(body) },
      body,
    }),
  );
};
const captured = (amount: number, currency = 'INR') => ({
  event: 'payment.captured',
  payload: { payment: { entity: { id: 'pay_1', order_id: 'order_1', amount, currency } } },
});

beforeEach(() => {
  vi.clearAllMocks();
  getOrderByRazorpayId.mockResolvedValue({ publicId: 'abc', pricing: { total: 495 } });
});

describe('POST /api/webhooks/razorpay', () => {
  it('rejects a bad signature without touching orders', async () => {
    const res = await call(captured(49500), 'deadbeef');
    expect(res.status).toBe(400);
    expect(markOrderPaid).not.toHaveBeenCalled();
  });

  it('rejects a missing signature', async () => {
    const res = await POST(new Request('http://x', { method: 'POST', body: '{}' }));
    expect(res.status).toBe(400);
  });

  it('marks the order paid when signature and amount match', async () => {
    const res = await call(captured(49500));
    expect(res.status).toBe(200);
    expect(markOrderPaid).toHaveBeenCalledWith({ 'razorpay.orderId': 'order_1' }, 'pay_1');
  });

  it('schedules order emails after confirming a paid order', async () => {
    markOrderPaid.mockResolvedValue({ publicId: 'abc', status: 'paid' });
    await call(captured(49500));
    expect(sendOrderEmailsOnce).toHaveBeenCalledWith('abc');
  });

  it('ignores a payment whose amount differs from the order total', async () => {
    const res = await call(captured(100));
    expect(res.status).toBe(200);
    expect(markOrderPaid).not.toHaveBeenCalled();
    expect(sendOrderEmailsOnce).not.toHaveBeenCalled();
  });

  it('ignores a payment in the wrong currency', async () => {
    await call(captured(49500, 'USD'));
    expect(markOrderPaid).not.toHaveBeenCalled();
  });

  it('ignores events for unknown orders', async () => {
    getOrderByRazorpayId.mockResolvedValue(null);
    await call(captured(49500));
    expect(markOrderPaid).not.toHaveBeenCalled();
  });

  it('records failed payments', async () => {
    await call({
      event: 'payment.failed',
      payload: { payment: { entity: { id: 'p', order_id: 'order_1', amount: 1, currency: 'INR' } } },
    });
    expect(markOrderFailed).toHaveBeenCalledWith('order_1');
  });
});
