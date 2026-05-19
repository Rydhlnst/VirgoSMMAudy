import { cmsContentSchema } from "@/lib/cms/cms-content.schema";
import { CMS_HOME_SLUG, getCmsPageBySlug } from "@/lib/cms/cms-service";
import { updateContentWithVersioning } from "@/lib/cms/versioning";
import { DEFAULT_LANDING_PAGE_CONTENT } from "./default-content";
import type { LandingPageContent } from "./types";

export async function readLandingPageContent(): Promise<LandingPageContent> {
  try {
    const page = await getCmsPageBySlug(CMS_HOME_SLUG);
    return page.contentJson;
  } catch {
    return DEFAULT_LANDING_PAGE_CONTENT;
  }
}

export async function writeLandingPageContent(
  payload: unknown,
  options?: { actor?: string | null; title?: string },
): Promise<LandingPageContent> {
  const parsed = cmsContentSchema.parse(payload);
  const result = await updateContentWithVersioning({
    slug: CMS_HOME_SLUG,
    title: options?.title ?? "Home",
    nextContent: parsed,
    actor: options?.actor ?? null,
  });
  return result.contentJson as LandingPageContent;
}
