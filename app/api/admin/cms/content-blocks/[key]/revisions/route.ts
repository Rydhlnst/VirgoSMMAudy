import { z } from "zod";
import { toErrorResponse } from "@/lib/api/errors";
import { errorResponse, successResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getRevisionHistoryByBlockKey } from "@/lib/cms/revision.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export async function GET(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin.success) return admin.response;

  const { key } = await params;
  if (!key) {
    return errorResponse("BAD_REQUEST", "Content block key is required.", 400);
  }

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    page: url.searchParams.get("page") ?? "1",
    limit: url.searchParams.get("limit") ?? "20",
    status: url.searchParams.get("status") ?? undefined,
  });

  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid query params.", 400, parsed.error.issues);
  }

  try {
    const result = await getRevisionHistoryByBlockKey(key, parsed.data);
    return successResponse(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
