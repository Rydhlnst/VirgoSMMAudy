import { cookies } from "next/headers";
import { toErrorResponse } from "@/lib/api/errors";
import { successResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin.success) {
    return admin.response;
  }

  try {
    const cookieStore = await cookies();
    cookieStore.set("cms_edit", "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return successResponse({ enabled: true }, { message: "Edit mode enabled." });
  } catch (error) {
    return toErrorResponse(error);
  }
}
