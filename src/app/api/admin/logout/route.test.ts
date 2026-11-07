import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sessionCookieOptions } from '@/lib/admin-session';

const set = vi.fn();
const requireAdminApi = vi.fn();

vi.mock('next/headers', () => ({ cookies: async () => ({ set }) }));
vi.mock('@/server/services/admin-auth', () => ({ requireAdminApi }));

const { POST } = await import('./route');

beforeEach(() => {
  vi.clearAllMocks();
  requireAdminApi.mockResolvedValue(undefined);
});

describe('POST /api/admin/logout', () => {
  it('expires the cookie immediately, with the same attributes it was set with', async () => {
    const res = await POST(new Request('http://x/api/admin/logout', { method: 'POST' }));
    expect(res.status).toBe(200);
    const [name, value, opts] = set.mock.calls[0];
    expect(name).toMatch(/admin_session$/);
    expect(value).toBe('');
    expect(opts).toEqual(sessionCookieOptions(0));
    expect(opts.maxAge).toBe(0);
  });

  it('requires a signed-in session', async () => {
    const { HttpError } = await import('@/lib/http');
    requireAdminApi.mockRejectedValueOnce(new HttpError(401, 'Not signed in.'));
    const res = await POST(new Request('http://x/api/admin/logout', { method: 'POST' }));
    expect(res.status).toBe(401);
    expect(set).not.toHaveBeenCalled();
  });
});

describe('sessionCookieOptions', () => {
  it('sets Secure in production (required for __Host- cookies to be set or cleared)', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(sessionCookieOptions(60)).toMatchObject({ secure: true, httpOnly: true, sameSite: 'strict', path: '/' });
    vi.unstubAllEnvs();
  });
  it('omits Secure in development so http://localhost works', () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect(sessionCookieOptions(60).secure).toBe(false);
    vi.unstubAllEnvs();
  });
});
