import { z } from "zod";
import { toErrorResponse } from "@/lib/api/errors";
import { safeJson } from "@/lib/api/parse-request";
import { errorResponse, successResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";
import { cmsContentSchema } from "@/lib/cms/cms-content.schema";
import { getCmsPageBySlug } from "@/lib/cms/cms-service";
import { updateContentWithVersioning } from "@/lib/cms/versioning";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const updateCmsPageSchema = z.object({
  title: z.string().trim().min(1, "Title wajib diisi."),
  contentJson: cmsContentSchema,
});

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin.success) {
    return admin.response;
  }

  const { slug } = await params;

  try {
    const page = await getCmsPageBySlug(slug);
    return successResponse({
      slug: page.slug,
      title: page.title,
      status: page.status,
      contentJson: page.contentJson,
      publishedAt: page.publishedAt,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin.success) {
    return admin.response;
  }

  const body = await safeJson(request);
  if (body === null) {
    return errorResponse("BAD_REQUEST", "Invalid JSON body.", 400);
  }

  const parsed = updateCmsPageSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid CMS payload.", 400, parsed.error.issues);
  }

  const { slug } = await params;

  try {
    const result = await updateContentWithVersioning({
      slug,
      title: parsed.data.title,
      nextContent: parsed.data.contentJson,
      actor: admin.session?.user?.email ?? null,
    });
    const updated = await getCmsPageBySlug(slug);

    return successResponse(
      {
        slug: updated.slug,
        title: parsed.data.title,
        status: "published",
        contentJson: updated.contentJson,
        publishedAt: updated.publishedAt,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        changedFields: result.changedFields,
        changeSummary: result.changeSummary,
        noChanges: result.noChanges,
      },
      { message: result.noChanges ? "No changes detected." : "Changes saved as a new revision." },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
