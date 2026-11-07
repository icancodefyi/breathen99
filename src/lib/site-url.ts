/**
 * Canonical site URL, without a trailing slash.
 * Order: explicit NEXT_PUBLIC_SITE_URL, then Vercel's production/preview URL, then localhost.
 * The Vercel fallbacks mean a forgotten env var never puts "localhost" into emails or metadata.
 */
export function resolveSiteUrl(env: Record<string, string | undefined> = process.env): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

/**
 * Resolved once at module load. Explicit `process.env.X` references (not a spread of
 * process.env) so Next.js can inline NEXT_PUBLIC_SITE_URL into client bundles too.
 */
export const SITE_URL = resolveSiteUrl({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_URL: process.env.VERCEL_URL,
});
