import type { z } from "zod";
import { cmsContentSchema } from "./cms-content.schema";

export type CmsContentInput = z.input<typeof cmsContentSchema>;
export type CmsContent = z.output<typeof cmsContentSchema>;

export type CmsPage = {
  slug: string;
  title: string;
  status: "draft" | "published";
  contentJson: CmsContent;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
};
