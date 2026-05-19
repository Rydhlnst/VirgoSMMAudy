import { z } from "zod";
import { toErrorResponse } from "@/lib/api/errors";
import { safeJson } from "@/lib/api/parse-request";
import { errorResponse, successResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";
import { cmsContentSchema } from "@/lib/cms/cms-content.schema";
import { applyContentPathChanges, hasPath } from "@/lib/cms/content-audit";
import { getCmsPageBySlug } from "@/lib/cms/cms-service";
import { updateContentWithVersioning } from "@/lib/cms/versioning";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const patchChangeSchema = z.object({
  path: z.string().min(1, "Path wajib diisi."),
  value: z.unknown(),
});

const patchContentSchema = z.object({
  title: z.string().trim().min(1, "Title wajib diisi."),
  changes: z.array(patchChangeSchema).min(1, "Minimal satu perubahan dibutuhkan.").optional(),
  contentJson: z.unknown().optional(),
}).superRefine((value, ctx) => {
  if (!value.contentJson && (!value.changes || value.changes.length === 0)) {
    ctx.addIssue({
      code: "custom",
      message: "Either 'contentJson' or at least one 'changes' entry is required.",
      path: ["contentJson"],
    });
  }
});

function isKnownDynamicCmsPath(path: string) {
  return path.startsWith("cmsMeta.images.");
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const admin = await requireAdmin(request);
  if (!admin.success) {
    return admin.response;
  }

  const body = await safeJson(request);
  if (body === null) {
    return errorResponse("BAD_REQUEST", "Invalid JSON body.", 400);
  }

  const parsed = patchContentSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid content-paths payload.", 400, parsed.error.issues);
  }

  const { slug } = await params;

  try {
    const page = await getCmsPageBySlug(slug);

    let changedPaths: string[] = [];
    let nextContentCandidate: unknown;

    if (parsed.data.contentJson !== undefined) {
      nextContentCandidate = parsed.data.contentJson;
    } else {
      const changes = parsed.data.changes ?? [];
      const unknownPath = changes.find(
        (change) => !hasPath(page.contentJson, change.path) && !isKnownDynamicCmsPath(change.path),
      );
      if (unknownPath) {
        return errorResponse(
          "INVALID_PATH",
          `Path '${unknownPath.path}' tidak ditemukan pada content saat ini.`,
          400,
        );
      }
      changedPaths = changes.map((change) => change.path);
      nextContentCandidate = applyContentPathChanges(page.contentJson, changes);
    }

    const parsedContent = cmsContentSchema.safeParse(nextContentCandidate);
    if (!parsedContent.success) {
      return errorResponse("VALIDATION_ERROR", "Patched content tidak valid.", 400, parsedContent.error.issues);
    }
    const result = await updateContentWithVersioning({
      slug,
      title: parsed.data.title,
      nextContent: parsedContent.data,
      actor: admin.session?.user?.email ?? null,
    });

    return successResponse(
      {
        slug,
        title: parsed.data.title,
        status: "published",
        contentJson: result.contentJson,
        changedPaths: changedPaths.length > 0 ? changedPaths : result.changedFields.map((field) => field.path),
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
