import { getCmsPageBySlug } from "./cms-service";
import type { CmsContent } from "./cms-content.types";

export async function getCmsContentBySlug(slug: string): Promise<CmsContent> {
  const page = await getCmsPageBySlug(slug);
  return page.contentJson;
}
