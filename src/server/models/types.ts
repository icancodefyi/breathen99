import type { Customer } from '@/lib/validation/order';

export type OrderStatus = 'created' | 'paid' | 'failed';

export interface OrderDoc {
  publicId: string;
  status: OrderStatus;
  customer: Customer;
  qty: number;
  pricing: {
    base: number;
    bulkPct: number;
    bulkAmt: number;
    couponCode: string | null;
    couponPct: number;
    couponAmt: number;
    total: number;
  };
  razorpay: { orderId: string; paymentId?: string };
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
}

export interface CouponDoc {
  code: string;
  discountPct: number;
  active: boolean;
  expiresAt?: Date | null;
  usageLimit?: number | null;
  usedCount: number;
  createdAt: Date;
}

export interface RateLimitDoc {
  _id: string;
  count: number;
  expiresAt: Date;
}
