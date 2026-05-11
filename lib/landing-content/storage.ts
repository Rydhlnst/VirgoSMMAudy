import { landingPageContentSchema } from "./schema";
import { getPublicLandingContent, upsertAdminLandingContent } from "./landing-content.service";
import type { LandingPageContent } from "./types";

export async function readLandingPageContent(): Promise<LandingPageContent> {
  return getPublicLandingContent();
}

export async function writeLandingPageContent(payload: unknown): Promise<LandingPageContent> {
  const parsed = landingPageContentSchema.parse(payload);
  return upsertAdminLandingContent(parsed);
}
