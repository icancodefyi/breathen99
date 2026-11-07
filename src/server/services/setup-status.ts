import 'server-only';
import { getServerEnv, publicEnv } from '@/lib/env';

export interface SetupItem {
  key: string;
  label: string;
  hint: string;
  ok: boolean;
  level: 'required' | 'recommended';
}

interface Input {
  mongodbUri?: string;
  razorpayKeyId?: string;
  razorpayKeySecret?: string;
  razorpayWebhookSecret?: string;
  gmailUser?: string;
  gmailAppPassword?: string;
  orderAlertEmails?: string;
  explicitSiteUrl?: string;
}

/** Which launch settings are still blank. Pure and secret-free: reports presence only, never values. */
export function evaluateSetup(i: Input): SetupItem[] {
  return [
    {
      key: 'MONGODB_URI',
      label: 'MongoDB connection',
      hint: 'Orders, coupons and this dashboard need the database. Use a user limited to the breathen99 database.',
      ok: Boolean(i.mongodbUri),
      level: 'required',
    },
    {
      key: 'NEXT_PUBLIC_RAZORPAY_KEY_ID',
      label: 'Razorpay key ID',
      hint: 'Checkout cannot take payments without it. It is read at build time, so redeploy after adding it.',
      ok: Boolean(i.razorpayKeyId),
      level: 'required',
    },
    {
      key: 'RAZORPAY_KEY_SECRET',
      label: 'Razorpay key secret',
      hint: 'Needed to create orders and verify payments.',
      ok: Boolean(i.razorpayKeySecret),
      level: 'required',
    },
    {
      key: 'RAZORPAY_WEBHOOK_SECRET',
      label: 'Razorpay webhook secret',
      hint: 'Confirms payments even if the customer closes the tab. Also add the webhook URL in the Razorpay dashboard.',
      ok: Boolean(i.razorpayWebhookSecret),
      level: 'required',
    },
    {
      key: 'GMAIL_USER / GMAIL_APP_PASSWORD',
      label: 'Gmail sender',
      hint: 'Order confirmation and alert emails are switched off until both are set.',
      ok: Boolean(i.gmailUser && i.gmailAppPassword),
      level: 'recommended',
    },
    {
      key: 'ORDER_ALERT_EMAILS',
      label: 'Founder alert emails',
      hint: 'Who gets a "new order" email. Without it only customers are emailed.',
      ok: Boolean(i.orderAlertEmails?.trim()),
      level: 'recommended',
    },
    {
      key: 'NEXT_PUBLIC_SITE_URL',
      label: 'Site URL',
      hint: 'Used in email links and page metadata, e.g. https://breathen99.com. Falls back to the Vercel URL until set.',
      ok: Boolean(i.explicitSiteUrl?.trim()),
      level: 'recommended',
    },
  ];
}

export function getSetupStatus(): SetupItem[] {
  const env = getServerEnv();
  return evaluateSetup({
    mongodbUri: env.MONGODB_URI,
    razorpayKeyId: publicEnv.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    razorpayKeySecret: env.RAZORPAY_KEY_SECRET,
    razorpayWebhookSecret: env.RAZORPAY_WEBHOOK_SECRET,
    gmailUser: env.GMAIL_USER,
    gmailAppPassword: env.GMAIL_APP_PASSWORD,
    orderAlertEmails: env.ORDER_ALERT_EMAILS,
    explicitSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  });
}
