import { describe, expect, it } from 'vitest';
import { evaluateSetup } from './setup-status';

const full = {
  mongodbUri: 'mongodb://x',
  razorpayKeyId: 'rzp_live_x',
  razorpayKeySecret: 's',
  razorpayWebhookSecret: 'w',
  gmailUser: 'a@b.com',
  gmailAppPassword: 'p',
  orderAlertEmails: 'f@b.com',
  explicitSiteUrl: 'https://breathen99.com',
};
const missing = (i: Parameters<typeof evaluateSetup>[0]) =>
  evaluateSetup(i)
    .filter((x) => !x.ok)
    .map((x) => x.key);

describe('evaluateSetup', () => {
  it('reports nothing missing when fully configured', () => {
    expect(missing(full)).toEqual([]);
  });

  it('flags every item on a blank install', () => {
    expect(missing({})).toHaveLength(7);
  });

  it('marks payment settings as required and email/site URL as recommended', () => {
    const level = Object.fromEntries(evaluateSetup({}).map((x) => [x.key, x.level]));
    expect(level.MONGODB_URI).toBe('required');
    expect(level.RAZORPAY_KEY_SECRET).toBe('required');
    expect(level.NEXT_PUBLIC_RAZORPAY_KEY_ID).toBe('required');
    expect(level.RAZORPAY_WEBHOOK_SECRET).toBe('required');
    expect(level.ORDER_ALERT_EMAILS).toBe('recommended');
  });

  it('needs both Gmail values, and treats whitespace-only alert emails as unset', () => {
    expect(missing({ ...full, gmailUser: undefined })).toEqual(['GMAIL_USER / GMAIL_APP_PASSWORD']);
    expect(missing({ ...full, orderAlertEmails: '   ' })).toEqual(['ORDER_ALERT_EMAILS']);
  });

  it('never includes secret values in its output', () => {
    expect(JSON.stringify(evaluateSetup(full))).not.toContain('rzp_live_x');
  });
});
