import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpError } from '@/lib/http';

const set = vi.fn();
const enforceRateLimit = vi.fn();
let config: { password: string; secret: string } | null;

vi.mock('next/headers', () => ({ cookies: async () => ({ set }) }));
vi.mock('@/server/services/rate-limit', () => ({ enforceRateLimit }));
vi.mock('@/server/services/admin-auth', () => ({ getAdminConfig: () => config }));

const { POST } = await import('./route');

const call = (body: unknown) =>
  POST(new Request('http://x/api/admin/login', { method: 'POST', body: JSON.stringify(body) }));

beforeEach(() => {
  vi.clearAllMocks();
  enforceRateLimit.mockResolvedValue(undefined);
  config = { password: 'correct-horse-battery', secret: 's'.repeat(40) };
});

describe('POST /api/admin/login', () => {
  it('signs in with the right password and sets a hardened cookie', async () => {
    const res = await call({ password: 'correct-horse-battery' });
    expect(res.status).toBe(200);
    expect(set).toHaveBeenCalledTimes(1);
    const [, token, opts] = set.mock.calls[0];
    expect(token).toContain('.');
    expect(opts).toMatchObject({ httpOnly: true, sameSite: 'strict', path: '/' });
  });

  it('rejects a wrong password without setting a cookie', async () => {
    const res = await call({ password: 'nope' });
    expect(res.status).toBe(401);
    expect(set).not.toHaveBeenCalled();
  });

  it('is disabled (503) when admin env vars are not set', async () => {
    config = null;
    const res = await call({ password: 'anything' });
    expect(res.status).toBe(503);
    expect(set).not.toHaveBeenCalled();
  });

  it('returns 429 once the rate limit is hit and never checks the password', async () => {
    enforceRateLimit.mockRejectedValueOnce(new HttpError(429, 'Too many requests.'));
    const res = await call({ password: 'correct-horse-battery' });
    expect(res.status).toBe(429);
    expect(set).not.toHaveBeenCalled();
  });

  it('rejects an empty or malformed body', async () => {
    expect((await call({})).status).toBe(400);
    expect((await call({ password: '' })).status).toBe(400);
  });
});
