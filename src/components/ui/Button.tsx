import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  href: string;
  variant?: 'dark' | 'light' | 'primary' | 'link';
  size?: 'md' | 'sm';
  /** Opens in a new tab (use for off-site links). */
  external?: boolean;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

function Arrow() {
  return (
    <svg className={styles.arrow} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Button({
  href,
  variant = 'dark',
  size = 'md',
  external,
  arrow,
  className,
  children,
}: ButtonProps) {
  const cls = [styles.btn, styles[variant], size === 'sm' ? styles.sm : '', className].filter(Boolean).join(' ');
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <Arrow />}
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
