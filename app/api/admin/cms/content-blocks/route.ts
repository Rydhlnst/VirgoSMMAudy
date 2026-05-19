import { z } from "zod";
import { toErrorResponse } from "@/lib/api/errors";
import { errorResponse, successResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listContentBlocksWithRevisionSummary } from "@/lib/cms/revision.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const querySchema = z.object({
  page: z.string().trim().min(1).optional(),
});

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.success) return admin.response;

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    page: url.searchParams.get("page") ?? undefined,
  });
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid query params.", 400, parsed.error.issues);
  }

  try {
    const items = await listContentBlocksWithRevisionSummary(parsed.data.page);
    return successResponse({ items });
  } catch (error) {
    return toErrorResponse(error);
  }
}
