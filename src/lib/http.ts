import { NextResponse } from 'next/server';
import { z, ZodError, type ZodType } from 'zod';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
  }
}

export function json<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, { ...init, headers: { 'Cache-Control': 'no-store', ...init?.headers } });
}

export async function parseBody<T>(req: Request, schema: ZodType<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new HttpError(400, 'Invalid JSON body');
  }
  return schema.parse(raw);
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return fwd?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

/** Maps known errors to safe responses; never leaks internals. */
export function handleError(err: unknown) {
  if (err instanceof HttpError) return json({ error: err.message, code: err.code }, { status: err.status });
  if (err instanceof ZodError) {
    return json({ error: 'Validation failed', fields: z.flattenError(err).fieldErrors }, { status: 400 });
  }
  console.error('[api] unhandled error', err);
  return json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
}
