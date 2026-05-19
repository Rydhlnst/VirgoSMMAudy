import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth/admin";
import { defaultHomeContent } from "@/lib/cms/cms-content-default";
import { getCmsPageBySlug } from "@/lib/cms/cms-service";
import { updateContentWithVersioning } from "@/lib/cms/versioning";

export const dynamic = "force-dynamic";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) return (Array.isArray(override) ? override : base) as T;
  if (!isRecord(base)) return (override === undefined ? base : override) as T;
  const source = isRecord(override) ? override : {};
  const next: Record<string, unknown> = { ...base };
  for (const key of Object.keys(next)) next[key] = deepMerge(next[key], source[key]);
  for (const [key, value] of Object.entries(source)) if (!(key in next)) next[key] = value;
  return next as T;
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdminSession(session)) {
    return NextResponse.json(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 },
    );
  }

  const { slug } = await params;

  try {
    const page = await getCmsPageBySlug(slug);
    const nextContent = deepMerge(defaultHomeContent, page.contentJson);
    const result = await updateContentWithVersioning({
      slug,
      title: page.title,
      nextContent,
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
    const message = error instanceof Error ? error.message : "Failed to sync defaults.";
    return NextResponse.json(
      { success: false, error: { message } },
      { status: 500 },
    );
  }
}
