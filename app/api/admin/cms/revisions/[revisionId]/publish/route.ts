import { errorResponse, successResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ revisionId: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin.success) return admin.response;

  const { revisionId } = await params;
  if (!revisionId) {
    return errorResponse("BAD_REQUEST", "Revision ID is required.", 400);
  }

  return errorResponse(
    "ENDPOINT_DEPRECATED",
    "Revision publish flow is deprecated. Save already creates latest published revision.",
    410,
  );
}
