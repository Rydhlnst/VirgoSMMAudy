import { toErrorResponse } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";
import { cleanupOldRevisions } from "@/lib/cms/revision.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.success) return admin.response;

  try {
    const result = await cleanupOldRevisions();
    return successResponse(result, { message: "Revision cleanup completed." });
  } catch (error) {
    return toErrorResponse(error);
  }
}
