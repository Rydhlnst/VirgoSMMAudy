import { toErrorResponse } from "@/lib/api/errors";
import { safeJson } from "@/lib/api/parse-request";
import { errorResponse, successResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";
import { updateAdminLandingSection } from "@/lib/landing-content/landing-content.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ section: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin.success) {
    return admin.response;
  }

  const body = await safeJson(request);
  if (body === null) {
    return errorResponse("BAD_REQUEST", "Invalid JSON body.", 400);
  }

  const { section } = await params;

  try {
    const data = await updateAdminLandingSection(section, body);
    return successResponse(data, { message: "Landing page section updated successfully." });
  } catch (error) {
    return toErrorResponse(error);
  }
}
