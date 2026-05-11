import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { landingPageContent } from "@/db/schema/landing-content.schema";
import { mapLandingContentRowToContent } from "@/lib/landing-content/landing-content.mapper";
import type { LandingContentSection } from "@/lib/landing-content/landing-content.validation";
import type { LandingPageContent } from "@/lib/landing-content/types";

export async function getLandingPageContent(siteKey: string) {
  const db = getDb();
  const [row] = await db.select().from(landingPageContent).where(eq(landingPageContent.siteKey, siteKey)).limit(1);
  return row ?? null;
}

export async function createLandingPageContent(siteKey: string, data: LandingPageContent) {
  const db = getDb();
  const [row] = await db
    .insert(landingPageContent)
    .values({
      siteKey,
      ...data,
    })
    .returning();

  return row;
}

export async function updateLandingPageContent(siteKey: string, data: LandingPageContent) {
  const db = getDb();
  const [row] = await db
    .update(landingPageContent)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(landingPageContent.siteKey, siteKey))
    .returning();

  return row ?? null;
}

export async function upsertLandingPageContent(siteKey: string, data: LandingPageContent) {
  const db = getDb();
  const [row] = await db
    .insert(landingPageContent)
    .values({
      siteKey,
      ...data,
    })
    .onConflictDoUpdate({
      target: landingPageContent.siteKey,
      set: {
        ...data,
        updatedAt: new Date(),
      },
    })
    .returning();

  return row;
}

export async function updateLandingPageSection(siteKey: string, section: LandingContentSection, data: unknown) {
  const existing = await getLandingPageContent(siteKey);
  if (!existing) {
    return null;
  }

  const currentContent = mapLandingContentRowToContent(existing);
  const nextContent = {
    ...currentContent,
    [section]: data,
  } as LandingPageContent;

  return updateLandingPageContent(siteKey, nextContent);
}

export async function deleteLandingPageContent(siteKey: string) {
  const db = getDb();
  const [row] = await db
    .delete(landingPageContent)
    .where(eq(landingPageContent.siteKey, siteKey))
    .returning({ id: landingPageContent.id });

  return row ?? null;
}
