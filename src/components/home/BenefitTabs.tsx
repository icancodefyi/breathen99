'use client';
import { useId, useState, type CSSProperties, type KeyboardEvent } from 'react';
import styles from './Product.module.css';

interface Group {
  id: string;
  label: string;
  items: { title: string; desc: string }[];
}

/** Accessible tabs: arrow keys move between tabs, only the active panel is shown. */
export default function BenefitTabs({ groups }: { groups: Group[] }) {
  const [active, setActive] = useState(0);
  const base = useId();

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (active + (e.key === 'ArrowRight' ? 1 : -1) + groups.length) % groups.length;
    setActive(next);
    document.getElementById(`${base}-tab-${next}`)?.focus();
  };

  return (
    <>
      <div className={styles.tabs} role="tablist" aria-label="Product benefits" onKeyDown={onKeyDown}>
        {groups.map((g, i) => (
          <button
            key={g.id}
            id={`${base}-tab-${i}`}
            type="button"
            role="tab"
            className={styles.tab}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            {g.label}
          </button>
        ))}
      </div>

      {groups.map((g, i) => (
        <div
          key={g.id}
          id={`${base}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${i}`}
          hidden={i !== active}
        >
          <ul className={styles.tiles}>
            {g.items.map((it, k) => (
              <li key={it.title} className={styles.tile} style={{ '--i': k } as CSSProperties}>
                <span className={styles.tileIndex}>{String(k + 1).padStart(2, '0')}</span>
                <div>
                  <h4 className={styles.tileTitle}>{it.title}</h4>
                  <p className={styles.tileDesc}>{it.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
