import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-left">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          <span className="hero-eyebrow-text">World&apos;s First Nose Breathing Oxygen Canister</span>
        </div>
        <h1 className="hero-h1">
          <em>
            Comfortable
            <br />
            Breathing.
          </em>
          <br />
          Anytime. Anywhere.
        </h1>
        <p className="hero-body">
          Pollution. Fatigue. Altitude. Stress. Your body loses oxygen silently every day. breathEN delivers 99% pure
          recreational oxygen — instantly, safely, anywhere.{' '}
          <strong>No prescription. No side effects. Just breath.</strong>
        </p>
        <div className="hero-price">
          <span className="hero-mrp">₹900</span>
          <span className="hero-sale">₹495</span>
          <span className="hero-save">45% OFF</span>
        </div>
        <div className="hero-ctas">
          <Link href="/checkout" className="btn-primary">
            Buy Now — ₹495
          </Link>
          <a
            href="https://www.youtube.com/shorts/T9LWqEXDPhE"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Watch How It Works
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <div className="hero-trust">
          <div className="trust-item">
            <span className="trust-text">99% Pure O₂</span>
          </div>
          <div className="trust-item">
            <span className="trust-text">Zero Side Effects</span>
          </div>
          <div className="trust-item">
            <span className="trust-text">Upto 200 Shots per Can</span>
          </div>
          <div className="trust-item">
            <span className="trust-text">Trusted by Fire Officers</span>
          </div>
        </div>
      </div>

      <div className="hero-right">
        <canvas id="ray-canvas" />
        <canvas id="particle-canvas" />
        <div className="hero-bg-text" aria-hidden="true">
          O₂
        </div>
        <div className="product-stage">
          <div className="glow-core" />
          <div className="product-shadow" />
          <div className="orbit-ring" />
          <div className="orbit-ring-2" />
          <canvas id="molecule-canvas" />
          <div className="product-wrap" id="product-wrap">
            <Image
              src="/assets/product.png"
              alt="breathEN 99% pure oxygen canister"
              width={340}
              height={480}
              priority
            />
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-line" />
          <span className="scroll-text">Scroll</span>
        </div>
      </div>
    </section>
  );
}
