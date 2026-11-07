import Image from 'next/image';
import { howToSteps } from '@/content/home';

export default function Product() {
  return (
    <section id="product" aria-label="Product details">
      <div className="product-header">
        <span className="section-label" style={{ opacity: 1, textAlign: 'center', display: 'block' }}>
          The Product
        </span>
        <h2 className="product-title">
          Everything You Need.
          <br />
          <em>Nothing You Don&apos;t.</em>
        </h2>
      </div>

      {/* Benefits slideshow */}
      <div className="benefits-slideshow">
        <div className="slideshow-track" id="slideshow-track">
          <div className="slide active">
            <Image
              src="/assets/benefits-1.jpg"
              alt="Lifestyle benefits — breathEN"
              width={900}
              height={500}
              loading="lazy"
            />
            <div className="slide-label">Lifestyle Benefits</div>
          </div>
          <div className="slide">
            <Image
              src="/assets/benefits-2.jpg"
              alt="Performance benefits — breathEN"
              width={900}
              height={500}
              loading="lazy"
            />
            <div className="slide-label">Performance Benefits</div>
          </div>
        </div>
        <div className="slideshow-controls">
          <button className="slide-btn slide-prev" aria-label="Previous slide">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="slide-dots">
            <button className="slide-dot active" data-index="0" aria-label="Slide 1" />
            <button className="slide-dot" data-index="1" aria-label="Slide 2" />
          </div>
          <button className="slide-btn slide-next" aria-label="Next slide">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* How to use */}
      <div className="howto-section">
        <div className="howto-header">
          <span className="section-label" style={{ opacity: 1 }}>
            Instructions for Use
          </span>
          <h3 className="howto-title">
            Simple as
            <br />
            <em>Taking a Breath.</em>
          </h3>
        </div>
        <div className="howto-grid">
          <div className="howto-steps">
            {howToSteps.map((s) => (
              <div key={s.n} className="howto-step">
                <div className="step-num">{s.n}</div>
                <div className="step-content">
                  <h4>{s.h}</h4>
                  <p>{s.p}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="howto-visual">
            <Image
              src="/assets/person-using.jpg"
              alt="breathEN in use"
              width={500}
              height={600}
              loading="lazy"
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
            />
            <div className="howto-visual-overlay" />
          </div>
        </div>
      </div>

      {/* Callouts */}
      <div className="product-callouts">
        <div className="callout-card callout-card--full">
          <Image
            src="/assets/product-detail.jpg"
            className="callout-img callout-img--tall"
            alt="breathEN nose breathing technology"
            width={600}
            height={700}
            loading="lazy"
          />
          <div className="callout-text">
            <div className="callout-point">
              <span className="section-label" style={{ opacity: 1 }}>
                Unique Design
              </span>
              <h4 className="callout-title">
                <em>Nose Breathing</em>
                <br />
                Technology
              </h4>
              <p className="callout-desc">
                Follows the body&apos;s natural breathing pathway. The specially designed mask delivers oxygen directly
                through nasal inhalation — the way nature intended.
              </p>
            </div>
            <div className="callout-divider" />
            <div className="callout-point">
              <span className="section-label" style={{ opacity: 1 }}>
                Engineering
              </span>
              <h4 className="callout-title">
                Leak-Proof
                <br />
                <em>Aluminium Can</em>
              </h4>
              <p className="callout-desc">
                Sealed aluminium construction prevents oxygen leakage. Lightweight, recyclable, and built for on-the-go
                use. Each can holds 8.5L of 99% pure oxygen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
