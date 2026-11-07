import type { Metadata } from 'next';
import LegalPage from '@/components/layout/LegalPage';
import { legal } from '@/config/legal';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy — breathEN',
  description: 'How cancellations, returns and refunds work for breathEN orders.',
};

export default function RefundPolicyPage() {
  const r = legal.returns;
  return (
    <LegalPage title="Refund & Cancellation Policy">
      <p>
        We want you to be happy with your order. Because {legal.brand} is a sealed, pressurised product, our return
        rules are different from ordinary goods. Please read this policy before you buy.
      </p>

      <h2>1. Cancelling an order</h2>
      <ul>
        <li>
          You can cancel before your order is dispatched. Email <a href={`mailto:${legal.email}`}>{legal.email}</a> or
          call {legal.phone} with your order details.
        </li>
        <li>
          Once an order has been dispatched, it cannot be cancelled, but you may still use the returns process below if
          it qualifies.
        </li>
        <li>If we cancel your order, you get a full refund.</li>
      </ul>

      <h2>2. Damaged, defective or wrong items</h2>
      <p>
        If your canister arrives damaged, defective or is not what you ordered, tell us within{' '}
        <strong>{r.reportWithinHours} hours of delivery</strong> at <a href={`mailto:${legal.email}`}>{legal.email}</a>.
        Please include your order details and clear photos or a short video of the item and packaging. After we verify
        the issue we will send a replacement or refund you in full.
      </p>

      <h2>3. What we cannot take back</h2>
      <ul>
        <li>Canisters or masks that have been opened, used or tampered with, for hygiene and safety reasons.</li>
        <li>Items damaged after delivery through misuse, or stored or handled against the instructions.</li>
        <li>Requests made after the reporting window above, unless the law requires otherwise.</li>
      </ul>

      <h2>4. How refunds are paid</h2>
      <ul>
        <li>Approved refunds go back to the original payment method.</li>
        <li>
          Allow about {r.refundDays} for the money to reach your account after we approve the refund. Timing depends on
          your bank or payment provider.
        </li>
        <li>
          If a payment is deducted but the order fails, the amount is normally returned automatically by Razorpay. If it
          is not, contact us with the payment reference.
        </li>
      </ul>

      <h2>5. Contact</h2>
      <p>
        {legal.entityName}
        <br />
        {legal.address}
        <br />
        <a href={`mailto:${legal.email}`}>{legal.email}</a> · {legal.phone}
      </p>
    </LegalPage>
  );
}
