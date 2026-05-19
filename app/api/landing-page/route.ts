import { toErrorResponse } from "@/lib/api/errors";
import { errorResponse, successResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";
import { readLandingPageContent } from "@/lib/landing-content/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await readLandingPageContent();
    const response = successResponse(data, {
      message: "Legacy endpoint. Use /api/admin/cms/pages/home for admin content reads.",
    });
    response.headers.set("X-API-Deprecated", "true");
    response.headers.set("X-API-Replacement", "/api/admin/cms/pages/home");
    return response;
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.success) {
    return admin.response;
  }
  return errorResponse(
    "ENDPOINT_DEPRECATED",
    "PATCH /api/landing-page is deprecated. Use PATCH /api/admin/cms/pages/home.",
    405,
  );
}
