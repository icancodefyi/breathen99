'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { thankYouStyles } from './styles';

interface PublicOrder {
  status: 'created' | 'paid' | 'failed';
  firstName: string;
  qty: number;
  amount: number;
  paymentId: string | null;
}

export default function ThankyouPage() {
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading');

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('order');
    if (!id) {
      void Promise.resolve().then(() => setState('missing'));
      return;
    }
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const load = async () => {
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, { cache: 'no-store' });
        if (!res.ok) {
          setState('missing');
          return;
        }
        const { order } = await res.json();
        setOrder(order);
        setState('ready');
        // The webhook may confirm slightly after redirect; re-check briefly.
        if (order.status !== 'paid' && ++tries < 6) timer = setTimeout(load, 2500);
      } catch {
        setState('missing');
      }
    };
    load();
    return () => clearTimeout(timer);
  }, []);

  const paid = order?.status === 'paid';
  const failed = order?.status === 'failed';

  return (
    <>
      <style>{thankYouStyles}</style>

      <div className="topbar">
        <Image src="/assets/logo-white.jpg" alt="breathEN" width={120} height={36} style={{ objectFit: 'contain' }} />
      </div>

      <main className="page">
        {paid && (
          <div className="check-circle" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}

        <div aria-live="polite">
          {state === 'loading' && (
            <p className="ty-sub" role="status">
              Confirming your order…
            </p>
          )}
          {state === 'missing' && (
            <>
              <h1 className="ty-headline">We couldn&apos;t find that order</h1>
              <p className="ty-sub">
                If you just paid, don&apos;t worry — you&apos;ll receive a confirmation shortly. Questions? WhatsApp us
                below.
              </p>
            </>
          )}
          {state === 'ready' && order && (
            <>
              <h1 className="ty-headline">
                {paid ? 'Order Confirmed!' : failed ? 'Payment not completed' : 'Payment pending'}
              </h1>
              <p className="ty-sub">
                {paid
                  ? `Thank you, ${order.firstName}! Your breathEN oxygen ${order.qty > 1 ? 'canisters are' : 'canister is'} on the way. You'll receive a confirmation shortly.`
                  : failed
                    ? 'Your payment did not go through and you have not been charged. You can try again whenever you are ready.'
                    : 'We are still waiting for confirmation of your payment. This page will update automatically.'}
              </p>
              <div className="ty-card">
                <h4>Order Details</h4>
                <div className="ty-row">
                  <span className="label">Name</span>
                  <span>{order.firstName}</span>
                </div>
                <div className="ty-row">
                  <span className="label">Quantity</span>
                  <span>
                    {order.qty} can{order.qty > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="ty-row">
                  <span className="label">{paid ? 'Amount Paid' : 'Amount'}</span>
                  <span>₹{order.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="ty-row">
                  <span className="label">Shipping</span>
                  <span style={{ color: '#1a8a3a' }}>FREE</span>
                </div>
                {order.paymentId && <div className="ty-pid">Payment ID: {order.paymentId}</div>}
              </div>
            </>
          )}
        </div>

        {failed && (
          <Link href="/checkout" className="btn-home" style={{ marginRight: 12 }}>
            Try again
          </Link>
        )}
        <Link href="/" className="btn-home">
          Back to breathEN
        </Link>

        <p className="whatsapp-note">
          Questions? WhatsApp us at{' '}
          <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer">
            +91 98192 50202
          </a>
        </p>
      </main>
    </>
  );
}
