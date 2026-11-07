import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage from '@/components/layout/LegalPage';
import { legal } from '@/config/legal';

export const metadata: Metadata = {
  title: 'Terms & Conditions — breathEN',
  description: 'The terms that apply when you use the breathEN website and buy our products.',
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <p>
        By using this website or placing an order, you agree to these terms. They form a contract between you and{' '}
        {legal.entityName} (&ldquo;{legal.brand}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). If you do not agree,
        please do not use the site.
      </p>

      <h2>1. Our products</h2>
      <p>
        {legal.brand} sells portable oxygen canisters for recreational and wellness use. {legal.brand} is not a medical
        device. It is not intended to diagnose, treat, cure or prevent any disease, and it does not replace medical
        oxygen, medication or professional medical advice. If you have a health condition or concerns, speak to a doctor
        before use. In a medical emergency, call 112.
      </p>

      <h2>2. Safe use</h2>
      <ul>
        <li>Follow the instructions on the product and on our website.</li>
        <li>Oxygen can accelerate combustion. Keep the canister away from flames, heat and smoking.</li>
        <li>Store in a cool, dry place and keep out of reach of children.</li>
        <li>Do not puncture the canister. Stop using the product if you feel unwell.</li>
      </ul>

      <h2>3. Orders and pricing</h2>
      <ul>
        <li>
          All prices are in Indian Rupees (INR) and include applicable taxes. Prices and offers can change without
          notice.
        </li>
        <li>
          The final price is calculated when you place your order. An order is confirmed only after your payment
          succeeds.
        </li>
        <li>
          We may cancel or refuse an order, for example because of stock, a pricing error or suspected fraud. If we do,
          we will refund any amount you have paid.
        </li>
        <li>
          Coupon codes are valid for the stated period and quantity, cannot be exchanged for cash, and may be withdrawn
          at any time.
        </li>
      </ul>

      <h2>4. Payments</h2>
      <p>
        Payments are processed securely by Razorpay. We do not store your card, UPI or bank details. Your use of
        Razorpay is also subject to its own terms and privacy policy.
      </p>

      <h2>5. Shipping, returns and refunds</h2>
      <p>
        See our <Link href="/shipping-policy">Shipping Policy</Link> and{' '}
        <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>, which are part of these terms.
      </p>

      <h2>6. Using the website</h2>
      <p>
        You agree not to misuse the site: no attempts to break or probe its security, scrape it at scale, submit false
        information or use it unlawfully.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        The {legal.brand} name, logo, images, text and design belong to us or our licensors. You may not copy or reuse
        them without written permission.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the extent permitted by law, we are not liable for indirect or consequential losses arising from your use of
        the website or products, and our total liability for any claim is limited to the amount you paid for the product
        concerned. Nothing in these terms limits any right you have under the Consumer Protection Act, 2019 or other law
        that cannot be excluded.
      </p>

      <h2>9. Governing law</h2>
      <p>
        These terms are governed by the laws of India. The courts at {legal.jurisdiction} have jurisdiction, subject to
        any consumer-forum rights you have by law.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update these terms. The version published on this page when you place an order applies to that order.
      </p>

      <h2>11. Contact</h2>
      <p>
        {legal.entityName}
        <br />
        {legal.address}
        <br />
        <a href={`mailto:${legal.email}`}>{legal.email}</a> · {legal.phone}
        {legal.gstin ? (
          <>
            <br />
            GSTIN: {legal.gstin}
          </>
        ) : null}
      </p>
    </LegalPage>
  );
}
