import { describe, expect, it } from 'vitest';
import { createSessionToken, passwordMatches, verifySessionToken } from './admin-session';

const SECRET = 'x'.repeat(40);
const NOW = 1_800_000_000_000;

describe('session tokens', () => {
  it('accepts a fresh token', () => {
    expect(verifySessionToken(createSessionToken(SECRET, 60, NOW), SECRET, NOW + 1000)).toBe(true);
  });
  it('rejects an expired token', () => {
    expect(verifySessionToken(createSessionToken(SECRET, 60, NOW), SECRET, NOW + 61_000)).toBe(false);
  });
  it('rejects a token signed with another secret', () => {
    expect(verifySessionToken(createSessionToken('y'.repeat(40), 60, NOW), SECRET, NOW)).toBe(false);
  });
  it('rejects a tampered payload (cannot extend expiry)', () => {
    const [, sig] = createSessionToken(SECRET, 60, NOW).split('.');
    const forged = Buffer.from(JSON.stringify({ exp: 9_999_999_999 })).toString('base64url');
    expect(verifySessionToken(`${forged}.${sig}`, SECRET, NOW)).toBe(false);
  });
  it.each([undefined, null, '', 'abc', 'a.b.c', '.', 'a.'])('rejects malformed token %s', (t) => {
    expect(verifySessionToken(t as string, SECRET, NOW)).toBe(false);
  });
  it('rejects oversized tokens', () => {
    expect(verifySessionToken('a'.repeat(600), SECRET, NOW)).toBe(false);
  });
});

describe('passwordMatches', () => {
  it('matches only the exact password', () => {
    expect(passwordMatches('correct horse', 'correct horse')).toBe(true);
    expect(passwordMatches('correct horsE', 'correct horse')).toBe(false);
    expect(passwordMatches('', 'correct horse')).toBe(false);
    expect(passwordMatches('correct horse ', 'correct horse')).toBe(false);
  });
});
