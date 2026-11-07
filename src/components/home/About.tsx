import Image from 'next/image';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import AboutStatement from './AboutStatement';
import { brandTags } from '@/content/home';
import styles from './About.module.css';

export default function About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <AboutStatement />

      <div className="ds-container">
        <div className={styles.beats}>
          <Reveal className={styles.beatOne}>
            <p className={styles.opening}>
              <span className={styles.chant}>
                <span>Polluted air.</span> <span>Relentless stress.</span> <span>Daily exertion.</span>
              </span>{' '}
              <span className={styles.aside}>
                These quiet forces drain our energy, focus, and productivity — and we barely realise it until our bodies
                begin to struggle.
              </span>
            </p>
            <p className={styles.caption}>
              This is felt when we are in closed offices for a long time, travelling in packed air-conditioned cars,
              walking on polluted streets where breathing suffocates.
            </p>
          </Reveal>

          <Reveal>
            <p className={styles.question}>
              So should we escape city life? Abandon our work, our ambitions, our responsibilities?{' '}
              <strong className={styles.no}>No.</strong>
            </p>
          </Reveal>

          <Reveal className={styles.companionRow}>
            <p className={styles.companion}>
              Because when breathing naturally becomes difficult, breathEN is here to help you. breathEN is not a
              replacement for nature — it is a companion, designed to assist the body with comfortable breaths.
            </p>
          </Reveal>

          <Reveal>
            <p className={styles.danger}>
              The danger today is invisible <span>— and invisible enemies are the hardest to beat.</span>
            </p>
          </Reveal>
        </div>

        <Reveal className={styles.quote}>
          <p className={styles.truth}>
            At breathEN, we believe in a simple truth:{' '}
            <strong>You don&apos;t need to be superhuman. You just want to feel well enough to show up.</strong>
          </p>
          <p className={styles.tagline}>&ldquo;Breathe better, live Smarter. #breathEN&rdquo;</p>
        </Reveal>

        <div className={styles.cards}>
          <Reveal>
            <div className={`${styles.card} ${styles.sky}`}>
              <div className={styles.skyGlow} aria-hidden="true" />
              <div className={styles.stat}>
                <span className={styles.pre} aria-hidden="true" />
                <span className={styles.num}>99%</span>
                <span className={styles.cap}>Pure Oxygen</span>
              </div>
              <div className={`${styles.art} ${styles.canArt}`}>
                <Image
                  src="/assets/product.png"
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 34vw"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className={`${styles.card} ${styles.dark}`}>
              <div className={styles.stat}>
                <span className={styles.pre}>Upto</span>
                <span className={styles.num}>200</span>
                <span className={styles.cap}>Shots per Can</span>
              </div>
              <div className={`${styles.art} ${styles.canArtLying}`}>
                <Image
                  src="/assets/product.png"
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 40vw"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className={`${styles.card} ${styles.photo}`}>
              <div className={styles.stat}>
                <span className={styles.pre} aria-hidden="true" />
                <span className={styles.num}>0</span>
                <span className={styles.cap}>Side Effects</span>
              </div>
              <div className={`${styles.art} ${styles.photoArt}`}>
                <Image
                  src="/assets/person-using.jpg"
                  alt="Person using breathEN"
                  fill
                  sizes="(max-width: 900px) 100vw, 34vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <ul className={styles.tags}>
            {brandTags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          <div className={styles.cta}>
            <p>Ready to Breathe Better? Order breathEN Today.</p>
            <Button href="/checkout" variant="dark">
              Get Your Can →
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
