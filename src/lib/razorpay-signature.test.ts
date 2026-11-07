import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { verifyPaymentSignature, verifyWebhookSignature } from './razorpay-signature';

const hmac = (secret: string, data: string) => createHmac('sha256', secret).update(data).digest('hex');

describe('verifyPaymentSignature', () => {
  const sig = hmac('secret', 'order_1|pay_1');
  it('accepts a correct signature', () => expect(verifyPaymentSignature('order_1', 'pay_1', sig, 'secret')).toBe(true));
  it('rejects a different payment id', () =>
    expect(verifyPaymentSignature('order_1', 'pay_2', sig, 'secret')).toBe(false));
  it('rejects a different order id', () =>
    expect(verifyPaymentSignature('order_2', 'pay_1', sig, 'secret')).toBe(false));
  it('rejects the wrong secret', () => expect(verifyPaymentSignature('order_1', 'pay_1', sig, 'other')).toBe(false));
  it('rejects garbage and empty signatures', () => {
    expect(verifyPaymentSignature('order_1', 'pay_1', 'nope', 'secret')).toBe(false);
    expect(verifyPaymentSignature('order_1', 'pay_1', '', 'secret')).toBe(false);
  });
});

describe('verifyWebhookSignature', () => {
  const body = '{"event":"payment.captured"}';
  const sig = hmac('whsec', body);
  it('accepts the exact body', () => expect(verifyWebhookSignature(body, sig, 'whsec')).toBe(true));
  it('rejects a tampered body', () => expect(verifyWebhookSignature(body + ' ', sig, 'whsec')).toBe(false));
  it('rejects the wrong secret', () => expect(verifyWebhookSignature(body, sig, 'x')).toBe(false));
});
