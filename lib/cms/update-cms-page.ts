import { cmsContentSchema } from "./cms-content.schema";
import { updateContentWithVersioning } from "./versioning";

export async function updateCmsPageBySlug(
  slug: string,
  payload: {
    title: string;
    contentJson: unknown;
  },
) {
  const contentJson = cmsContentSchema.parse(payload.contentJson);
  return updateContentWithVersioning({
    slug,
    title: payload.title,
    nextContent: contentJson,
    actor: null,
  });
}
