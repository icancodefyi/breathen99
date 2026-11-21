'use client';
import { Fragment, useEffect, useRef } from 'react';
import styles from './AboutStatement.module.css';
import { Tm } from '@/components/ui/Tm';

/** The headline, split into words so each can light up as the visitor scrolls. */
const WORDS: Array<{ text: string; en?: boolean; red?: boolean }> = [
  { text: 'We' },
  { text: 'Built' },
  { text: 'breath', en: true }, // rendered as breath + red EN
  { text: 'Because' },
  { text: 'the' },
  { text: 'Air' },
  { text: 'Stopped' },
  { text: 'Being' },
  { text: 'Enough.' },
];
const CIRCLES = 5;
const DIM = 0.16;

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

export default function AboutStatement() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const words = Array.from(track.querySelectorAll<HTMLElement>('[data-word]'));
    const circles = Array.from(track.querySelectorAll<HTMLElement>('[data-circle]'));

    // Reduced motion: show everything, no scroll effect.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = track.getBoundingClientRect();
      const travel = Math.max(1, r.height - window.innerHeight);
      // 0 when the panel pins, 1 just before it releases (leave a little hold at the end).
      const p = clamp(-r.top / (travel * 0.82));

      const n = words.length;
      words.forEach((w, i) => {
        const t = clamp(p * (n + 1) - i);
        w.style.opacity = String(DIM + (1 - DIM) * t);
      });
      circles.forEach((c, i) => {
        const t = clamp(p * (CIRCLES + 1) - i);
        c.style.opacity = String(0.12 + 0.88 * t);
        c.style.transform = `scale(${0.86 + 0.14 * t})`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={trackRef} className={styles.track}>
      <div className={styles.sticky}>
        <div className={styles.panel}>
          <span className={styles.label}>About Us</span>
          <h2 id="about-title" className={styles.title}>
            {WORDS.map((w, i) => (
              <Fragment key={w.text}>
                <span data-word className={w.red ? `${styles.word} ${styles.en}` : styles.word}>
                  {w.en ? (
                    <>
                      breath<span className={styles.en}>EN</span>
                      <Tm />
                    </>
                  ) : (
                    w.text
                  )}
                </span>
                {i < WORDS.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </h2>

          <div className={styles.circles} aria-hidden="true">
            {Array.from({ length: CIRCLES }, (_, i) => (
              <span key={i} data-circle className={styles.circle} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
