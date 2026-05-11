import { cmsContentSchema } from "@/lib/cms/cms-content.schema";
import { CMS_HOME_SLUG, getCmsPageBySlug, updateCmsPageContent } from "@/lib/cms/cms-service";
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

export async function writeLandingPageContent(payload: unknown): Promise<LandingPageContent> {
  const parsed = cmsContentSchema.parse(payload);
  const updated = await updateCmsPageContent(CMS_HOME_SLUG, {
    title: "Home",
    contentJson: parsed,
  });
  return updated.contentJson;
}
