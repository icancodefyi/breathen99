import { describe, expect, it } from 'vitest';
import { createOrderSchema, validateCouponSchema } from './order';

const valid = {
  customer: {
    name: 'Rahul Sharma',
    phone: '98765 43210',
    email: 'Rahul@Example.com',
    address: '12 Main Street, Andheri',
    city: 'Mumbai',
    pin: '400001',
    state: 'Maharashtra',
  },
  qty: 2,
};

describe('createOrderSchema', () => {
  it('accepts a valid order and normalises phone/email', () => {
    const out = createOrderSchema.parse(valid);
    expect(out.customer.phone).toBe('9876543210');
    expect(out.customer.email).toBe('rahul@example.com');
  });

  it.each([
    ['qty 0', { ...valid, qty: 0 }],
    ['qty above max', { ...valid, qty: 51 }],
    ['fractional qty', { ...valid, qty: 1.5 }],
    ['string qty', { ...valid, qty: '2' }],
    ['bad pin', { ...valid, customer: { ...valid.customer, pin: '12' } }],
    ['bad phone', { ...valid, customer: { ...valid.customer, phone: '1234567890' } }],
    ['unknown state', { ...valid, customer: { ...valid.customer, state: 'Mars' } }],
    ['bad email', { ...valid, customer: { ...valid.customer, email: 'nope' } }],
    ['bad coupon chars', { ...valid, couponCode: 'a b!' }],
  ])('rejects %s', (_label, input) => {
    expect(createOrderSchema.safeParse(input).success).toBe(false);
  });

  it('treats an empty coupon as no coupon and uppercases real ones', () => {
    expect(createOrderSchema.parse({ ...valid, couponCode: '' }).couponCode).toBeUndefined();
    expect(createOrderSchema.parse({ ...valid, couponCode: 'first10' }).couponCode).toBe('FIRST10');
  });

  it('does not let clients smuggle in a price', () => {
    const out = createOrderSchema.parse({ ...valid, amount: 1, total: 1 });
    expect(out).not.toHaveProperty('amount');
    expect(out).not.toHaveProperty('total');
  });
});

describe('validateCouponSchema', () => {
  it('uppercases and trims', () => expect(validateCouponSchema.parse({ code: ' first10 ' }).code).toBe('FIRST10'));
  it('rejects empty and oversized codes', () => {
    expect(validateCouponSchema.safeParse({ code: '' }).success).toBe(false);
    expect(validateCouponSchema.safeParse({ code: 'A'.repeat(31) }).success).toBe(false);
  });
});
