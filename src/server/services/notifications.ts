import 'server-only';
import { ordersCol } from '@/server/models/collections';
import type { OrderDoc } from '@/server/models/types';
import { newOrderAlertEmail, orderConfirmationEmail } from '@/server/emails/templates';
import { getAlertRecipients, isEmailConfigured, sendEmail, type EmailMessage } from './email';

type EmailKey = 'confirmationAt' | 'alertAt';

/**
 * Claims the right to send one email for a paid order (atomic, so the payment
 * verify route and the webhook racing each other can never double-send), sends
 * it, and releases the claim if sending fails so a later attempt can retry.
 */
async function claimAndSend(publicId: string, key: EmailKey, build: (order: OrderDoc) => EmailMessage) {
  const col = await ordersCol();
  const field = `emails.${key}` as const;
  const order = await col.findOneAndUpdate(
    { publicId, status: 'paid', [field]: { $exists: false } },
    { $set: { [field]: new Date() } },
    { returnDocument: 'after' },
  );
  if (!order) return; // not paid yet, or already sent

  try {
    await sendEmail(build(order));
  } catch (err) {
    console.error(`[email] ${key} failed for order ${publicId}`, err);
    await col.updateOne({ publicId }, { $unset: { [field]: '' } });
  }
}

/** Send the customer confirmation and the founder alert, each at most once. Never throws. */
export async function sendOrderEmailsOnce(publicId: string) {
  try {
    if (!isEmailConfigured()) {
      console.warn('[email] RESEND_API_KEY / EMAIL_FROM not set; skipping order emails');
      return;
    }
    await claimAndSend(publicId, 'confirmationAt', orderConfirmationEmail);

    const recipients = getAlertRecipients();
    if (recipients.length > 0) {
      await claimAndSend(publicId, 'alertAt', (o) => newOrderAlertEmail(o, recipients));
    }
  } catch (err) {
    console.error('[email] unexpected failure', err);
  }
}
