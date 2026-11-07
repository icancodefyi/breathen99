import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendMail = vi.fn();
const createTransport = vi.fn(() => ({ sendMail }));
let env: Record<string, string | undefined>;

vi.mock('nodemailer', () => ({ default: { createTransport } }));
vi.mock('@/lib/env', () => ({ getServerEnv: () => env }));

const { sendEmail, isEmailConfigured, getAlertRecipients } = await import('./email');

const msg = { to: 'c@example.com', subject: 'Hi', html: '<p>Hi</p>', text: 'Hi' };

beforeEach(() => {
  vi.clearAllMocks();
  global._mailTransport = undefined;
  sendMail.mockResolvedValue({});
  env = { GMAIL_USER: 'orders@breathen99.com', GMAIL_APP_PASSWORD: 'abcd efgh ijkl mnop' };
});

describe('email service (Gmail SMTP)', () => {
  it('is configured only when both Gmail credentials are set', () => {
    expect(isEmailConfigured()).toBe(true);
    env = { GMAIL_USER: 'orders@breathen99.com' };
    expect(isEmailConfigured()).toBe(false);
    env = {};
    expect(isEmailConfigured()).toBe(false);
  });

  it('connects to Gmail over TLS and strips spaces from the app password', async () => {
    await sendEmail(msg);
    expect(createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: 'orders@breathen99.com', pass: 'abcdefghijklmnop' },
      }),
    );
  });

  it('sends as the Gmail account by default, or as EMAIL_FROM when set', async () => {
    await sendEmail(msg);
    expect(sendMail.mock.calls[0][0].from).toBe('breathEN <orders@breathen99.com>');
    env.EMAIL_FROM = 'breathEN Orders <orders@breathen99.com>';
    await sendEmail(msg);
    expect(sendMail.mock.calls[1][0].from).toBe('breathEN Orders <orders@breathen99.com>');
  });

  it('passes recipients, subject, html and text through', async () => {
    await sendEmail(msg);
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'c@example.com', subject: 'Hi', html: '<p>Hi</p>', text: 'Hi' }),
    );
  });

  it('reuses one transport across sends', async () => {
    await sendEmail(msg);
    await sendEmail(msg);
    expect(createTransport).toHaveBeenCalledTimes(1);
  });

  it('throws when not configured, and propagates SMTP failures so callers can retry', async () => {
    env = {};
    await expect(sendEmail(msg)).rejects.toThrow('not configured');
    env = { GMAIL_USER: 'a@b.com', GMAIL_APP_PASSWORD: 'x' };
    sendMail.mockRejectedValueOnce(new Error('535 bad credentials'));
    await expect(sendEmail(msg)).rejects.toThrow('535');
  });
});

describe('getAlertRecipients', () => {
  it('splits, trims and drops empties', () => {
    env = { ORDER_ALERT_EMAILS: ' a@x.com, ,b@x.com ,' };
    expect(getAlertRecipients()).toEqual(['a@x.com', 'b@x.com']);
  });
  it('returns an empty list when unset', () => {
    env = {};
    expect(getAlertRecipients()).toEqual([]);
  });
});
