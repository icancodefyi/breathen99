import Image from 'next/image';
import type { CSSProperties } from 'react';
import Button from '@/components/ui/Button';
import styles from './Hero.module.css';

/** Stagger index for the entrance animation. */
const step = (i: number) => ({ '--i': i }) as CSSProperties;

export default function Hero() {
  return (
    <>
      <section id="hero" className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.sky} aria-hidden="true" />
        <span className={`${styles.cloud} ${styles.cloud1}`} aria-hidden="true" />
        <span className={`${styles.cloud} ${styles.cloud2}`} aria-hidden="true" />
        <span className={`${styles.cloud} ${styles.cloud3}`} aria-hidden="true" />

        <p className={`${styles.eyebrow} ${styles.rise}`} style={step(0)}>
          World&apos;s First Nose Breathing Oxygen Canister
        </p>

        <h1 id="hero-title" className={styles.title}>
          <span className={`${styles.titleBig} ${styles.rise}`} style={step(1)}>
            Comfortable
            <br />
            Breathing.
          </span>{' '}
          <span className={`${styles.tag} ${styles.rise}`} style={step(3)}>
            Anytime. Anywhere.
          </span>
        </h1>

        <div className={styles.can}>
          <Image
            src="/assets/product.png"
            alt="breathEN 99% pure oxygen canister"
            width={1400}
            height={1400}
            priority
            sizes="(max-width: 900px) 100vw, 78vh"
          />
        </div>

        <div className={`${styles.ctas} ${styles.rise}`} style={step(4)}>
          <Button href="/checkout" variant="light">
            Buy Now — ₹495
          </Button>
          <Button href="https://www.youtube.com/shorts/T9LWqEXDPhE" variant="link" external arrow>
            Watch How It Works
          </Button>
        </div>
      </section>

      <div className={styles.intro}>
        <div className="ds-container">
          <div className={styles.introGrid}>
            <p className={styles.lede}>
              Pollution. Fatigue. Altitude. Stress. Your body loses oxygen silently every day. breathEN delivers 99%
              pure recreational oxygen — instantly, safely, anywhere.{' '}
              <strong>No prescription. No side effects. Just breath.</strong>
            </p>

            <div className={styles.facts}>
              <div className={styles.price}>
                <span className={styles.mrp}>₹900</span>
                <span className={styles.sale}>₹495</span>
                <span className={styles.save}>45% OFF</span>
              </div>

              <ul className={styles.trust}>
                <li>99% Pure O₂</li>
                <li>Zero Side Effects</li>
                <li>Upto 200 Shots per Can</li>
                <li>Trusted by Fire Officers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
