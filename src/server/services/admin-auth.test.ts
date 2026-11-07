import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ADMIN_COOKIE, createSessionToken } from '@/lib/admin-session';

const SECRET = 'k'.repeat(40);
let cookieValue: string | undefined;

vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: () => (cookieValue ? { value: cookieValue } : undefined) }),
}));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));
vi.mock('@/lib/env', () => ({
  getServerEnv: () => ({ ADMIN_PASSWORD: 'correct-horse-battery', ADMIN_SESSION_SECRET: SECRET }),
  publicEnv: { NEXT_PUBLIC_SITE_URL: 'https://shop.test' },
}));

const { requireAdminApi } = await import('./admin-auth');

const req = (method: string, headers: Record<string, string> = {}) =>
  new Request('https://shop.test/api/admin/x', { method, headers });

beforeEach(() => {
  cookieValue = createSessionToken(SECRET);
});

describe('requireAdminApi', () => {
  it('uses the expected cookie name', () => {
    expect(ADMIN_COOKIE).toMatch(/admin_session$/);
  });

  it('401 without a session', async () => {
    cookieValue = undefined;
    await expect(requireAdminApi(req('GET'))).rejects.toMatchObject({ status: 401 });
  });

  it('401 with a forged session', async () => {
    cookieValue = createSessionToken('z'.repeat(40));
    await expect(requireAdminApi(req('GET'))).rejects.toMatchObject({ status: 401 });
  });

  it('allows a signed-in GET with no Origin header', async () => {
    await expect(requireAdminApi(req('GET'))).resolves.toBeUndefined();
  });

  it('allows a signed-in PATCH from our own origin', async () => {
    await expect(requireAdminApi(req('PATCH', { origin: 'https://shop.test' }))).resolves.toBeUndefined();
  });

  it('blocks a signed-in PATCH from another origin (CSRF)', async () => {
    await expect(requireAdminApi(req('PATCH', { origin: 'https://evil.test' }))).rejects.toMatchObject({ status: 403 });
  });

  it('blocks a signed-in PATCH with no Origin header', async () => {
    await expect(requireAdminApi(req('PATCH'))).rejects.toMatchObject({ status: 403 });
  });
});
