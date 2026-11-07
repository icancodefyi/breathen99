import { z } from 'zod';

/** Optional string: an empty value (e.g. `FOO=` in .env) counts as unset. */
const optional = (min = 0) => z.preprocess((v) => (v === '' ? undefined : v), z.string().min(min).optional());

const serverSchema = z.object({
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  MONGODB_DB: z.string().default('breathen99'),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  // Email via Gmail SMTP (needs an app password). If unset, emails are skipped with a warning.
  GMAIL_USER: optional(),
  GMAIL_APP_PASSWORD: optional(),
  EMAIL_FROM: optional(),
  ORDER_ALERT_EMAILS: optional(),
  // Admin orders page. If unset, the admin area is disabled (fails closed).
  ADMIN_PASSWORD: optional(12),
  ADMIN_SESSION_SECRET: optional(32),
});

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
});

/** Public (browser-safe) env. Safe to import anywhere. */
export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || undefined,
});

/** Server-only env. Validated lazily so builds without secrets still work. */
export function getServerEnv() {
  if (typeof window !== 'undefined') {
    throw new Error('getServerEnv() must not be called in the browser');
  }
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    // Plain Error (not ZodError) so API handlers answer 500, not a misleading 400.
    throw new Error(`Invalid server environment: ${parsed.error.issues.map((i) => i.path.join('.')).join(', ')}`);
  }
  return parsed.data;
}
