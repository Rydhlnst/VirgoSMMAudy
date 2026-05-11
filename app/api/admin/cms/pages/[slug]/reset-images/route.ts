import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminSession } from "@/lib/auth/admin";
import { resetCmsPageImages } from "@/lib/cms/cms-service";

export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdminSession(session)) {
    return NextResponse.json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
  }

  const { slug } = await params;
  try {
    const page = await resetCmsPageImages(slug);
    return NextResponse.json({
      success: true,
      data: {
        slug: page.slug,
        title: page.title,
        status: page.status,
        contentJson: page.contentJson,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reset images.";
    return NextResponse.json({ success: false, error: { message } }, { status: 500 });
  }
}

