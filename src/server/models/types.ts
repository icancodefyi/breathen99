import type { Customer } from '@/lib/validation/order';

export type OrderStatus = 'created' | 'paid' | 'failed';
export type FulfilmentStatus = 'new' | 'shipped' | 'delivered' | 'cancelled';
export const FULFILMENT_STATUSES: readonly FulfilmentStatus[] = ['new', 'shipped', 'delivered', 'cancelled'];

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
  /** Set atomically when each email is claimed for sending, so it goes out exactly once. */
  emails?: { confirmationAt?: Date; alertAt?: Date };
  fulfilment?: { status: FulfilmentStatus; note?: string; updatedAt?: Date };
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
