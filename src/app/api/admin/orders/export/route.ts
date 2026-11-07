import { handleError } from '@/lib/http';
import { toCsv } from '@/lib/csv';
import { orderFiltersSchema } from '@/lib/validation/admin';
import { requireAdminApi } from '@/server/services/admin-auth';
import { exportOrders } from '@/server/services/admin-orders';
import { orderRef } from '@/server/emails/templates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await requireAdminApi(req);
    const params = Object.fromEntries(new URL(req.url).searchParams);
    const filters = orderFiltersSchema.parse(params);
    const orders = await exportOrders(filters);

    const csv = toCsv(
      [
        'Order ref',
        'Order ID',
        'Created',
        'Paid at',
        'Payment status',
        'Fulfilment',
        'Name',
        'Phone',
        'Email',
        'Address',
        'City',
        'State',
        'PIN',
        'Qty',
        'Subtotal',
        'Bulk discount',
        'Coupon',
        'Coupon %',
        'Coupon discount',
        'Total',
        'Razorpay order',
        'Payment ID',
      ],
      orders.map((o) => [
        orderRef(o),
        o.publicId,
        o.createdAt,
        o.paidAt,
        o.status,
        o.fulfilment?.status ?? 'new',
        o.customer.name,
        o.customer.phone,
        o.customer.email,
        o.customer.address,
        o.customer.city,
        o.customer.state,
        o.customer.pin,
        o.qty,
        o.pricing.base,
        o.pricing.bulkAmt,
        o.pricing.couponCode,
        o.pricing.couponPct,
        o.pricing.couponAmt,
        o.pricing.total,
        o.razorpay.orderId,
        o.razorpay.paymentId,
      ]),
    );
    const stamp = new Date().toISOString().slice(0, 10);
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="breathen99-orders-${stamp}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    return handleError(err);
  }
}
