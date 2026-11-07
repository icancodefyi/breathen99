import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { testimonials } from '@/content/home';
import styles from './Testimonials.module.css';

const initials = (name: string) =>
  name
    .replace(/,.*$/, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

export default function Testimonials() {
  return (
    <section id="testimonials" className={styles.reviews} aria-labelledby="testimonials-title">
      <div className="ds-container">
        <Reveal>
          <span className={styles.label}>Real People. Real Breath.</span>
          <h2 id="testimonials-title" className={styles.title}>
            What They Say About breath<span className={styles.en}>EN</span>
          </h2>
        </Reveal>

        <Reveal className={styles.board}>
          {testimonials.map((t) => (
            <figure key={t.name} className={styles.card}>
              <blockquote style={{ margin: 0 }}>
                <p className={styles.cardText}>{t.text}</p>
              </blockquote>
              <figcaption className={styles.who}>
                <span className={styles.avatar} aria-hidden="true">
                  {initials(t.name)}
                </span>
                <span>
                  <cite className={styles.name}>{t.name}</cite>
                  <span className={styles.role}>{t.title}</span>
                </span>
                {t.tag && <span className={styles.tag}>{t.tag}</span>}
              </figcaption>
            </figure>
          ))}
        </Reveal>

        <Reveal className={styles.band}>
          <p>Upto 200 Shots. Zero Side Effects. One Deep Breath Away.</p>
          <Button href="/checkout" variant="light">
            Order breathEN →
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
