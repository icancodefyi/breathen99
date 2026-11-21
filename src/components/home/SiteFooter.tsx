import Link from 'next/link';
import Image from 'next/image';
import { Tm } from '@/components/ui/Tm';
import { siteConfig } from '@/config/site';
import styles from './SiteFooter.module.css';

const icons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  ),
};

/** Footer: brand, contact details, quick links and legal links (merges the old Contact section). */
export default function SiteFooter() {
  const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;
  return (
    <footer id="contact" className={styles.footer}>
      <div className="ds-container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.logo}>
              breath<span className={styles.en}>EN</span>
              <Tm />
            </span>
            <p className={styles.blurb}>
              The world&apos;s first nose breathing oxygen canister. 99% pure recreational oxygen for urban living,
              fitness, travel, and beyond.
            </p>
            <div className={styles.social}>
              <a href={siteConfig.social.instagram} {...ext}>
                {icons.instagram}
                Instagram
              </a>
              <a href={siteConfig.social.youtube} {...ext}>
                {icons.youtube}
                YouTube
              </a>
              <a href={siteConfig.social.twitter} {...ext}>
                {icons.x}X / Twitter
              </a>
            </div>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Contact Us</h4>
            <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
            <a href={`tel:${siteConfig.contact.phone}`}>+91 98192 50202</a>
            <address>
              Office no.01, 1st floor, B wing
              <br />
              Gami Industrial Park, Plot No. C-39A
              <br />
              Pawane MIDC, Navi Mumbai — 400705
            </address>
          </div>

          <nav className={styles.col} aria-label="Quick links">
            <h4 className={styles.colTitle}>Quick Links</h4>
            <a href="#about">
              About breathEN
              <Tm />
            </a>
            <a href="#why">
              Why breathEN
              <Tm />
            </a>
            <a href="#product">Product Details</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#faq">FAQ</a>
            <a href="https://www.youtube.com/shorts/T9LWqEXDPhE" {...ext}>
              How to Use (Video)
            </a>
          </nav>
        </div>

        <div className={styles.bottom}>
          <span>
            © 2026 breathEN
            <Tm /> · Recreational Oxygen · Navi Mumbai, India
          </span>
          <div className={styles.bottomLinks}>
            <a href="#faq">FAQ</a>
            <a href={`mailto:${siteConfig.contact.email}`}>Contact</a>
            <a href={siteConfig.social.instagram} {...ext}>
              Instagram
            </a>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/refund-policy">Refunds</Link>
            <Link href="/shipping-policy">Shipping</Link>
          </div>
        </div>

        <Image
          src="/assets/brand/logo-mark.png"
          alt=""
          width={1331}
          height={265}
          className={styles.mark}
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
      </div>
    </footer>
  );
}
