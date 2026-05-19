import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth/admin";
import { getCmsPageBySlug } from "@/lib/cms/cms-service";
import { updateContentWithVersioning } from "@/lib/cms/versioning";

export const dynamic = "force-dynamic";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function clearImageFieldsDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((v) => clearImageFieldsDeep(v));
  if (!isRecord(value)) return value;
  const next: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    if (k === "imageUrl" || k === "thumbnailUrl" || k === "heroImageUrl" || k === "workImageUrl" || k === "beforeImageUrl" || k === "afterImageUrl" || k === "icon") {
      next[k] = "";
      continue;
    }
    if (k === "cmsMeta") {
      next[k] = { images: {} };
      continue;
    }
    next[k] = clearImageFieldsDeep(v);
  }
  return next;
}

export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdminSession(session)) {
    return NextResponse.json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
  }

  const { slug } = await params;
  try {
    const page = await getCmsPageBySlug(slug);
    const cleared = clearImageFieldsDeep(page.contentJson);
    const result = await updateContentWithVersioning({
      slug,
      title: page.title,
      nextContent: cleared,
      actor: session?.user?.email ?? null,
    });
    return NextResponse.json({
      success: true,
      data: {
        slug,
        title: page.title,
        status: "published",
        contentJson: result.contentJson,
        noChanges: result.noChanges,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reset images.";
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}
