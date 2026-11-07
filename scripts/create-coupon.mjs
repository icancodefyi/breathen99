// Usage: node --env-file=.env.local scripts/create-coupon.mjs CODE PCT [usageLimit] [expiresISO]
import { MongoClient } from 'mongodb';

const [code, pct, limit, expires] = process.argv.slice(2);
if (!code || !pct) {
  console.error('Usage: node --env-file=.env.local scripts/create-coupon.mjs CODE PCT [usageLimit] [expiresISO]');
  process.exit(1);
}
const discountPct = Number(pct);
if (!Number.isFinite(discountPct) || discountPct < 1 || discountPct > 90) {
  console.error('PCT must be between 1 and 90');
  process.exit(1);
}
const client = new MongoClient(process.env.MONGODB_URI);
try {
  const col = client.db(process.env.MONGODB_DB || 'breathen99').collection('coupons');
  await col.createIndex({ code: 1 }, { unique: true });
  await col.updateOne(
    { code: code.toUpperCase() },
    {
      $set: {
        discountPct,
        active: true,
        usageLimit: limit ? Number(limit) : null,
        expiresAt: expires ? new Date(expires) : null,
      },
      $setOnInsert: { usedCount: 0, createdAt: new Date() },
    },
    { upsert: true },
  );
  console.log(`Coupon ${code.toUpperCase()} saved (${discountPct}% off).`);
} finally {
  await client.close();
}
