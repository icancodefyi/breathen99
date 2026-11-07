import Image from 'next/image';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import styles from './FinalCta.module.css';

export default function FinalCta() {
  return (
    <section id="cta" className={styles.cta} aria-labelledby="cta-title">
      <div className="ds-container">
        <Reveal className={styles.panel}>
          <div className={styles.glow} aria-hidden="true" />
          <p className={styles.eyebrow}>The next breath changes everything</p>
          <h2 id="cta-title" className={styles.headline}>
            Breathe Better.
          </h2>
          <h3 className={styles.sub}>Live Stronger.</h3>
          <Button href="/checkout" variant="light">
            Get breathEN Now
          </Button>
          <div className={styles.can}>
            <Image src="/assets/product.png" alt="" fill sizes="560px" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
