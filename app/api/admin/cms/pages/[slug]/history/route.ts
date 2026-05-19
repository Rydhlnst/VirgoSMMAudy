import { z } from "zod";
import { toErrorResponse } from "@/lib/api/errors";
import { errorResponse, successResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getContentHistory } from "@/lib/cms/versioning";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const querySchema = z.object({
  section: z.string().optional(),
});

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin.success) return admin.response;

  const { slug } = await params;
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    section: url.searchParams.get("section") ?? undefined,
  });
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid query params.", 400, parsed.error.issues);
  }

  try {
    const items = await getContentHistory(slug, parsed.data.section as never);
    return successResponse({ items });
  } catch (error) {
    return toErrorResponse(error);
  }
}
