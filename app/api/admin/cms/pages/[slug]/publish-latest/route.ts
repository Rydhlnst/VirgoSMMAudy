import { errorResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin.success) return admin.response;

  const { slug } = await params;

  return errorResponse(
    "ENDPOINT_DEPRECATED",
    `publish-latest for '${slug}' is deprecated. Save already creates latest published revision.`,
    410,
  );
}
