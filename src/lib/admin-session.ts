import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = process.env.NODE_ENV === 'production' ? '__Host-admin_session' : 'admin_session';
export const ADMIN_SESSION_TTL_SEC = 60 * 60 * 8; // 8 hours

/**
 * Cookie attributes, shared by login and logout. They MUST match: a `__Host-` cookie
 * can only be set or cleared by a Set-Cookie that also carries `Secure`, so clearing
 * with different attributes would silently leave the session alive.
 */
export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge,
  };
}

const b64 = (buf: Buffer | string) => Buffer.from(buf).toString('base64url');

function sign(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest();
}

/** Signed, expiring session token: base64url(payload).base64url(hmac). Contains no secrets. */
export function createSessionToken(secret: string, ttlSec = ADMIN_SESSION_TTL_SEC, nowMs = Date.now()): string {
  const payload = b64(JSON.stringify({ exp: Math.floor(nowMs / 1000) + ttlSec }));
  return `${payload}.${b64(sign(payload, secret))}`;
}

export function verifySessionToken(token: string | undefined | null, secret: string, nowMs = Date.now()): boolean {
  if (!token || token.length > 512) return false;
  const [payload, sig, extra] = token.split('.');
  if (!payload || !sig || extra !== undefined) return false;

  const expected = sign(payload, secret);
  let given: Buffer;
  try {
    given = Buffer.from(sig, 'base64url');
  } catch {
    return false;
  }
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp?: unknown };
    return typeof exp === 'number' && exp > Math.floor(nowMs / 1000);
  } catch {
    return false;
  }
}

/** Constant-time password comparison (hashes first so lengths never leak). */
export function passwordMatches(input: string, expected: string): boolean {
  const a = createHash('sha256').update(input).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}
