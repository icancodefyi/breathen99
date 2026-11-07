import { cookies } from 'next/headers';
import { clientIp, handleError, HttpError, json, parseBody } from '@/lib/http';
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_TTL_SEC,
  createSessionToken,
  passwordMatches,
  sessionCookieOptions,
} from '@/lib/admin-session';
import { loginSchema } from '@/lib/validation/admin';
import { getAdminConfig } from '@/server/services/admin-auth';
import { enforceRateLimit } from '@/server/services/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const config = getAdminConfig();
    if (!config) throw new HttpError(503, 'Admin is not configured.', 'admin_disabled');

    // Strict limit: 5 attempts per 10 minutes per IP, plus a global ceiling.
    await enforceRateLimit(`admin-login:${clientIp(req)}`, 5, 600);
    await enforceRateLimit('admin-login:global', 60, 3600);

    const { password } = await parseBody(req, loginSchema);
    if (!passwordMatches(password, config.password)) {
      throw new HttpError(401, 'Incorrect password.', 'bad_password');
    }

    (await cookies()).set(ADMIN_COOKIE, createSessionToken(config.secret), sessionCookieOptions(ADMIN_SESSION_TTL_SEC));
    return json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}
