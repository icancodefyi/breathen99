import { beforeEach, describe, expect, it, vi } from 'vitest';

type Doc = Record<string, unknown> & { emails?: Record<string, Date> };
let doc: Doc;
const sendEmail = vi.fn();
let alerts: string[] = [];

vi.mock('@/server/models/collections', () => ({
  ordersCol: async () => ({
    findOneAndUpdate: async (filter: Record<string, unknown>, update: { $set: Record<string, Date> }) => {
      const [field] = Object.keys(update.$set);
      const key = field.split('.')[1];
      if (filter.publicId !== doc.publicId || doc.status !== 'paid' || doc.emails?.[key]) return null;
      doc.emails = { ...doc.emails, [key]: update.$set[field] };
      return doc;
    },
    updateOne: async (_f: unknown, update: { $unset: Record<string, string> }) => {
      const key = Object.keys(update.$unset)[0].split('.')[1];
      delete doc.emails?.[key];
    },
  }),
}));
vi.mock('./email', () => ({
  isEmailConfigured: () => true,
  getAlertRecipients: () => alerts,
  sendEmail: (...a: unknown[]) => sendEmail(...a),
}));
vi.mock('@/server/emails/templates', () => ({
  orderConfirmationEmail: () => ({ kind: 'confirmation' }),
  newOrderAlertEmail: () => ({ kind: 'alert' }),
}));

const { sendOrderEmailsOnce } = await import('./notifications');

beforeEach(() => {
  vi.clearAllMocks();
  alerts = ['founder@example.com'];
  doc = { publicId: 'abc', status: 'paid' };
  sendEmail.mockResolvedValue(undefined);
});

describe('sendOrderEmailsOnce', () => {
  it('sends the confirmation and the alert once', async () => {
    await sendOrderEmailsOnce('abc');
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  it('does not send again when called a second time (verify + webhook race)', async () => {
    await sendOrderEmailsOnce('abc');
    await sendOrderEmailsOnce('abc');
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  it('two concurrent calls still send each email only once', async () => {
    await Promise.all([sendOrderEmailsOnce('abc'), sendOrderEmailsOnce('abc')]);
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  it('sends nothing for an unpaid order', async () => {
    doc.status = 'created';
    await sendOrderEmailsOnce('abc');
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('skips the alert when no founder recipients are configured', async () => {
    alerts = [];
    await sendOrderEmailsOnce('abc');
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it('releases the claim on failure so a later attempt can retry, and never throws', async () => {
    sendEmail.mockRejectedValueOnce(new Error('smtp down'));
    await expect(sendOrderEmailsOnce('abc')).resolves.toBeUndefined();
    expect(doc.emails?.confirmationAt).toBeUndefined();
    await sendOrderEmailsOnce('abc');
    expect(doc.emails?.confirmationAt).toBeInstanceOf(Date);
  });
});
