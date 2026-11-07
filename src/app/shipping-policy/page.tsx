import type { Metadata } from 'next';
import LegalPage from '@/components/layout/LegalPage';
import { legal } from '@/config/legal';

export const metadata: Metadata = {
  title: 'Shipping Policy — breathEN',
  description: 'Delivery areas, timelines and charges for breathEN orders across India.',
};

export default function ShippingPolicyPage() {
  const s = legal.shipping;
  return (
    <LegalPage title="Shipping Policy">
      <h2>1. Where we deliver</h2>
      <p>
        We ship to addresses across India. Delivery to some remote pin codes may take longer or may not be possible. If
        we cannot deliver to your address, we will contact you and refund your payment in full.
      </p>

      <h2>2. Shipping charges</h2>
      <p>Shipping is free on all orders within India.</p>

      <h2>3. Timelines</h2>
      <ul>
        <li>
          <strong>Dispatch:</strong> within {s.dispatchDays} of your payment being confirmed.
        </li>
        <li>
          <strong>Delivery:</strong> typically {s.deliveryDays} after dispatch, depending on your location.
        </li>
      </ul>
      <p>
        These are estimates. Delays can happen because of weather, courier issues, holidays or other events outside our
        control.
      </p>

      <h2>4. Tracking</h2>
      <p>
        When your order ships we will share the courier and tracking details by email or phone using the details you
        gave at checkout. Please make sure your phone number, email and address are correct.
      </p>

      <h2>5. Failed deliveries</h2>
      <p>
        If the courier cannot reach you after several attempts, the parcel may be returned to us. We will contact you to
        arrange re-delivery, which may involve extra shipping charges, or a refund where appropriate.
      </p>

      <h2>6. Damaged on arrival</h2>
      <p>
        Please check your parcel on delivery. If it is visibly damaged, take photos and follow our{' '}
        <a href="/refund-policy">Refund &amp; Cancellation Policy</a>.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about an order? <a href={`mailto:${legal.email}`}>{legal.email}</a> · {legal.phone}
      </p>
    </LegalPage>
  );
}
