import type { Metadata } from 'next';
import { Bebas_Neue, Cormorant_Garamond, DM_Sans, Inter_Tight, Playfair_Display } from 'next/font/google';
import './globals.css';
import '../styles/design.css';
import { siteConfig } from '@/config/site';

// Legacy fonts below are used only by checkout/thank-you, so they are not preloaded.
// Self-hosted at build time: no request to Google from the visitor's browser.
const bebas = Bebas_Neue({
  preload: false,
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--nf-bebas',
});
const cormorant = Cormorant_Garamond({
  preload: false,
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--nf-cormorant',
});
const dmSans = DM_Sans({
  preload: false,
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--nf-dm-sans',
});
const playfair = Playfair_Display({
  preload: false,
  subsets: ['latin'],
  weight: ['700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--nf-playfair',
});
// New design system: one grotesque family, weights 400–600.
const interTight = Inter_Tight({ subsets: ['latin'], display: 'swap', variable: '--nf-inter-tight' });
const fontVars = [bebas, cormorant, dmSans, playfair, interTight].map((f) => f.variable).join(' ');

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "breathEN — World's First Nose Breathing Oxygen Canister | 99% Pure Oxygen",
  description:
    "breathEN is the world's first nose breathing oxygen canister with 99% pure recreational oxygen. Instant boost for fitness, travel, pollution & stress. No prescription needed. Ships across India.",
  keywords:
    'breathEN, oxygen canister, recreational oxygen, portable oxygen, 99% pure oxygen, nose breathing, oxygen boost, fitness oxygen, altitude sickness, pollution relief',
  openGraph: {
    title: 'breathEN — Pure 99% Oxygen. Anytime. Anywhere.',
    description:
      "World's first nose breathing oxygen canister. Instant refresh for urban living, fitness, travel & stress. Zero side effects.",
    images: ['/assets/product.png'],
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
