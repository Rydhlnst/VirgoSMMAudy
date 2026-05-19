import { toErrorResponse } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { readLandingPageContent } from "@/lib/landing-content/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await readLandingPageContent();
    const response = successResponse(data, {
      message: "Legacy public read endpoint.",
    });
    response.headers.set("X-API-Deprecated", "true");
    response.headers.set("X-API-Replacement", "/api/landing-page (GET) or /api/admin/cms/pages/home (admin)");
    return response;
  } catch (error) {
    return toErrorResponse(error);
  }
}
