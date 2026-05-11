import { toErrorResponse } from "@/lib/api/errors";
import { safeJson } from "@/lib/api/parse-request";
import { errorResponse, successResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";
import { upsertAdminLandingContent } from "@/lib/landing-content/landing-content.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.success) {
    return admin.response;
  }

  const body = await safeJson(request);
  if (body === null) {
    return errorResponse("BAD_REQUEST", "Invalid JSON body.", 400);
  }

  try {
    const data = await upsertAdminLandingContent(body);
    return successResponse(data, { message: "Landing page content updated successfully." });
  } catch (error) {
    return toErrorResponse(error);
  }
}
