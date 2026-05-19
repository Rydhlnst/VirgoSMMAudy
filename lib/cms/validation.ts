import { z } from "zod";
import { cmsContentSchema } from "@/lib/cms/cms-content.schema";
import type { CmsSectionKey } from "@/lib/cms/content-keys";
import { getValueAtPath } from "@/lib/cms/content-keys";

export function validateContentPayload(payload: unknown) {
  return cmsContentSchema.parse(payload);
}

export function validateSectionPayload(section: CmsSectionKey, content: unknown) {
  const parsed = cmsContentSchema.parse(content);
  const value = getValueAtPath(parsed, section);
  const result = z.unknown().safeParse(value);
  if (!result.success) {
    throw new Error(`Invalid section payload for ${section}.`);
  }
  return result.data;
}
