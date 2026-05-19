import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { cmsContentBlocks, cmsContentRevisions, cmsPages } from "@/db/schema";
import { getCmsPageBySlug } from "@/lib/cms/cms-service";
import { CMS_SECTION_KEYS, type CmsSectionKey, getValueAtPath, sectionKeyToBlockKey, setValueAtPath } from "@/lib/cms/content-keys";
import { diffValues } from "@/lib/cms/diff";
import { buildFriendlyChangeSummary } from "@/lib/cms/summary";
import { validateContentPayload } from "@/lib/cms/validation";

type UpdateContentInput = {
  slug: string;
  title: string;
  nextContent: unknown;
  actor?: string | null;
};

async function getNextVersionNumber(contentBlockId: string, tx: { select: ReturnType<typeof getDb>["select"] }) {
  const [row] = await tx
    .select({ maxVersion: sql<number>`coalesce(max(${cmsContentRevisions.versionNumber}), 0)` })
    .from(cmsContentRevisions)
    .where(eq(cmsContentRevisions.contentBlockId, contentBlockId));
  return Number(row?.maxVersion ?? 0) + 1;
}

export async function getContentByPage(slug: string) {
  return getCmsPageBySlug(slug);
}

export async function getContentByKey(slug: string, sectionKey: CmsSectionKey) {
  const page = await getCmsPageBySlug(slug);
  return getValueAtPath(page.contentJson, sectionKey);
}

