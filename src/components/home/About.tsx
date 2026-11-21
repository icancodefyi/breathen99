import Image from 'next/image';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import AboutStatement from './AboutStatement';
import styles from './About.module.css';

export default function About() {
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <AboutStatement />

      <div className="ds-container">
        <Reveal className={styles.intro}>
          <div className={styles.introMain}>
            <span className={styles.scale} aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </span>
            <h3 className={styles.introTitle}>breathEN is not a replacement for nature —</h3>
          </div>
          <div className={styles.introSide}>
            <div className={styles.tile}>
              <Image src="/assets/brand/shots/can-side.png" alt="" fill sizes="(max-width: 900px) 100vw, 33vw" />
            </div>
            <p className={styles.introText}>It is a companion, designed to assist the body with comfortable breaths.</p>
            <Button href="/about" variant="link" arrow>
              Read our story
            </Button>
          </div>
        </Reveal>

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
                  src="/assets/brand/shots/can-hero.png"
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
                  src="/assets/brand/shots/can-cta.png"
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
      </div>
    </section>
  );
}
