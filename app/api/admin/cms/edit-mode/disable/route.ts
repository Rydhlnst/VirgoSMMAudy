import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { requireAdmin } = await import("@/lib/auth/require-admin");

    const admin = await requireAdmin(request);
    if (!admin.success) {
      return admin.response;
    }

    const response = NextResponse.json({ ok: true, enabled: false, message: "Edit mode disabled." });
    response.cookies.set("cms_edit", "0", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to disable edit mode.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
