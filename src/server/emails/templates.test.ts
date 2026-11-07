import { describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://shop.test';
});

const { newOrderAlertEmail, orderConfirmationEmail, orderRef } = await import('./templates');

const order = {
  publicId: 'abcdef0123456789abcdef0123456789',
  status: 'paid',
  qty: 2,
  customer: {
    name: '<script>alert(1)</script> Rahul',
    phone: '9876543210',
    email: 'r@example.com',
    address: '12 "Main" St & <b>Lane</b>',
    city: 'Mumbai',
    pin: '400001',
    state: 'Maharashtra',
  },
  pricing: { base: 990, bulkPct: 0, bulkAmt: 0, couponCode: 'FIRST10', couponPct: 10, couponAmt: 99, total: 891 },
  razorpay: { orderId: 'order_1', paymentId: 'pay_1' },
} as never;

describe('order emails', () => {
  it('builds a short, upper-case order reference', () => {
    expect(orderRef(order)).toBe('ABCDEF01');
  });

  it('escapes customer-supplied text in the confirmation HTML', () => {
    const { html, to } = orderConfirmationEmail(order);
    expect(to).toBe('r@example.com');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<b>Lane</b>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&amp;');
  });

  it('includes the amount and reference in subject and text', () => {
    const msg = orderConfirmationEmail(order);
    expect(msg.subject).toContain('ABCDEF01');
    expect(msg.text).toContain('₹891');
  });

  it('escapes the founder alert and links to the admin page', () => {
    const msg = newOrderAlertEmail(order, ['founder@example.com']);
    expect(msg.html).not.toContain('<script>');
    expect(msg.html).toContain('https://shop.test/admin/orders/abcdef0123456789abcdef0123456789');
    expect(msg.to).toEqual(['founder@example.com']);
    expect(msg.subject).not.toMatch(/[\r\n]/);
  });
});
