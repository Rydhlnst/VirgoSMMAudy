import { toErrorResponse } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createCmsAuditReport } from "@/lib/cms/content-audit";
import { getCmsPageBySlug } from "@/lib/cms/cms-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const admin = await requireAdmin(request);
  if (!admin.success) {
    return admin.response;
  }

  const { slug } = await params;

  try {
    const page = await getCmsPageBySlug(slug);
    const report = createCmsAuditReport(page.contentJson);

    return successResponse({
      summary: report.summary,
      issues: report.issues,
      fingerprints: report.fingerprints,
      updatedAt: page.updatedAt,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

