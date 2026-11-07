'use client';
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { pricing } from '@/config/pricing';
import { siteConfig } from '@/config/site';
import { INDIAN_STATES } from '@/config/states';
import { calcPrices } from '@/lib/pricing';
import Field from '@/components/ui/Field';
import { checkoutStyles } from './styles';

const RAZORPAY_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

const CONFIG = {
  BASE_PRICE: pricing.basePrice,
  MRP_PRICE: pricing.mrpPrice,
  BULK_TIERS: pricing.bulkTiers as unknown as {
    min: number;
    max: number;
    discountPct: number;
    label: string;
    note: string;
  }[],
  BUSINESS_NAME: siteConfig.name,
  BUSINESS_LOGO: siteConfig.logo,
};

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

async function api<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Request failed');
  return data as T;
}

export default function CheckoutClient() {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', city: '', pin: '', state: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState({ applied: false, code: '', pct: 0 });
  const [couponStatus, setCouponStatus] = useState<{ type: 'success' | 'error' | ''; msg: string }>({
    type: '',
    msg: '',
  });
  const [couponLoading, setCouponLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  // Inject the Razorpay checkout script on the client only.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.querySelector(`script[src="${RAZORPAY_SRC}"]`)) return;
    const s = document.createElement('script');
    s.src = RAZORPAY_SRC;
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const { base, bulkAmt, couponAmt, total, tier } = calcPrices(qty, coupon.applied ? coupon.pct : 0);

  const validateForm = useCallback(() => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your full name';
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a valid 10-digit number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Please enter a valid email address';
    if (form.address.trim().length < 10) e.address = 'Please enter your delivery address';
    if (form.city.trim().length < 2) e.city = 'Please enter your city';
    if (!/^\d{6}$/.test(form.pin.trim())) e.pin = 'Enter a valid 6-digit PIN';
    if (!form.state) e.state = 'Please select your state';
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) document.getElementById(`f-${first}`)?.focus();
    return Object.keys(e).length === 0;
  }, [form]);

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponStatus({ type: 'error', msg: 'Please enter a coupon code.' });
      return;
    }
    setCouponLoading(true);
    try {
      const data = await api<{ valid: boolean; discountPct?: number; message?: string }>('/api/coupons/validate', {
        code,
      });
      if (data.valid && data.discountPct) {
        setCoupon({ applied: true, code, pct: data.discountPct });
        setCouponStatus({ type: 'success', msg: `✓ Code applied! ${data.discountPct}% off your order.` });
      } else {
        setCoupon({ applied: false, code: '', pct: 0 });
        setCouponStatus({ type: 'error', msg: data.message || 'Invalid or expired coupon code.' });
      }
    } catch {
      setCouponStatus({ type: 'error', msg: 'Could not verify code. Please try again.' });
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCoupon({ applied: false, code: '', pct: 0 });
    setCouponInput('');
    setCouponStatus({ type: '', msg: '' });
  };

  const handlePay = async () => {
    if (paying) return;
    setPayError('');
    if (!validateForm()) return;
    setPaying(true);

    const Razorpay = (
      window as unknown as {
        Razorpay?: new (o: unknown) => {
          open(): void;
          on(e: string, cb: (r: { error: { description: string } }) => void): void;
        };
      }
    ).Razorpay;
    if (!Razorpay) {
      setPaying(false);
      setPayError('The payment system is still loading. Please wait a moment and try again.');
      return;
    }

    try {
      // The server recalculates the price and creates the Razorpay order.
      const order = await api<{ publicId: string; razorpayOrderId: string; amount: number; keyId: string }>(
        '/api/orders',
        {
          customer: form,
          qty,
          couponCode: coupon.applied ? coupon.code : undefined,
        },
      );

      const rzp = new Razorpay({
        key: order.keyId,
        order_id: order.razorpayOrderId,
        currency: 'INR',
        name: CONFIG.BUSINESS_NAME,
        description: `breathEN × ${qty} can${qty > 1 ? 's' : ''}`,
        image: CONFIG.BUSINESS_LOGO,
        prefill: { name: form.name, contact: form.phone, email: form.email },
        theme: { color: '#e8260a' },
        modal: { ondismiss: () => setPaying(false) },
        handler: async (response: RazorpayResponse) => {
          try {
            await api('/api/orders/verify', { orderId: order.publicId, ...response });
          } catch {
            // The webhook will still confirm the payment; the thank-you page shows the real status.
          }
          router.push(`/thankyou?order=${order.publicId}`);
        },
      });
      rzp.on('payment.failed', (r) => {
        setPaying(false);
        setPayError(`Payment failed: ${r.error.description}. You have not been charged — please try again.`);
      });
      rzp.open();
    } catch (e) {
      setPaying(false);
      setPayError(e instanceof Error ? e.message : 'Could not start payment. Please try again.');
    }
  };

  const totalFmt = total.toLocaleString('en-IN');

  return (
    <>
      {/* Checkout-specific styles */}
      <style>{checkoutStyles}</style>

      <div className="topbar">
        <Link href="/" className="topbar-logo" style={{ display: 'flex' }}>
          <Image src="/assets/logo-white.jpg" alt="breathEN" width={120} height={36} style={{ objectFit: 'contain' }} />
        </Link>
        <Link href="/" className="topbar-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to site
        </Link>
      </div>

      <div className="trust-bar">
        Free Shipping Across India <span>·</span> Secure Razorpay Checkout <span>·</span> 99% Pure O₂
      </div>

      <div className="mobile-summary-bar">
        <div className="msb-row">
          <span>breathEN × {qty}</span>
          <span className="msb-total">₹{totalFmt}</span>
        </div>
        {(tier.discountPct > 0 || couponAmt > 0) && (
          <div className="msb-row" style={{ fontSize: 11, color: '#1a8a3a', marginTop: 2 }}>
            <span>
              {tier.discountPct === 33
                ? `Buy 4 Get 2 Free · Save ₹${(bulkAmt + couponAmt).toLocaleString('en-IN')}`
                : `You save ₹${(bulkAmt + couponAmt).toLocaleString('en-IN')}`}
            </span>
          </div>
        )}
      </div>

      <div className="checkout-wrap">
        {/* LEFT: FORM */}
        <div className="form-col">
          {/* Step 1 */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-step">
              <div className="step-num">1</div>
              <h2 className="step-title">Your Details</h2>
            </div>
            <Field id="f-name" label="Full Name" required error={errors.name}>
              {(p) => (
                <input
                  {...p}
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Rahul Sharma"
                />
              )}
            </Field>
            <div className="field-row">
              <Field id="f-phone" label="Phone Number" required error={errors.phone}>
                {(p) => (
                  <input
                    {...p}
                    type="tel"
                    name="tel"
                    autoComplete="tel-national"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="98765 43210"
                    maxLength={11}
                  />
                )}
              </Field>
              <Field id="f-email" label="Email" required error={errors.email}>
                {(p) => (
                  <input
                    {...p}
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@email.com"
                  />
                )}
              </Field>
            </div>
          </div>

          {/* Step 2 */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-step">
              <div className="step-num">2</div>
              <h2 className="step-title">Delivery Address</h2>
            </div>
            <Field id="f-address" label="Full Address" required error={errors.address}>
              {(p) => (
                <textarea
                  {...p}
                  name="address"
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Flat / House no., Street, Area, Landmark…"
                />
              )}
            </Field>
            <div className="field-row">
              <Field id="f-city" label="City" required error={errors.city}>
                {(p) => (
                  <input
                    {...p}
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    placeholder="Mumbai"
                  />
                )}
              </Field>
              <Field id="f-pin" label="PIN Code" required error={errors.pin}>
                {(p) => (
                  <input
                    {...p}
                    type="text"
                    name="postal-code"
                    autoComplete="postal-code"
                    inputMode="numeric"
                    value={form.pin}
                    onChange={(e) => setForm((f) => ({ ...f, pin: e.target.value }))}
                    placeholder="400001"
                    maxLength={6}
                  />
                )}
              </Field>
            </div>
            <Field id="f-state" label="State" required error={errors.state}>
              {(p) => (
                <select
                  {...p}
                  name="state"
                  autoComplete="address-level1"
                  value={form.state}
                  onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                >
                  <option value="">— Select State —</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              )}
            </Field>
          </div>

          {/* Step 3: Quantity */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="section-step">
              <div className="step-num">3</div>
              <h2 className="step-title">Quantity</h2>
            </div>
            <div className="field" style={{ marginBottom: 4 }}>
              <label id="qty-label">Number of Cans</label>
              <div className="qty-wrap" role="group" aria-labelledby="qty-label">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <output className="qty-display" aria-live="polite">
                  {qty}
                </output>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQty((q) => Math.min(pricing.maxQty, q + 1))}
                  disabled={qty >= pricing.maxQty}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            <div className="bulk-tiers">
              {CONFIG.BULK_TIERS.map((t, i) => {
                const active = qty >= t.min && qty <= t.max;
                const badge =
                  t.discountPct === 33
                    ? '🎁 BUY 4 GET 2 FREE'
                    : t.discountPct > 0
                      ? `${t.discountPct}% OFF`
                      : 'BASE PRICE';
                return (
                  <div key={i} className={`bulk-tier${active ? ' active' : ''}`}>
                    <span className="bulk-tier-badge">{badge}</span>
                    <span className="bulk-tier-label">
                      {t.label} — {t.note}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 4: Coupon */}
          <div className="card">
            <div className="section-step">
              <div className="step-num">4</div>
              <h2 className="step-title">Coupon Code</h2>
            </div>
            <div className="coupon-row">
              <input
                type="text"
                aria-label="Coupon code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Enter coupon code"
                maxLength={30}
                autoComplete="off"
                disabled={coupon.applied}
                onKeyDown={(e) => e.key === 'Enter' && !coupon.applied && applyCoupon()}
              />
              {coupon.applied ? (
                <button type="button" className="coupon-apply" onClick={removeCoupon}>
                  Remove
                </button>
              ) : (
                <button type="button" className="coupon-apply" onClick={applyCoupon} disabled={couponLoading}>
                  {couponLoading ? 'Checking…' : 'Apply'}
                </button>
              )}
            </div>
            <div className={`coupon-feedback ${couponStatus.type}`} role="status" aria-live="polite">
              {couponStatus.msg}
            </div>
          </div>
          <p className="legal-note">
            By placing your order you agree to our <Link href="/terms">Terms</Link>,{' '}
            <Link href="/privacy-policy">Privacy Policy</Link>,{' '}
            <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link> and{' '}
            <Link href="/shipping-policy">Shipping Policy</Link>.
          </p>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="desktop-summary">
          <div className="card" style={{ position: 'sticky', top: 20 }}>
            <div className="card-title">Order Summary</div>
            <div className="summary-product">
              <Image
                src="/assets/product.png"
                alt="breathEN canister"
                width={70}
                height={90}
                className="summary-product-img"
                style={{ objectFit: 'contain' }}
              />
              <div className="summary-product-info">
                <div className="summary-product-name">breathEN Oxygen Canister</div>
                <div className="summary-product-sub">99% Pure · Up to 200 shots</div>
                <div className="summary-mrp-line">
                  <span className="summary-mrp">MRP ₹{CONFIG.MRP_PRICE}</span>
                  <span className="summary-sale">45% OFF</span>
                </div>
              </div>
              <div className="summary-product-qty">×{qty}</div>
            </div>

            <div className="summary-line">
              <span>
                Subtotal ({qty} can{qty > 1 ? 's' : ''})
              </span>
              <span>₹{base.toLocaleString('en-IN')}</span>
            </div>
            {tier.discountPct > 0 && (
              <div className="summary-line discount">
                <span>{tier.discountPct === 33 ? 'Buy 4 Get 2 Free' : `Bulk discount (${tier.discountPct}%)`}</span>
                <span>−₹{bulkAmt.toLocaleString('en-IN')}</span>
              </div>
            )}
            {coupon.applied && couponAmt > 0 && (
              <div className="summary-line coupon">
                <span>Coupon ({coupon.code})</span>
                <span>−₹{couponAmt.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="summary-line">
              <span>Shipping</span>
              <span style={{ color: '#1a8a3a', fontWeight: 500 }}>FREE</span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-total">
              <span>Total</span>
              <span>₹{totalFmt}</span>
            </div>
            <div className="summary-total-sub">Inclusive of all taxes</div>

            {payError && (
              <div className="pay-alert" role="alert">
                {payError}
              </div>
            )}
            <button type="button" className="pay-btn" onClick={handlePay} disabled={paying} aria-busy={paying}>
              {paying ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  <span className="sr-only">Processing payment</span>
                </>
              ) : (
                `Pay ₹${totalFmt} Securely`
              )}
            </button>
            <div className="pay-secure">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Secured by Razorpay · 256-bit SSL
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fixed pay bar */}
      <div className="mobile-pay-bar">
        {payError && (
          <div className="pay-alert pay-alert--mobile" role="alert">
            {payError}
          </div>
        )}
        <button type="button" className="pay-btn" onClick={handlePay} disabled={paying} aria-busy={paying}>
          {paying ? (
            <>
              <span className="spinner" aria-hidden="true" />
              <span className="sr-only">Processing payment</span>
            </>
          ) : (
            `Pay ₹${totalFmt} Securely`
          )}
        </button>
      </div>
    </>
  );
}
