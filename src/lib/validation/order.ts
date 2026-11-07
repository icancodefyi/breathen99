import { z } from 'zod';
import { INDIAN_STATES } from '@/config/states';
import { pricing } from '@/config/pricing';

const trimmed = (min: number, max: number, msg: string) => z.string().trim().min(min, msg).max(max, msg);

export const customerSchema = z.object({
  name: trimmed(2, 100, 'Please enter your full name'),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, ''))
    .pipe(z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit number')),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address').max(200),
  address: trimmed(10, 300, 'Please enter your delivery address'),
  city: trimmed(2, 80, 'Please enter your city'),
  pin: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter a valid 6-digit PIN'),
  state: z.enum(INDIAN_STATES, { message: 'Please select your state' }),
});

export const couponCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9_-]{2,30}$/, 'Invalid coupon code');

export const createOrderSchema = z.object({
  customer: customerSchema,
  qty: z.number().int().min(1).max(pricing.maxQty),
  couponCode: couponCodeSchema.optional().or(z.literal('').transform(() => undefined)),
});

export const validateCouponSchema = z.object({ code: couponCodeSchema });

export const verifyPaymentSchema = z.object({
  orderId: z.string().min(10).max(64),
  razorpay_order_id: z.string().min(1).max(64),
  razorpay_payment_id: z.string().min(1).max(64),
  razorpay_signature: z.string().min(1).max(256),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type Customer = z.infer<typeof customerSchema>;
