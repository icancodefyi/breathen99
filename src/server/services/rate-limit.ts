import 'server-only';
import { rateLimitsCol } from '@/server/models/collections';
import { HttpError } from '@/lib/http';

/** Fixed-window limiter backed by Mongo (works across serverless instances; TTL index cleans up). */
export async function enforceRateLimit(key: string, limit: number, windowSec: number) {
  const windowMs = windowSec * 1000;
  const windowId = Math.floor(Date.now() / windowMs);
  const col = await rateLimitsCol();
  const doc = await col.findOneAndUpdate(
    { _id: `${key}:${windowId}` },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((windowId + 1) * windowMs + 60_000) } },
    { upsert: true, returnDocument: 'after' },
  );
  if (doc && doc.count > limit) throw new HttpError(429, 'Too many requests. Please slow down.', 'rate_limited');
}