export async function updateContentWithVersioning(input: UpdateContentInput) {
  const db = getDb();
  const actor = input.actor ?? null;
  const now = new Date();

  const page = await getCmsPageBySlug(input.slug);
  const parsedNext = validateContentPayload(input.nextContent);
  const changedFields = diffValues(page.contentJson, parsedNext);
  if (changedFields.length === 0) {
    return { changedFields: [], changeSummary: [], contentJson: page.contentJson, noChanges: true as const };
  }

  const changedSections = new Set<CmsSectionKey>();
  for (const field of changedFields) {
    for (const sectionKey of CMS_SECTION_KEYS) {
      if (field.path === sectionKey || field.path.startsWith(`${sectionKey}.`) || field.path.startsWith(`${sectionKey}[`)) {
        changedSections.add(sectionKey);
      }
    }
  }

  await db.transaction(async (tx) => {
    for (const sectionKey of changedSections) {
      const blockKey = sectionKeyToBlockKey(input.slug, sectionKey);
      const beforeValue = getValueAtPath(page.contentJson, sectionKey);
      const afterValue = getValueAtPath(parsedNext, sectionKey);
      const sectionDiff = diffValues(beforeValue, afterValue, sectionKey);
      if (sectionDiff.length === 0) continue;

      const [block] = await tx
        .insert(cmsContentBlocks)
        .values({
          key: blockKey,
          page: input.slug,
          type: "section",
          value: afterValue,
          status: "published",
          updatedBy: actor,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: cmsContentBlocks.key,
          set: { value: afterValue, updatedBy: actor, updatedAt: now },
        })
        .returning();

      const versionNumber = await getNextVersionNumber(block.id, tx);
      const friendlySummary = buildFriendlyChangeSummary(sectionDiff);

      await tx.insert(cmsContentRevisions).values({
        contentBlockId: block.id,
        versionNumber,
        previousValue: beforeValue ?? null,
        newValue: afterValue ?? null,
        changeType: "update",
        status: "published",
        saveBatchId: null,
        changeSummary: friendlySummary.join(" | "),
        createdBy: actor,
        isProtected: false,
        publishedAt: now,
        createdAt: now,
        updatedAt: now,
      });
    }

    await tx
      .update(cmsPages)
      .set({
        title: input.title,
        contentJson: parsedNext,
        status: "published",
        publishedAt: now,
        updatedAt: now,
      })
      .where(eq(cmsPages.slug, input.slug));
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/portfolio");
  revalidatePath("/contact");

  return {
    changedFields,
    changeSummary: buildFriendlyChangeSummary(changedFields),
    contentJson: parsedNext,
    noChanges: false as const,
  };
}

export async function getContentHistory(slug: string, sectionKey?: CmsSectionKey) {
  const db = getDb();
  if (sectionKey) {
    const key = sectionKeyToBlockKey(slug, sectionKey);
    return db
      .select({
        revisionId: cmsContentRevisions.id,
        sectionKey: cmsContentBlocks.key,
        versionNumber: cmsContentRevisions.versionNumber,
        changeSummary: cmsContentRevisions.changeSummary,
        createdBy: cmsContentRevisions.createdBy,
        createdAt: cmsContentRevisions.createdAt,
        previousValue: cmsContentRevisions.previousValue,
        newValue: cmsContentRevisions.newValue,
      })
      .from(cmsContentRevisions)
      .innerJoin(cmsContentBlocks, eq(cmsContentBlocks.id, cmsContentRevisions.contentBlockId))
      .where(and(eq(cmsContentBlocks.key, key), eq(cmsContentRevisions.status, "published")))
      .orderBy(desc(cmsContentRevisions.versionNumber));
  }
  return db
    .select({
      revisionId: cmsContentRevisions.id,
      sectionKey: cmsContentBlocks.key,
      versionNumber: cmsContentRevisions.versionNumber,
      changeSummary: cmsContentRevisions.changeSummary,
      createdBy: cmsContentRevisions.createdBy,
      createdAt: cmsContentRevisions.createdAt,
      previousValue: cmsContentRevisions.previousValue,
      newValue: cmsContentRevisions.newValue,
    })
    .from(cmsContentRevisions)
    .innerJoin(cmsContentBlocks, eq(cmsContentBlocks.id, cmsContentRevisions.contentBlockId))
    .where(and(eq(cmsContentBlocks.page, slug), eq(cmsContentRevisions.status, "published")))
    .orderBy(desc(cmsContentRevisions.createdAt));
}

export async function restoreContentVersion(input: { slug: string; revisionId: string; actor?: string | null }) {
  const db = getDb();
  const now = new Date();
  const actor = input.actor ?? null;

  const [row] = await db
    .select({
      revision: cmsContentRevisions,
      block: cmsContentBlocks,
    })
    .from(cmsContentRevisions)
    .innerJoin(cmsContentBlocks, eq(cmsContentBlocks.id, cmsContentRevisions.contentBlockId))
    .where(eq(cmsContentRevisions.id, input.revisionId))
    .limit(1);

  if (!row) throw new Error("Revision not found.");
  const section = row.block.key.replace(`${input.slug}:`, "") as CmsSectionKey;
  const page = await getCmsPageBySlug(input.slug);
  const restoredContent = setValueAtPath(page.contentJson, section, row.revision.newValue);
  const parsedRestored = validateContentPayload(restoredContent);

  await db.transaction(async (tx) => {
    const versionNumber = await getNextVersionNumber(row.block.id, tx);
    await tx.insert(cmsContentRevisions).values({
      contentBlockId: row.block.id,
      versionNumber,
      previousValue: row.block.value ?? null,
      newValue: row.revision.newValue ?? null,
      changeType: "rollback",
      status: "published",
      changeSummary: `Restored from version ${row.revision.versionNumber}`,
      createdBy: actor,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
      isProtected: false,
    });
    await tx
      .update(cmsContentBlocks)
      .set({ value: row.revision.newValue, updatedBy: actor, updatedAt: now })
      .where(eq(cmsContentBlocks.id, row.block.id));
    await tx
      .update(cmsPages)
      .set({ contentJson: parsedRestored, updatedAt: now, publishedAt: now, status: "published" })
      .where(eq(cmsPages.slug, input.slug));
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/portfolio");
  revalidatePath("/contact");
}

export async function exportCMSBackup(slug: string) {
  const page = await getCmsPageBySlug(slug);
  const history = await getContentHistory(slug);
  return {
    exportedAt: new Date().toISOString(),
    page: {
      slug: page.slug,
      title: page.title,
      contentJson: page.contentJson,
      status: page.status,
      updatedAt: page.updatedAt,
    },
    revisions: history,
  };
}

export async function importCMSBackup(input: { slug: string; title: string; contentJson: unknown; actor?: string | null }) {
  return updateContentWithVersioning({
    slug: input.slug,
    title: input.title,
    nextContent: input.contentJson,
    actor: input.actor ?? null,
  });
}
