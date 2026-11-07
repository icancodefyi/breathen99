import 'server-only';
import { getServerEnv } from '@/lib/env';

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}

export function isEmailConfigured(): boolean {
  const env = getServerEnv();
  return Boolean(env.RESEND_API_KEY && env.EMAIL_FROM);
}

export function getAlertRecipients(): string[] {
  const raw = getServerEnv().ORDER_ALERT_EMAILS ?? '';
  return raw
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
}

/** Sends via Resend's HTTP API. Throws on failure so callers can retry. */
export async function sendEmail(msg: EmailMessage): Promise<void> {
  const { RESEND_API_KEY, EMAIL_FROM } = getServerEnv();
  if (!RESEND_API_KEY || !EMAIL_FROM) throw new Error('Email is not configured');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: Array.isArray(msg.to) ? msg.to : [msg.to],
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 300)}`);
  }
}
