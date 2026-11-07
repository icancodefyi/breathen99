import { describe, expect, it } from 'vitest';
import { resolveSiteUrl } from './site-url';

describe('resolveSiteUrl', () => {
  it('prefers the explicit URL and trims trailing slashes', () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: 'https://breathen99.com/' })).toBe('https://breathen99.com');
  });
  it('falls back to the Vercel production URL, then the deployment URL', () => {
    expect(
      resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'breathen99.vercel.app', VERCEL_URL: 'x-abc.vercel.app' }),
    ).toBe('https://breathen99.vercel.app');
    expect(resolveSiteUrl({ VERCEL_URL: 'x-abc.vercel.app' })).toBe('https://x-abc.vercel.app');
  });
  it('treats an empty value as unset and defaults to localhost', () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: '  ' })).toBe('http://localhost:3000');
    expect(resolveSiteUrl({})).toBe('http://localhost:3000');
  });
});
