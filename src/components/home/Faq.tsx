import Image from 'next/image';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { faqs } from '@/content/home';
import FaqList from './FaqList';
import styles from './Faq.module.css';

/** Positions in `faqs` of the six questions shown first. The rest sit behind "See all". */
const TOP = [0, 1, 3, 6, 7, 8];

export default function Faq() {
  const top = TOP.map((i) => faqs[i]);
  const rest = faqs.filter((_, i) => !TOP.includes(i));

  return (
    <section id="faq" className={styles.faq} aria-labelledby="faq-title">
      <div className={`ds-container ${styles.grid}`}>
        <Reveal className={styles.side}>
          <span className={styles.label}>Got Questions?</span>
          <h2 id="faq-title" className={styles.title}>
            Everything You Need to <span>Know</span>
          </h2>
          <p className={styles.help}>Still have questions? We&apos;d love to help.</p>
          <Button href="/checkout" variant="primary">
            Buy Now
          </Button>
          <div className={styles.art} aria-hidden="true">
            <Image src="/assets/brand/shots/can-front.png" alt="" fill sizes="(max-width: 900px) 80vw, 30vw" />
          </div>
        </Reveal>

        <Reveal className={styles.list}>
          <FaqList top={top} rest={rest} />
        </Reveal>
      </div>
    </section>
  );
}
