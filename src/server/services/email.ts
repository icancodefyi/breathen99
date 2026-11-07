import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';
import { getServerEnv } from '@/lib/env';
import { siteConfig } from '@/config/site';

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}

declare global {
  var _mailTransport: Transporter | undefined;
}

/** Gmail shows app passwords in groups of four ("abcd efgh ijkl mnop"); strip the spaces. */
const cleanPassword = (p: string) => p.replace(/\s+/g, '');

export function isEmailConfigured(): boolean {
  const env = getServerEnv();
  return Boolean(env.GMAIL_USER && env.GMAIL_APP_PASSWORD);
}

export function getAlertRecipients(): string[] {
  const raw = getServerEnv().ORDER_ALERT_EMAILS ?? '';
  return raw
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
}

function getTransport(user: string, pass: string): Transporter {
  // Reuse the SMTP connection across warm serverless invocations.
  global._mailTransport ??= nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass: cleanPassword(pass) },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return global._mailTransport;
}

/** Sends through Gmail SMTP. Throws on failure so callers can release their claim and retry. */
export async function sendEmail(msg: EmailMessage): Promise<void> {
  const { GMAIL_USER, GMAIL_APP_PASSWORD, EMAIL_FROM } = getServerEnv();
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) throw new Error('Email is not configured');

  // Gmail only lets you send as the signed-in account or a verified "Send mail as" alias.
  await getTransport(GMAIL_USER, GMAIL_APP_PASSWORD).sendMail({
    from: EMAIL_FROM || `${siteConfig.name} <${GMAIL_USER}>`,
    to: msg.to,
    subject: msg.subject,
    html: msg.html,
    text: msg.text,
  });
}
