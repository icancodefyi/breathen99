import { cookies } from 'next/headers';
import { handleError, json } from '@/lib/http';
import { ADMIN_COOKIE, sessionCookieOptions } from '@/lib/admin-session';
import { requireAdminApi } from '@/server/services/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await requireAdminApi(req);
    // Expire with the exact same attributes the cookie was set with (see sessionCookieOptions).
    (await cookies()).set(ADMIN_COOKIE, '', sessionCookieOptions(0));
    return json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}
