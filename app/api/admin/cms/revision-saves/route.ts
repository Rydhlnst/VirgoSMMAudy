import { z } from "zod";
import { toErrorResponse } from "@/lib/api/errors";
import { errorResponse, successResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getContentHistory } from "@/lib/cms/versioning";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const querySchema = z.object({
  page: z.string().trim().min(1).default("home"),
  status: z.enum(["draft", "published", "archived", "history"]).default("history"),
});

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.success) return admin.response;

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    page: url.searchParams.get("page") ?? "home",
    status: url.searchParams.get("status") ?? "history",
  });
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid query params.", 400, parsed.error.issues);
  }

  try {
    const rows = await getContentHistory(parsed.data.page);
    const items = rows.map((row) => ({
      saveId: row.revisionId,
      createdAt: row.createdAt,
      createdBy: row.createdBy ?? null,
      totalChanges: 1,
      draftCount: 0,
      publishedCount: 1,
      archivedCount: 0,
      items: [
        {
          id: row.revisionId,
          contentBlockId: row.revisionId,
          saveBatchId: null,
          versionNumber: row.versionNumber,
          previousValue: row.previousValue,
          newValue: row.newValue,
          changeType: "update",
          status: "published",
          changeSummary: row.changeSummary ?? null,
          createdBy: row.createdBy ?? null,
          createdAt: row.createdAt,
          updatedAt: row.createdAt,
          publishedAt: row.createdAt,
          expiresAt: null,
          isProtected: false,
          blockKey: row.sectionKey,
          blockPage: parsed.data.page,
        },
      ],
    }));
    return successResponse({ items });
  } catch (error) {
    return toErrorResponse(error);
  }
}
