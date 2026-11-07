import type { Metadata } from 'next';
import LegalPage from '@/components/layout/LegalPage';
import { legal } from '@/config/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy — breathEN',
  description: 'How breathEN collects, uses and protects your personal data.',
};

export default function PrivacyPolicyPage() {
  const g = legal.grievanceOfficer;
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This policy explains how {legal.entityName} (&ldquo;{legal.brand}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
        collects and uses your personal data when you browse our website or place an order. We handle personal data in
        line with the Digital Personal Data Protection Act, 2023 and other applicable Indian law.
      </p>

      <h2>1. Data we collect</h2>
      <ul>
        <li>
          <strong>Order details:</strong> your name, phone number, email address, delivery address, the items and
          quantity you order, and any coupon code you use.
        </li>
        <li>
          <strong>Payment status:</strong> your payment is processed by Razorpay. We receive a payment reference and the
          payment status, but we never see or store your card, UPI or bank details.
        </li>
        <li>
          <strong>Technical data:</strong> basic server logs such as IP address, browser type and pages requested, used
          to keep the site secure and working.
        </li>
        <li>
          <strong>Messages:</strong> anything you send us by email, phone or WhatsApp.
        </li>
      </ul>

      <h2>2. Why we use it</h2>
      <ul>
        <li>To process, deliver and support your order, including sending order updates.</li>
        <li>To prevent fraud and abuse, and to keep our website and checkout secure.</li>
        <li>To meet accounting, tax and other legal obligations.</li>
        <li>To respond to your questions and complaints.</li>
      </ul>
      <p>We rely on your consent and on the need to fulfil your order. We do not sell your personal data.</p>

      <h2>3. Who we share it with</h2>
      <p>We share data only with service providers that help us run the business, and only what they need:</p>
      <ul>
        <li>
          <strong>Razorpay</strong> for payment processing.
        </li>
        <li>
          <strong>Courier and logistics partners</strong> for delivery (name, phone, address).
        </li>
        <li>
          <strong>Hosting and database providers</strong> (for example Vercel and MongoDB Atlas) that store and serve
          our website and orders.
        </li>
        <li>
          <strong>Authorities</strong> where the law requires it.
        </li>
      </ul>
      <p>
        Our website fonts are hosted on our own servers, so your browser does not contact Google to load them. Some of
        the providers above may process data outside India.
      </p>

      <h2>4. How long we keep it</h2>
      <p>
        We keep order data for as long as needed to fulfil your order, handle returns and disputes, and meet accounting
        and legal requirements. After that we delete or anonymise it.
      </p>

      <h2>5. How we protect it</h2>
      <p>
        We use encrypted connections (HTTPS), restrict access to order data, validate all inputs on our servers, and
        rely on PCI-compliant payment processing. No system is perfectly secure, but we work to protect your data.
      </p>

      <h2>6. Your rights</h2>
      <p>You can ask us to:</p>
      <ul>
        <li>give you a summary of the personal data we hold about you;</li>
        <li>correct or update inaccurate data;</li>
        <li>erase your data, unless we must keep it by law;</li>
        <li>withdraw your consent for future processing.</li>
      </ul>
      <p>
        To do any of this, email <a href={`mailto:${legal.email}`}>{legal.email}</a>. We will respond within a
        reasonable time.
      </p>

      <h2>7. Children</h2>
      <p>Our website is meant for adults. We do not knowingly collect data from children.</p>

      <h2>8. Grievances</h2>
      <p>
        If you have a concern about how we handle your data, contact our grievance officer{g.name ? `, ${g.name}` : ''},
        at <a href={`mailto:${g.email}`}>{g.email}</a>.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>We may update this policy from time to time. The date at the top shows when it last changed.</p>

      <h2>10. Contact</h2>
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
