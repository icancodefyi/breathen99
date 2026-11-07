'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './UseCases.module.css';

interface UseCase {
  num: string;
  img: string;
  title: string;
  desc: string;
  list: string[];
}

const DESKTOP = '(min-width: 901px)';
/** Scroll distance (in viewport heights) given to each use case while pinned. */
const PER_ITEM_VH = 70;

export default function UseCases({ items }: { items: UseCase[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const mq = window.matchMedia(DESKTOP);
    let raf = 0;

    const update = () => {
      raf = 0;
      if (!mq.matches) return;
      const r = track.getBoundingClientRect();
      const travel = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(0.9999, Math.max(0, -r.top / travel));
      setActive(Math.floor(p * items.length));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    mq.addEventListener('change', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      mq.removeEventListener('change', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items.length]);

  /** Clicking a title scrolls to the point where that item is active. */
  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track || !window.matchMedia(DESKTOP).matches) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const travel = track.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / items.length) * travel, behavior: 'smooth' });
  };

  return (
    <div ref={trackRef} className={styles.track} style={{ height: `calc(${items.length * PER_ITEM_VH}svh + 100svh)` }}>
      <div className={styles.sticky}>
        <div className={`ds-container ${styles.inner}`}>
          <ol className={styles.list}>
            {items.map((c, i) => (
              <li key={c.num} className={styles.item} data-active={i === active}>
                <h3 className={styles.title}>
                  <button type="button" onClick={() => goTo(i)} aria-current={i === active ? 'step' : undefined}>
                    <span className={styles.num}>{c.num}</span>
                    <span>{c.title}</span>
                  </button>
                </h3>
                <div className={styles.detail}>
                  <div className={styles.detailInner}>
                    <p className={styles.desc}>{c.desc}</p>
                    <ul className={styles.points}>
                      {c.list.map((l) => (
                        <li key={l}>{l}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className={styles.media}>
                  <Image
                    src={`/assets/${c.img}`}
                    alt={c.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 44vw"
                    priority={i === 0}
                  />
                  <span className={styles.mediaNum} aria-hidden="true">
                    {c.num} / {String(items.length).padStart(2, '0')}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
