import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerEnv, publicEnv } from '@/lib/env';
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin-session';
import { HttpError } from '@/lib/http';

/** Returns null when admin credentials are not configured (admin is then disabled). */
export function getAdminConfig() {
  const { ADMIN_PASSWORD, ADMIN_SESSION_SECRET } = getServerEnv();
  if (!ADMIN_PASSWORD || !ADMIN_SESSION_SECRET) return null;
  return { password: ADMIN_PASSWORD, secret: ADMIN_SESSION_SECRET };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const config = getAdminConfig();
  if (!config) return false;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return verifySessionToken(token, config.secret);
}

/** For admin pages: bounce to the login screen. */
export async function requireAdminPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login');
}

/** For admin API routes: 401 unless signed in; mutating requests must also come from our own origin. */
export async function requireAdminApi(req: Request) {
  if (!(await isAdminAuthenticated())) throw new HttpError(401, 'Not signed in.');
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const origin = req.headers.get('origin');
    const allowed = new URL(publicEnv.NEXT_PUBLIC_SITE_URL).origin;
    const host = req.headers.get('host');
    const sameHost = origin && host && new URL(origin).host === host;
    if (!origin || (origin !== allowed && !sameHost)) throw new HttpError(403, 'Cross-origin request blocked.');
  }
}
