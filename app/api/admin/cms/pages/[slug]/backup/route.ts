import { revalidatePath } from "next/cache";
import { z } from "zod";
import { toErrorResponse } from "@/lib/api/errors";
import { safeJson } from "@/lib/api/parse-request";
import { errorResponse, successResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";
import { exportCMSBackup } from "@/lib/cms/backup";
import { importCMSBackup } from "@/lib/cms/actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const importSchema = z.object({
  title: z.string().min(1),
  contentJson: z.unknown(),
});

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin.success) return admin.response;
  const { slug } = await params;
  try {
    const data = await exportCMSBackup(slug);
    return successResponse(data);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin.success) return admin.response;
  const { slug } = await params;
  const body = await safeJson(request);
  if (body === null) return errorResponse("BAD_REQUEST", "Invalid JSON body.", 400);
  const parsed = importSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid import payload.", 400, parsed.error.issues);
  }
  try {
    const result = await importCMSBackup({
      slug,
      title: parsed.data.title,
      contentJson: parsed.data.contentJson,
      actor: admin.session?.user?.email ?? null,
    });
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/services");
    revalidatePath("/portfolio");
    revalidatePath("/contact");
    return successResponse(result, { message: "Backup imported as a new revision." });
  } catch (error) {
    return toErrorResponse(error);
  }
}
