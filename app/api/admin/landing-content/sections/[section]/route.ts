import { toErrorResponse } from "@/lib/api/errors";
import { safeJson } from "@/lib/api/parse-request";
import { errorResponse, successResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  landingContentSectionSchema,
  landingContentSectionSchemas,
} from "@/lib/landing-content/landing-content.validation";
import { readLandingPageContent, writeLandingPageContent } from "@/lib/landing-content/storage";

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
  const parsedSection = landingContentSectionSchema.safeParse(section);
  if (!parsedSection.success) {
    return errorResponse("INVALID_SECTION", "Invalid landing content section.", 400, parsedSection.error.issues);
  }

  const sectionKey = parsedSection.data;
  const sectionSchema = landingContentSectionSchemas[sectionKey];
  const parsedBody = sectionSchema.safeParse(body);

  if (!parsedBody.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid section payload.", 400, parsedBody.error.issues);
  }

  try {
    const current = await readLandingPageContent();
    const next = {
      ...current,
      [sectionKey]: parsedBody.data,
    };

    const data = await writeLandingPageContent(next);
    return successResponse(data, { message: "Landing page section updated successfully." });
  } catch (error) {
    return toErrorResponse(error);
  }
}