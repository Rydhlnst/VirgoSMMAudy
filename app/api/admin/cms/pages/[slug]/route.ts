import { z } from "zod";
import { revalidatePath } from "next/cache";
import { toErrorResponse } from "@/lib/api/errors";
import { safeJson } from "@/lib/api/parse-request";
import { errorResponse, successResponse } from "@/lib/api/response";
import { requireAdmin } from "@/lib/auth/require-admin";
import { cmsContentSchema } from "@/lib/cms/cms-content.schema";
import { getCmsPageBySlug, updateCmsPageContent } from "@/lib/cms/cms-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const updateCmsPageSchema = z.object({
  title: z.string().trim().min(1, "Title wajib diisi."),
  contentJson: cmsContentSchema,
});

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin.success) {
    return admin.response;
  }

  const { slug } = await params;

  try {
    const page = await getCmsPageBySlug(slug);
    return successResponse({
      slug: page.slug,
      title: page.title,
      status: page.status,
      contentJson: page.contentJson,
      publishedAt: page.publishedAt,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin.success) {
    return admin.response;
  }

  const body = await safeJson(request);
  if (body === null) {
    return errorResponse("BAD_REQUEST", "Invalid JSON body.", 400);
  }

  const parsed = updateCmsPageSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", "Invalid CMS payload.", 400, parsed.error.issues);
  }

  const { slug } = await params;

  try {
    const page = await updateCmsPageContent(slug, parsed.data);
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/services");
    revalidatePath("/portfolio");
    revalidatePath("/contact");

    return successResponse(
      {
        slug: page.slug,
        title: page.title,
        status: page.status,
        contentJson: page.contentJson,
        publishedAt: page.publishedAt,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      },
      { message: "CMS page updated successfully." },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
