import { z } from 'zod';
import { FULFILMENT_STATUSES } from '@/server/models/types';

export const loginSchema = z.object({ password: z.string().min(1).max(200) });

export const fulfilmentSchema = z.object({
  status: z.enum(FULFILMENT_STATUSES as unknown as [string, ...string[]]),
  note: z.string().trim().max(500).optional(),
});

export const orderPublicIdSchema = z.string().regex(/^[a-f0-9]{32}$/);

/** Query-string filters shared by the admin list page and the CSV export. */
export const orderFiltersSchema = z.object({
  q: z.string().trim().max(100).optional(),
  status: z.enum(['all', 'paid', 'created', 'failed']).default('paid'),
  fulfilment: z.enum(['all', ...FULFILMENT_STATUSES] as [string, ...string[]]).default('all'),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
});

export type OrderFilters = z.infer<typeof orderFiltersSchema>;
