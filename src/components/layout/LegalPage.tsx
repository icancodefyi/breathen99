import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { legal, legalLinks } from '@/config/legal';
import styles from './LegalPage.module.css';

export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <header className={styles.header}>
        <Link href="/" aria-label={`${siteConfig.name} home`} style={{ display: 'flex' }}>
          <Image src={siteConfig.logo} alt={siteConfig.name} width={120} height={36} style={{ objectFit: 'contain' }} />
        </Link>
        <Link href="/" className={styles.back}>
          ← Back to site
        </Link>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.updated}>Last updated: {legal.lastUpdated}</p>
        <div className={styles.content}>{children}</div>
      </main>
      <div role="contentinfo" className={styles.footer}>
        <div role="navigation" aria-label="Legal" className={styles.footerLinks}>
          {legalLinks.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
        © {new Date().getFullYear()} {siteConfig.name}
      </div>
    </>
  );
}
