'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import styles from './Nav.module.css';

const LEFT = [
  { id: 'about', label: 'About' },
  { id: 'why', label: 'Who It Helps' },
  { id: 'product', label: 'Product' },
] as const;
const RIGHT = [
  { id: 'view', label: '3D View' },
  { id: 'testimonials', label: 'Reviews' },
  { id: 'faq', label: 'FAQ' },
] as const;
const ALL = [...LEFT, ...RIGHT];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mark the link for the section currently in view.
  useEffect(() => {
    const sections = ALL.map((l) => document.getElementById(l.id)).filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Mobile menu: lock page scroll, close on Escape, close if the viewport grows to desktop.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const mq = window.matchMedia('(min-width: 901px)');
    const onChange = () => mq.matches && setOpen(false);
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onChange);
    return () => {
      document.documentElement.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, [open]);

  const close = () => setOpen(false);
  const item = (l: { id: string; label: string }) => (
    <li key={l.id}>
      <a href={`#${l.id}`} className={styles.link} aria-current={active === l.id ? 'true' : undefined}>
        {l.label}
      </a>
    </li>
  );

  return (
    <header className={styles.header} data-solid={scrolled || open}>
      <div className={styles.pill}>
        <nav aria-label="Primary" style={{ display: 'contents' }}>
          <ul className={styles.group}>{LEFT.map(item)}</ul>

          <Link href="/" className={styles.logo} aria-label="breathEN — home" onClick={close}>
            <Image src="/assets/brand/logo-mark.png" alt="breathEN" width={1331} height={265} priority />
          </Link>

          <ul className={`${styles.group} ${styles.groupEnd}`}>
            {RIGHT.map(item)}
            <li>
              <Button href="/checkout" variant="dark" size="sm">
                Buy Now
              </Button>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className={styles.menuBtn}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-menu" className={styles.sheet} data-open={open} inert={!open}>
        <ul className={styles.sheetLinks}>
          {ALL.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={styles.sheetLink}
                aria-current={active === l.id ? 'true' : undefined}
                onClick={close}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.sheetCta}>
          <Button href="/checkout" variant="primary">
            Order Now →
          </Button>
        </div>
      </div>
    </header>
  );
}
