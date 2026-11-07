import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from '@/components/admin/admin.module.css';
import FulfilmentForm from '@/components/admin/FulfilmentForm';
import { orderPublicIdSchema } from '@/lib/validation/admin';
import { requireAdminPage } from '@/server/services/admin-auth';
import { getAdminOrder } from '@/server/services/admin-orders';
import { orderRef } from '@/server/emails/templates';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const when = (d?: Date) =>
  d ? d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'medium' }) : '—';

export default async function AdminOrderPage({ params }: { params: Promise<{ publicId: string }> }) {
  await requireAdminPage();
  const { publicId } = await params;
  if (!orderPublicIdSchema.safeParse(publicId).success) notFound();
  const o = await getAdminOrder(publicId);
  if (!o) notFound();

  const f = o.fulfilment?.status ?? 'new';
  const p = o.pricing;

  return (
    <main className={styles.main}>
      <Link href="/admin" className={styles.back}>
        ← All orders
      </Link>
      <h1 className={styles.h1}>
        Order {orderRef(o)} <span className={`${styles.badge} ${styles[o.status]}`}>{o.status}</span>{' '}
        <span className={`${styles.badge} ${styles[f]}`}>{f}</span>
      </h1>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Customer</h2>
          <dl className={styles.dl}>
            <dt>Name</dt>
            <dd>{o.customer.name}</dd>
            <dt>Phone</dt>
            <dd>
              <a href={`tel:${o.customer.phone}`}>{o.customer.phone}</a>
            </dd>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${o.customer.email}`}>{o.customer.email}</a>
            </dd>
            <dt>Address</dt>
            <dd>
              {o.customer.address}
              <br />
              {o.customer.city}, {o.customer.state} — {o.customer.pin}
            </dd>
          </dl>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Payment</h2>
          <dl className={styles.dl}>
            <dt>Quantity</dt>
            <dd>{o.qty}</dd>
            <dt>Subtotal</dt>
            <dd>{inr(p.base)}</dd>
            <dt>Bulk discount</dt>
            <dd>{p.bulkAmt ? `−${inr(p.bulkAmt)} (${p.bulkPct}%)` : '—'}</dd>
            <dt>Coupon</dt>
            <dd>{p.couponCode ? `${p.couponCode}: −${inr(p.couponAmt)} (${p.couponPct}%)` : '—'}</dd>
            <dt>Total</dt>
            <dd>
              <strong>{inr(p.total)}</strong>
            </dd>
            <dt>Razorpay order</dt>
            <dd>{o.razorpay.orderId}</dd>
            <dt>Payment ID</dt>
            <dd>{o.razorpay.paymentId ?? '—'}</dd>
          </dl>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Fulfilment</h2>
          <FulfilmentForm publicId={o.publicId} status={f} note={o.fulfilment?.note ?? ''} />
          <p className={styles.muted} style={{ marginTop: 12 }}>
            Last updated: {when(o.fulfilment?.updatedAt)}
          </p>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Timeline</h2>
          <dl className={styles.dl}>
            <dt>Created</dt>
            <dd>{when(o.createdAt)}</dd>
            <dt>Paid</dt>
            <dd>{when(o.paidAt)}</dd>
            <dt>Confirmation email</dt>
            <dd>{o.emails?.confirmationAt ? `Sent ${when(o.emails.confirmationAt)}` : 'Not sent'}</dd>
            <dt>Founder alert</dt>
            <dd>{o.emails?.alertAt ? `Sent ${when(o.emails.alertAt)}` : 'Not sent'}</dd>
          </dl>
        </section>
      </div>
    </main>
  );
}
