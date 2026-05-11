import { toErrorResponse } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { getPublicLandingContent } from "@/lib/landing-content/landing-content.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPublicLandingContent();
    return successResponse(data);
  } catch (error) {
    return toErrorResponse(error);
  }
}
