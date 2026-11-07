import { beforeEach, describe, expect, it, vi } from 'vitest';

const connect = vi.fn();
let env: Record<string, string | undefined>;

vi.mock('mongodb', () => ({
  MongoClient: class {
    constructor(public uri: string) {}
    connect() {
      connect(this.uri);
      return Promise.resolve({ db: (name: string) => ({ name }) });
    }
  },
}));
vi.mock('@/lib/env', () => ({ getServerEnv: () => env }));

const { getDb } = await import('./mongo');

beforeEach(() => {
  vi.clearAllMocks();
  global._mongoClientPromise = undefined;
});

describe('getDb', () => {
  it('answers 503 (not a crash) when MONGODB_URI is not set', async () => {
    env = {};
    await expect(getDb()).rejects.toMatchObject({ status: 503, code: 'db_unconfigured' });
    expect(connect).not.toHaveBeenCalled();
  });

  it('connects once and uses the configured database name', async () => {
    env = { MONGODB_URI: 'mongodb://example', MONGODB_DB: 'breathen99' };
    const a = (await getDb()) as unknown as { name: string };
    await getDb();
    expect(a.name).toBe('breathen99');
    expect(connect).toHaveBeenCalledTimes(1);
  });
});
