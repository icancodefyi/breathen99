import Link from 'next/link';
import styles from '@/components/admin/admin.module.css';
import { orderFiltersSchema } from '@/lib/validation/admin';
import { requireAdminPage } from '@/server/services/admin-auth';
import { listOrders, orderStats } from '@/server/services/admin-orders';
import { getSetupStatus } from '@/server/services/setup-status';
import { orderRef } from '@/server/emails/templates';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const when = (d?: Date) =>
  d ? d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) : '—';

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdminPage();

  const raw = await searchParams;
  const flat = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
  const parsed = orderFiltersSchema.safeParse(flat);
  const filters = parsed.success ? parsed.data : orderFiltersSchema.parse({});

  const [{ orders, total, pages }, stats] = await Promise.all([listOrders(filters), orderStats()]);
  const todo = getSetupStatus().filter((x) => !x.ok);

  const qs = (over: Record<string, string | number>) => {
    const p = new URLSearchParams();
    if (filters.q) p.set('q', filters.q);
    if (filters.status !== 'paid') p.set('status', filters.status);
    if (filters.fulfilment !== 'all') p.set('fulfilment', filters.fulfilment);
    for (const [k, v] of Object.entries(over)) p.set(k, String(v));
    const s = p.toString();
    return s ? `?${s}` : '';
  };
  const exportQs = qs({}).replace(/([?&])page=\d+&?/, '$1');

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>Orders</h1>

      {todo.length > 0 && (
        <section className={styles.setup} aria-label="Setup needed">
          <h2 className={styles.cardTitle}>Setup needed</h2>
          <ul>
            {todo.map((t) => (
              <li key={t.key}>
                <strong>{t.label}</strong> <span className={`${styles.badge} ${styles[t.level]}`}>{t.level}</span>
                <div className={styles.muted}>
                  <code>{t.key}</code> — {t.hint}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className={styles.tiles}>
        <div className={styles.tile}>
          <div className={styles.tileLabel}>Paid orders</div>
          <div className={styles.tileValue}>{stats.paidOrders}</div>
        </div>
        <div className={styles.tile}>
          <div className={styles.tileLabel}>Revenue</div>
          <div className={styles.tileValue}>{inr(stats.revenue)}</div>
        </div>
        <div className={styles.tile}>
          <div className={styles.tileLabel}>Cans sold</div>
          <div className={styles.tileValue}>{stats.cans}</div>
        </div>
        <div className={styles.tile}>
          <div className={styles.tileLabel}>To ship</div>
          <div className={styles.tileValue}>{stats.toShip}</div>
        </div>
      </div>

      <form method="get" action="/admin" className={styles.filters}>
        <label className={styles.field}>
          Search
          <input
            className={styles.input}
            name="q"
            defaultValue={filters.q ?? ''}
            placeholder="Name, phone, email, order ID"
          />
        </label>
        <label className={styles.field}>
          Payment
          <select className={styles.select} name="status" defaultValue={filters.status}>
            <option value="paid">Paid</option>
            <option value="created">Awaiting payment</option>
            <option value="failed">Failed</option>
            <option value="all">All</option>
          </select>
        </label>
        <label className={styles.field}>
          Fulfilment
          <select className={styles.select} name="fulfilment" defaultValue={filters.fulfilment}>
            <option value="all">All</option>
            <option value="new">New (to ship)</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <button type="submit" className={styles.btn}>
          Filter
        </button>
        <a className={`${styles.btn} ${styles.btnGhost}`} href={`/api/admin/orders/export${exportQs}`}>
          Export CSV
        </a>
      </form>

      <div className={styles.tableWrap}>
        {orders.length === 0 ? (
          <div className={styles.empty}>No orders match these filters.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Location</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Fulfilment</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const f = o.fulfilment?.status ?? 'new';
                return (
                  <tr key={o.publicId}>
                    <td>
                      <Link href={`/admin/orders/${o.publicId}`}>{orderRef(o)}</Link>
                    </td>
                    <td className={styles.muted}>{when(o.paidAt ?? o.createdAt)}</td>
                    <td>
                      {o.customer.name}
                      <div className={styles.muted}>
                        {o.customer.phone} · {o.customer.email}
                      </div>
                    </td>
                    <td className={styles.muted}>
                      {o.customer.city}, {o.customer.state}
                    </td>
                    <td>{o.qty}</td>
                    <td>
                      {inr(o.pricing.total)}
                      {o.pricing.couponCode && <div className={styles.muted}>{o.pricing.couponCode}</div>}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles[o.status]}`}>{o.status}</span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles[f]}`}>{f}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.pager}>
        {filters.page > 1 && (
          <Link className={`${styles.btn} ${styles.btnGhost}`} href={`/admin${qs({ page: filters.page - 1 })}`}>
            ← Newer
          </Link>
        )}
        <span className={styles.muted}>
          Page {filters.page} of {pages} · {total} order{total === 1 ? '' : 's'}
        </span>
        {filters.page < pages && (
          <Link className={`${styles.btn} ${styles.btnGhost}`} href={`/admin${qs({ page: filters.page + 1 })}`}>
            Older →
          </Link>
        )}
      </div>
    </main>
  );
}
