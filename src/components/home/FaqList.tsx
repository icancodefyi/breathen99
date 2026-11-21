'use client';
import { useState } from 'react';
import { withTm } from '@/components/ui/Tm';
import styles from './Faq.module.css';

interface Item {
  q: string;
  a: string;
}

/**
 * Native <details> accordion. The first group is always shown; the rest sit behind a
 * "See all" button. Hidden items stay in the HTML, so the content remains in the page source.
 */
export default function FaqList({ top, rest }: { top: Item[]; rest: Item[] }) {
  const [all, setAll] = useState(false);

  const render = (f: Item) => (
    <details key={f.q} className={styles.item} name="faq">
      <summary>
        {withTm(f.q)}
        <span className={styles.icon} aria-hidden="true" />
      </summary>
      <p className={styles.answer}>{withTm(f.a)}</p>
    </details>
  );

  return (
    <>
      {top.map(render)}
      <div id="faq-more" hidden={!all}>
        {rest.map(render)}
      </div>
      <button
        type="button"
        className={styles.more}
        aria-expanded={all}
        aria-controls="faq-more"
        onClick={() => setAll((v) => !v)}
      >
        {all ? 'Show fewer questions' : `See all ${top.length + rest.length} questions`}
      </button>
    </>
  );
}
