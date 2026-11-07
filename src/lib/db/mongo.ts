import 'server-only';
import { MongoClient, type Db } from 'mongodb';
import { getServerEnv } from '@/lib/env';
import { HttpError } from '@/lib/http';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  // Cache across hot reloads (dev) and warm serverless invocations (Vercel).
  if (!global._mongoClientPromise) {
    const { MONGODB_URI } = getServerEnv();
    if (!MONGODB_URI) {
      console.error('[db] MONGODB_URI is not set');
      throw new HttpError(503, 'Service temporarily unavailable. Please try again shortly.', 'db_unconfigured');
    }
    global._mongoClientPromise = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    }).connect();
  }
  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(getServerEnv().MONGODB_DB);
}
