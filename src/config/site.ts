export const siteConfig = {
  name: 'breathEN',
  legalName: 'breathEN',
  tagline: 'Pure 99% Oxygen. Anytime. Anywhere.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  logo: '/assets/logo-white.jpg',
  contact: {
    email: 'info@breathen99.com',
    phone: '+919819250202',
    whatsapp: 'https://wa.me/919819250202',
  },
  social: {
    instagram: 'https://www.instagram.com/breathen_99',
    youtube: 'https://www.youtube.com/@breathENOXYGEN',
    twitter: 'https://twitter.com/Breathen_99',
  },
} as const;
