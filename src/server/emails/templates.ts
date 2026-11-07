import { escapeHtml as h, oneLine } from '@/lib/html';
import { legal } from '@/config/legal';
import { siteConfig } from '@/config/site';
import type { OrderDoc } from '@/server/models/types';
import type { EmailMessage } from '@/server/services/email';

const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;
export const orderRef = (o: Pick<OrderDoc, 'publicId'>) => o.publicId.slice(0, 8).toUpperCase();

const addressLines = (o: OrderDoc) => {
  const c = o.customer;
  return [c.name, c.address, `${c.city}, ${c.state} — ${c.pin}`, `Phone: ${c.phone}`];
};

function layout(title: string, bodyHtml: string) {
  return `<!doctype html><html><body style="margin:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:6px;overflow:hidden">
<tr><td style="background:#e8260a;color:#fff;padding:16px 24px;font-size:20px;font-weight:bold">${h(siteConfig.name)}</td></tr>
<tr><td style="padding:24px"><h1 style="font-size:20px;margin:0 0 16px">${h(title)}</h1>${bodyHtml}</td></tr>
<tr><td style="padding:16px 24px;font-size:12px;color:#777;border-top:1px solid #eee">${h(legal.entityName)} · ${h(legal.address)}<br>${h(legal.email)} · ${h(legal.phone)}</td></tr>
</table></td></tr></table></body></html>`;
}

const row = (label: string, value: string) =>
  `<tr><td style="padding:6px 0;color:#777;width:140px;vertical-align:top">${h(label)}</td><td style="padding:6px 0">${value}</td></tr>`;

export function orderConfirmationEmail(o: OrderDoc): EmailMessage {
  const first = o.customer.name.split(' ')[0];
  const lines = addressLines(o);
  const html = layout(
    'Your order is confirmed',
    `<p style="line-height:1.6;margin:0 0 16px">Hi ${h(first)}, thank you for your order. We have received your payment and will start processing it.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
${row('Order reference', `<strong>${h(orderRef(o))}</strong>`)}
${row('Quantity', `${h(o.qty)} can${o.qty > 1 ? 's' : ''}`)}
${row('Amount paid', h(rupees(o.pricing.total)))}
${row('Shipping', 'Free')}
${row('Deliver to', lines.map(h).join('<br>'))}
${o.razorpay.paymentId ? row('Payment ID', h(o.razorpay.paymentId)) : ''}
</table>
<p style="line-height:1.6;margin:16px 0 0;font-size:14px">See our <a href="${h(siteConfig.url)}/shipping-policy">Shipping Policy</a> and <a href="${h(siteConfig.url)}/refund-policy">Refund &amp; Cancellation Policy</a>. Questions? Reply to this email or contact ${h(legal.email)}.</p>`,
  );
  const text = [
    `Hi ${first}, thank you for your order. We have received your payment and will start processing it.`,
    '',
    `Order reference: ${orderRef(o)}`,
    `Quantity: ${o.qty}`,
    `Amount paid: ${rupees(o.pricing.total)}`,
    'Shipping: Free',
    `Deliver to: ${lines.join(', ')}`,
    o.razorpay.paymentId ? `Payment ID: ${o.razorpay.paymentId}` : '',
    '',
    `Shipping Policy: ${siteConfig.url}/shipping-policy`,
    `Refund & Cancellation Policy: ${siteConfig.url}/refund-policy`,
    `Questions? Contact ${legal.email}`,
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n');
  return { to: o.customer.email, subject: `Your ${siteConfig.name} order ${orderRef(o)} is confirmed`, html, text };
}

export function newOrderAlertEmail(o: OrderDoc, to: string[]): EmailMessage {
  const lines = addressLines(o);
  const link = `${siteConfig.url}/admin/orders/${o.publicId}`;
  const coupon = o.pricing.couponCode ? `${o.pricing.couponCode} (${o.pricing.couponPct}% off)` : 'None';
  const html = layout(
    `New order ${orderRef(o)}`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
${row('Amount', `<strong>${h(rupees(o.pricing.total))}</strong>`)}
${row('Quantity', h(o.qty))}
${row('Coupon', h(coupon))}
${row('Customer', h(o.customer.name))}
${row('Phone', h(o.customer.phone))}
${row('Email', h(o.customer.email))}
${row('Address', lines.slice(1, 3).map(h).join('<br>'))}
${o.razorpay.paymentId ? row('Payment ID', h(o.razorpay.paymentId)) : ''}
</table>
<p style="margin:20px 0 0"><a href="${h(link)}" style="background:#e8260a;color:#fff;padding:10px 18px;border-radius:4px;text-decoration:none;font-size:14px">Open in admin</a></p>`,
  );
  const text = [
    `New order ${orderRef(o)} — ${rupees(o.pricing.total)} (${o.qty} can${o.qty > 1 ? 's' : ''})`,
    `Customer: ${o.customer.name}, ${o.customer.phone}, ${o.customer.email}`,
    `Address: ${lines.slice(1, 3).join(', ')}`,
    `Coupon: ${coupon}`,
    `Admin: ${link}`,
  ].join('\n');
  return { to, subject: oneLine(`New order ${rupees(o.pricing.total)} — ${o.customer.name} (${o.qty})`), html, text };
}
