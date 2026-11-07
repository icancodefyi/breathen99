import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import { whyBenefits, whyCards } from '@/content/home';
import UseCases from './UseCases';
import styles from './WhoItHelps.module.css';

function Check() {
  return (
    <span className={styles.check} aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M3.5 8.5l3 3 6-7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function WhoItHelps() {
  return (
    <section id="why" className={styles.why} aria-labelledby="why-title">
      <div className="ds-container">
        <Reveal className={styles.head}>
          <span className={styles.label}>Who breathEN Helps</span>
          <h2 id="why-title" className={styles.title}>
            One Product. <span>Five Real Needs.</span>
          </h2>
          <p className={styles.sub}>
            Whether you&apos;re ascending a mountain, managing a deadline, or supporting an elderly parent — breathEN
            delivers 99% pure oxygen when your body needs it most.
          </p>
        </Reveal>
      </div>

      <UseCases items={whyCards} />

      <div className="ds-container">
        <Reveal className={styles.band}>
          <figure className={styles.photo}>
            <div className={styles.photoFrame}>
              <Image
                src="/assets/person-using.jpg"
                alt="Person using breathEN"
                fill
                sizes="(max-width: 900px) 100vw, 40vw"
              />
            </div>
            <figcaption className={styles.caption}>breathEN — 99% Pure Recreational Oxygen</figcaption>
          </figure>

          <div className={styles.copy}>
            <h3 className={styles.bandTitle}>
              ONE CANISTER.
              <br />
              FIVE LIVES.
            </h3>
            <p className={styles.tagline}>
              breathEN is not a medical device — it is a companion designed to give your body comfortable breaths when
              the air around you simply isn&apos;t enough.
            </p>
            <ul className={styles.benefits}>
              {whyBenefits.map((b) => (
                <li key={b}>
                  <Check />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
