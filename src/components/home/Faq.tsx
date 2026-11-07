import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { faqs } from '@/content/home';
import styles from './Faq.module.css';

/** Native <details> accordion: keyboard and screen-reader friendly, works without JavaScript. */
export default function Faq() {
  return (
    <section id="faq" className={styles.faq} aria-labelledby="faq-title">
      <div className={`ds-container ${styles.grid}`}>
        <Reveal className={styles.side}>
          <span className={styles.label}>Got Questions?</span>
          <h2 id="faq-title" className={styles.title}>
            Everything You Need to <span>Know</span>
          </h2>
          <p className={styles.help}>Still have questions? We&apos;d love to help.</p>
          <Button href="/checkout" variant="dark">
            Buy Now
          </Button>
        </Reveal>

        <Reveal className={styles.list}>
          {faqs.map((f) => (
            <details key={f.q} className={styles.item} name="faq">
              <summary>
                {f.q}
                <span className={styles.icon} aria-hidden="true" />
              </summary>
              <p className={styles.answer}>{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
