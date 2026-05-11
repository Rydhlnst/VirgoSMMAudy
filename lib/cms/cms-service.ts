import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { cmsPages } from "@/db/schema/cms-pages.schema";
import { getLandingPageContent } from "@/lib/landing-content/landing-content.repository";
import { mapLandingContentRowToContent } from "@/lib/landing-content/landing-content.mapper";
import { defaultHomeContent } from "./cms-content-default";
import { cmsContentSchema } from "./cms-content.schema";
import type { CmsContent, CmsPage } from "./cms-content.types";

export const CMS_HOME_SLUG = "home";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }

  if (!isRecord(base)) {
    return (override === undefined ? base : override) as T;
  }

  const source = isRecord(override) ? override : {};
  const next: Record<string, unknown> = { ...base };

  for (const key of Object.keys(next)) {
    next[key] = deepMerge(next[key], source[key]);
  }

  for (const [key, value] of Object.entries(source)) {
    if (!(key in next)) {
      next[key] = value;
    }
  }

  return next as T;
}

function normalizeContent(input: unknown): CmsContent {
  const parsed = cmsContentSchema.safeParse(input);
  if (parsed.success) {
    return parsed.data;
  }

  const merged = deepMerge(defaultHomeContent, input);
  return cmsContentSchema.parse(merged);
}

function mergeDefaultContentPreserveExisting(input: unknown): CmsContent {
  // Fill missing keys using defaultHomeContent, but never overwrite existing values.
  // This is safe to run on already-valid content because it only adds new fields.
  const merged = deepMerge(defaultHomeContent, input);
  return cmsContentSchema.parse(merged);
}

function mapRow(row: typeof cmsPages.$inferSelect): CmsPage {
  return {
    slug: row.slug,
    title: row.title,
    status: row.status,
    contentJson: normalizeContent(row.contentJson),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    publishedAt: row.publishedAt,
  };
}

async function getLegacyHomeContent(): Promise<CmsContent | null> {
  const row = await getLandingPageContent("default");
  if (!row) {
    return null;
  }

  const mapped = mapLandingContentRowToContent(row);
  return normalizeContent(mapped);
}

export async function ensureCmsPageExists(slug: string): Promise<CmsPage> {
  const db = getDb();

  const [existing] = await db.select().from(cmsPages).where(eq(cmsPages.slug, slug)).limit(1);
  if (existing) {
    return mapRow(existing);
  }

  const legacyContent = slug === CMS_HOME_SLUG ? await getLegacyHomeContent() : null;
  const content = legacyContent ?? defaultHomeContent;
  const now = new Date();

  const [inserted] = await db
    .insert(cmsPages)
    .values({
      slug,
      title: slug === CMS_HOME_SLUG ? "Home" : slug,
      contentJson: content,
      status: "published",
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing({ target: cmsPages.slug })
    .returning();

  if (inserted) {
    return mapRow(inserted);
  }

  const [afterConflict] = await db.select().from(cmsPages).where(eq(cmsPages.slug, slug)).limit(1);
  if (!afterConflict) {
    throw new Error(`Failed to ensure cms page for slug '${slug}'.`);
  }

  return mapRow(afterConflict);
}

export async function getCmsPageBySlug(slug: string): Promise<CmsPage> {
  const db = getDb();
  const [row] = await db.select().from(cmsPages).where(eq(cmsPages.slug, slug)).limit(1);

  if (!row) {
    return ensureCmsPageExists(slug);
  }

  // Always merge defaults to safely introduce new fields (schema evolution) without clobbering user edits.
  const normalizedContent = mergeDefaultContentPreserveExisting(row.contentJson);
  if (JSON.stringify(normalizedContent) !== JSON.stringify(row.contentJson)) {
    const now = new Date();
    const [updated] = await db
      .update(cmsPages)
      .set({ contentJson: normalizedContent, updatedAt: now })
      .where(and(eq(cmsPages.slug, slug), eq(cmsPages.id, row.id)))
      .returning();

    if (updated) {
      return mapRow(updated);
    }
  }

  return mapRow(row);
}

export async function syncCmsPageWithDefaults(slug: string): Promise<CmsPage> {
  // Explicit "push defaults into DB" (missing keys only). Safe: preserves existing values.
  const db = getDb();
  const [row] = await db.select().from(cmsPages).where(eq(cmsPages.slug, slug)).limit(1);

  if (!row) {
    return ensureCmsPageExists(slug);
  }

  const merged = mergeDefaultContentPreserveExisting(row.contentJson);
  if (JSON.stringify(merged) === JSON.stringify(row.contentJson)) {
    return mapRow(row);
  }

  const now = new Date();
  const [updated] = await db
    .update(cmsPages)
    .set({ contentJson: merged, updatedAt: now })
    .where(and(eq(cmsPages.slug, slug), eq(cmsPages.id, row.id)))
    .returning();

  return mapRow(updated ?? row);
}

function clearImageFieldsDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((v) => clearImageFieldsDeep(v));
  }
  if (!isRecord(value)) return value;

  const next: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    // Clear all known image-ish keys (schema uses urlOrEmpty, so empty string valid).
    if (
      k === "imageUrl" ||
      k === "thumbnailUrl" ||
      k === "heroImageUrl" ||
      k === "workImageUrl" ||
      k === "beforeImageUrl" ||
      k === "afterImageUrl" ||
      k === "icon"
    ) {
      next[k] = "";
      continue;
    }

    if (k === "cmsMeta") {
      // Reset crop metadata too.
      next[k] = { images: {} };
      continue;
    }

    next[k] = clearImageFieldsDeep(v);
  }
  return next;
}

export async function resetCmsPageImages(slug: string): Promise<CmsPage> {
  // Explicit action: blank all image URL fields so UI shows Skeletons.
  const db = getDb();
  const [row] = await db.select().from(cmsPages).where(eq(cmsPages.slug, slug)).limit(1);
  const base = row ? row.contentJson : defaultHomeContent;

  const cleared = clearImageFieldsDeep(base);
  const normalized = normalizeContent(cleared);

  const now = new Date();
  const [updated] = await db
    .insert(cmsPages)
    .values({
      slug,
      title: row?.title ?? (slug === CMS_HOME_SLUG ? "Home" : slug),
      contentJson: normalized,
      status: "published",
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: cmsPages.slug,
      set: {
        contentJson: normalized,
        status: "published",
        publishedAt: now,
        updatedAt: now,
      },
    })
    .returning();
  if (updated) return mapRow(updated);
  if (row) return mapRow(row);
  return ensureCmsPageExists(slug);
}

export async function updateCmsPageContent(
  slug: string,
  payload: {
    title: string;
    contentJson: unknown;
  },
): Promise<CmsPage> {
  const db = getDb();
  const normalizedContent = normalizeContent(payload.contentJson);
  const now = new Date();

  const [row] = await db
    .insert(cmsPages)
    .values({
      slug,
      title: payload.title,
      contentJson: normalizedContent,
      status: "published",
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: cmsPages.slug,
      set: {
        title: payload.title,
        contentJson: normalizedContent,
        status: "published",
        publishedAt: now,
        updatedAt: now,
      },
    })
    .returning();

  return mapRow(row);
}
