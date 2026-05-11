import { toErrorResponse } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";
import { defaultHomeContent } from "@/lib/cms/cms-content-default";
import { writeLandingPageContent } from "@/lib/landing-content/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.success) {
    return admin.response;
  }

  try {
    const data = await writeLandingPageContent(defaultHomeContent);
    return successResponse(data, { message: "Landing page content reset to default successfully." });
  } catch (error) {
    return toErrorResponse(error);
  }
}
