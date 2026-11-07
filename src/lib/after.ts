import { after } from 'next/server';

/**
 * Run work after the HTTP response has been sent (keeps the serverless function
 * alive until it finishes). Falls back to fire-and-forget outside a request scope.
 */
export function runAfter(task: () => Promise<unknown>) {
  const safe = () =>
    task().catch((err) => {
      console.error('[after] background task failed', err);
    });
  try {
    after(safe);
  } catch {
    void safe();
  }
}
