import Link from 'next/link';

export default function FinalCta() {
  return (
    <section id="cta">
      <div className="cta-bg" />
      <div className="cta-inner">
        <span className="cta-eyebrow">The next breath changes everything</span>
        <h2 className="cta-headline">
          Breathe <span>Better.</span>
        </h2>
        <h3 className="cta-sub">Live Stronger.</h3>
        <div className="btn-magnetic-wrap">
          <Link href="/checkout" className="cta-btn">
            Get breathEN Now
          </Link>
        </div>
      </div>
    </section>
  );
}
