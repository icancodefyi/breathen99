import Image from 'next/image';
import type { CSSProperties } from 'react';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { Tm } from '@/components/ui/Tm';
import styles from './Hero.module.css';

/** Stagger index for the entrance animation. */
const step = (i: number) => ({ '--i': i }) as CSSProperties;

const FORCES = ['Pollution.', 'Fatigue.', 'Recovery.', 'Altitude.', 'Stress.'];

export type HeroLayout = 'overlap' | 'stagger';

export default function Hero({ layout = 'overlap' }: { layout?: HeroLayout }) {
  return (
    <>
      <section id="hero" className={styles.hero} data-layout={layout} aria-labelledby="hero-title">
        <div className={styles.sky} aria-hidden="true" />
        <span className={`${styles.cloud} ${styles.cloud1}`} aria-hidden="true" />
        <span className={`${styles.cloud} ${styles.cloud2}`} aria-hidden="true" />
        <span className={`${styles.cloud} ${styles.cloud3}`} aria-hidden="true" />

        <p className={`${styles.eyebrow} ${styles.rise}`} style={step(0)}>
          World&apos;s First Nose Breathing Oxygen Canister
        </p>

        <h1 id="hero-title" className={styles.title}>
          <span className={`${styles.word} ${styles.word1} ${styles.rise}`} style={step(1)}>
            Comfortable
          </span>{' '}
          <span className={styles.gap} aria-hidden="true" />
          <span className={`${styles.word} ${styles.word2} ${styles.rise}`} style={step(2)}>
            Breathing.
          </span>
        </h1>

        <div className={styles.can}>
          <Image
            src="/assets/brand/shots/can-hero.png"
            alt="breathEN 99% pure oxygen canister"
            width={1400}
            height={1400}
            priority
            sizes="(max-width: 900px) 100vw, 78vh"
          />
        </div>

        <p className={`${styles.tag} ${styles.rise}`} style={step(3)}>
          Anytime. Anywhere.
        </p>

        <div className={`${styles.ctas} ${styles.rise}`} style={step(4)}>
          <Button href="/checkout" variant="primary">
            Buy Now
          </Button>
          <Button href="https://www.youtube.com/shorts/T9LWqEXDPhE" variant="ghost" external arrow>
            Watch How It Works
          </Button>
        </div>
      </section>

      <div className={styles.intro}>
        <div className="ds-container">
          <Reveal>
            <ul className={styles.forces} aria-label="What drains your oxygen">
              {FORCES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal className={styles.compare}>
            <div className={`${styles.panel} ${styles.before}`}>
              <p className={styles.lede}>
                Your body loses oxygen <span>silently every day.</span>
              </p>
              <div className={styles.meter} aria-hidden="true">
                {Array.from({ length: 36 }, (_, i) => (
                  <span key={i} style={{ height: `${100 - i * 2.4}%`, opacity: 1 - i / 50 }} />
                ))}
              </div>
            </div>

            <div className={`${styles.panel} ${styles.after}`}>
              <p className={styles.body}>
                breathEN
                <Tm /> delivers 99% pure recreational oxygen — instantly, safely, anywhere.
              </p>
              <p className={styles.pledge}>
                <span>No prescription.</span>
                <span>No side effects.</span>
                <strong>Just breath.</strong>
              </p>
              <div className={styles.meter} aria-hidden="true">
                {Array.from({ length: 36 }, (_, i) => (
                  <span key={i} style={{ height: `${30 + i * 2}%`, opacity: 0.35 + i * 0.0186 }} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
