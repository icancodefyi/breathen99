'use client';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import styles from './StickyBuyBar.module.css';
import { Tm } from '@/components/ui/Tm';

/** Mobile buy bar: visible once the hero has left the screen, hidden again over the final call to action. */
export default function StickyBuyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    const cta = document.getElementById('cta');
    if (!hero) return;
    let pastHero = false;
    let overCta = false;
    const sync = () => setVisible(pastHero && !overCta);

    const heroObs = new IntersectionObserver(([e]) => {
      pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
      sync();
    });
    heroObs.observe(hero);

    const ctaObs = cta
      ? new IntersectionObserver(([e]) => {
          overCta = e.isIntersecting;
          sync();
        })
      : null;
    if (cta && ctaObs) ctaObs.observe(cta);

    return () => {
      heroObs.disconnect();
      ctaObs?.disconnect();
    };
  }, []);

  return (
    <div className={styles.bar} data-visible={visible} inert={!visible} aria-hidden={!visible}>
      <div className={styles.text}>
        <strong className={styles.name}>
          breathEN
          <Tm /> Oxygen
        </strong>
        <span className={styles.price}>
          <span className={styles.mrp}>₹900</span>
          <span>₹495</span>
        </span>
      </div>
      <Button href="/checkout" variant="primary" size="sm">
        Buy Now — ₹495
      </Button>
    </div>
  );
}
