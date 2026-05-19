import { z } from "zod";
import { revalidatePath } from "next/cache";
import { toErrorResponse } from "@/lib/api/errors";
import { errorResponse, successResponse } from "@/lib/api/response";
import { safeJson } from "@/lib/api/parse-request";
import { requireAdmin } from "@/lib/auth/require-admin";
import { restoreContentVersion } from "@/lib/cms/versioning";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rollbackSchema = z.object({
  changeSummary: z.string().trim().max(280).optional(),
  slug: z.string().trim().min(1).default("home"),
});

export async function POST(request: Request, { params }: { params: Promise<{ revisionId: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin.success) return admin.response;

  const body = await safeJson(request);
  const parsed = rollbackSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid rollback payload.", 400, parsed.error.issues);
  }

  const { revisionId } = await params;
  if (!revisionId) {
    return errorResponse("BAD_REQUEST", "Revision ID is required.", 400);
  }

  try {
    const result = await restoreContentVersion({
      slug: parsed.data.slug,
      revisionId,
      actor: admin.session?.user?.email ?? null,
    });
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/services");
    revalidatePath("/portfolio");
    revalidatePath("/contact");
    return successResponse(result, { message: "Restore completed as a new latest version." });
  } catch (error) {
    return toErrorResponse(error);
  }
}
