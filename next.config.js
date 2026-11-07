const isDev = process.env.NODE_ENV !== 'production';

/**
 * Content Security Policy.
 * - Razorpay Checkout needs its script, an iframe, XHR and images from *.razorpay.com.
 * - 'unsafe-inline' for scripts is required for Next's inline bootstrap while pages are static.
 *   (A nonce-based CSP would force dynamic rendering; revisit if/when pages go dynamic.)
 * - 'unsafe-eval' is only added in development (React dev tooling).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ''}https://checkout.razorpay.com https://*.razorpay.com`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https://*.razorpay.com",
  "connect-src 'self' https://*.razorpay.com https://lumberjack.razorpay.com",
  'frame-src https://*.razorpay.com',
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    const privateArea = [
      { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
      { key: 'Cache-Control', value: 'no-store' },
    ];
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/admin/:path*', headers: privateArea },
      { source: '/api/admin/:path*', headers: privateArea },
    ];
  },
};

module.exports = nextConfig;
