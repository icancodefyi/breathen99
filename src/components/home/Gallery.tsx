import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import { galleryShots } from '@/content/home';
import styles from './Gallery.module.css';

export default function Gallery() {
  return (
    <section id="gallery" className={styles.gallery} aria-labelledby="gallery-title">
      <div className="ds-container">
        <Reveal className={styles.head}>
          <div>
            <span className={styles.label}>The Can, Up Close</span>
            <h2 id="gallery-title" className={styles.title}>
              Every Angle. <span>One Deep Breath.</span>
            </h2>
          </div>
          <p className={styles.note}>
            Sealed aluminium. A mask built for nose-first breathing. 99% pure oxygen — shot exactly as it ships.
          </p>
        </Reveal>

        <Reveal className={styles.wall}>
          <ul className={styles.grid}>
            {galleryShots.map((shot, i) => (
              <li key={shot.src} className={styles.tile}>
                <div className={styles.frame}>
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1100px) 30vw, 18vw"
                  />
                </div>
                <span className={styles.caption}>
                  <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                  View
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
