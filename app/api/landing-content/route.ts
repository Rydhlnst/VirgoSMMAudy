import { toErrorResponse } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { readLandingPageContent } from "@/lib/landing-content/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await readLandingPageContent();
    return successResponse(data);
  } catch (error) {
    return toErrorResponse(error);
  }
}
