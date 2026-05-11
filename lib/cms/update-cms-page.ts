import { updateCmsPageContent } from "./cms-service";
import { cmsContentSchema } from "./cms-content.schema";

export async function updateCmsPageBySlug(
  slug: string,
  payload: {
    title: string;
    contentJson: unknown;
  },
) {
  const contentJson = cmsContentSchema.parse(payload.contentJson);
  return updateCmsPageContent(slug, { title: payload.title, contentJson });
}
