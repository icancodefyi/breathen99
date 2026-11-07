import { handleError, HttpError, json, parseBody } from '@/lib/http';
import { fulfilmentSchema, orderPublicIdSchema } from '@/lib/validation/admin';
import type { FulfilmentStatus } from '@/server/models/types';
import { requireAdminApi } from '@/server/services/admin-auth';
import { updateFulfilment } from '@/server/services/admin-orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, ctx: { params: Promise<{ publicId: string }> }) {
  try {
    await requireAdminApi(req);
    const { publicId } = await ctx.params;
    if (!orderPublicIdSchema.safeParse(publicId).success) throw new HttpError(404, 'Order not found.');

    const body = await parseBody(req, fulfilmentSchema);
    const updated = await updateFulfilment(publicId, body.status as FulfilmentStatus, body.note);
    if (!updated) throw new HttpError(404, 'Order not found.');
    return json({ fulfilment: updated.fulfilment });
  } catch (err) {
    return handleError(err);
  }
}
