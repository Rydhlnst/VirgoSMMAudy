import { landingPageContentSchema } from "@/lib/landing-content/schema";
import { readLandingPageContent, writeLandingPageContent } from "@/lib/landing-content/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await readLandingPageContent();
  return Response.json({ success: true, data });
}

export async function PATCH(request: Request) {
  try {
    const json = (await request.json()) as unknown;
    const parsed = landingPageContentSchema.safeParse(json);
    if (!parsed.success) {
      return Response.json(
        { success: false, error: "Validation error", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const saved = await writeLandingPageContent(parsed.data);
    return Response.json({ success: true, data: saved });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}

