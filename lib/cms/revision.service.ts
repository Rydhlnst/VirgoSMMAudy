import { and, desc, eq, inArray, isNotNull, lt, ne, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { cmsContentBlocks, cmsContentRevisions, cmsPages } from "@/db/schema";
import { applyContentPathChanges, hasPath } from "@/lib/cms/content-audit";
import { getCmsPageBySlug } from "@/lib/cms/cms-service";
import type {
  ChangeType,
  ContentBlock,
  ContentRevision,
  RevisionSaveGroup,
  RevisionStatus,
  SaveBatchRevisionItem,
} from "./revision.types";

const REVISION_RETENTION_DAYS = 60;
const MIN_REVISIONS_PER_BLOCK = 10;

function isKnownDynamicCmsPath(path: string) {
  return path.startsWith("cmsMeta.images.");
}

function getBlockKey(slug: string, path: string) {
  return `${slug}:${path}`;
}

function getPathFromBlockKey(blockKey: string): string {
  const idx = blockKey.indexOf(":");
  if (idx < 0) return blockKey;
  return blockKey.slice(idx + 1);
}

function getValueByPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    if (Array.isArray(acc) && /^\d+$/.test(key)) return acc[Number(key)];
    if (typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, source);
}

function mapBlock(row: typeof cmsContentBlocks.$inferSelect): ContentBlock {
  return {
    id: row.id,
    key: row.key,
    page: row.page,
    type: row.type,
    value: row.value,
    status: row.status,
    updatedBy: row.updatedBy ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapRevision(row: typeof cmsContentRevisions.$inferSelect): ContentRevision {
  return {
    id: row.id,
    contentBlockId: row.contentBlockId,
    saveBatchId: row.saveBatchId ?? null,
    versionNumber: row.versionNumber,
    previousValue: row.previousValue,
    newValue: row.newValue,
    changeType: row.changeType,
    status: row.status,
    changeSummary: row.changeSummary ?? null,
    createdBy: row.createdBy ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    publishedAt: row.publishedAt ?? null,
    expiresAt: row.expiresAt ?? null,
    isProtected: row.isProtected,
  };
}

async function getNextVersionNumber(contentBlockId: string): Promise<number> {
  const db = getDb();
  const [row] = await db
    .select({
      maxVersion: sql<number>`coalesce(max(${cmsContentRevisions.versionNumber}), 0)`,
    })
    .from(cmsContentRevisions)
    .where(eq(cmsContentRevisions.contentBlockId, contentBlockId));
  return Number(row?.maxVersion ?? 0) + 1;
}

export async function getContentBlock(key: string): Promise<ContentBlock | null> {
  const db = getDb();
  const [row] = await db.select().from(cmsContentBlocks).where(eq(cmsContentBlocks.key, key)).limit(1);
  return row ? mapBlock(row) : null;
}

export async function updateContentBlock(
  key: string,
  newValue: unknown,
  options: {
    page: string;
    type?: string;
    createdBy?: string | null;
    status?: RevisionStatus;
    changeType?: ChangeType;
    changeSummary?: string | null;
    expiresAt?: Date | null;
    currentValue?: unknown;
    saveBatchId?: string | null;
  },
): Promise<{ block: ContentBlock; revision: ContentRevision }> {
  const db = getDb();
  const now = new Date();

  const [existing] = await db.select().from(cmsContentBlocks).where(eq(cmsContentBlocks.key, key)).limit(1);
  const previousValue = existing?.value ?? options.currentValue ?? null;

  const [block] = existing
    ? await db
        .update(cmsContentBlocks)
        .set({
          updatedAt: now,
          updatedBy: options.createdBy ?? null,
        })
        .where(eq(cmsContentBlocks.id, existing.id))
        .returning()
    : await db
        .insert(cmsContentBlocks)
        .values({
          key,
          page: options.page,
          type: options.type ?? "text",
          value: options.currentValue ?? newValue ?? "",
          status: "published",
          updatedBy: options.createdBy ?? null,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

  const versionNumber = await getNextVersionNumber(block.id);

  const [revision] = await db
    .insert(cmsContentRevisions)
    .values({
      contentBlockId: block.id,
      versionNumber,
      previousValue,
      newValue,
      changeType: options.changeType ?? (existing ? "update" : "create"),
      status: options.status ?? "draft",
      saveBatchId: options.saveBatchId ?? null,
      changeSummary: options.changeSummary ?? null,
      createdBy: options.createdBy ?? null,
      expiresAt: options.expiresAt ?? null,
      createdAt: now,
      updatedAt: now,
      publishedAt: options.status === "published" ? now : null,
    })
    .returning();

  return { block: mapBlock(block), revision: mapRevision(revision) };
}

export async function publishRevision(revisionId: string): Promise<{
  block: ContentBlock;
  revision: ContentRevision;
}> {
  const db = getDb();
  const now = new Date();
  const [revisionRow] = await db
    .select()
    .from(cmsContentRevisions)
    .where(eq(cmsContentRevisions.id, revisionId))
    .limit(1);

  if (!revisionRow) {
    throw new Error("Revision not found.");
  }

  const [blockRow] = await db
    .update(cmsContentBlocks)
    .set({ value: revisionRow.newValue, updatedAt: now })
    .where(eq(cmsContentBlocks.id, revisionRow.contentBlockId))
    .returning();

  await db
    .update(cmsContentRevisions)
    .set({ status: "archived", updatedAt: now })
    .where(
      and(
        eq(cmsContentRevisions.contentBlockId, revisionRow.contentBlockId),
        eq(cmsContentRevisions.status, "published"),
        ne(cmsContentRevisions.id, revisionRow.id),
      ),
    );

  const [updatedRevision] = await db
    .update(cmsContentRevisions)
    .set({
      status: "published",
      changeType: revisionRow.changeType === "rollback" ? "rollback" : "publish",
      publishedAt: now,
      updatedAt: now,
    })
    .where(eq(cmsContentRevisions.id, revisionRow.id))
    .returning();

  const [page] = await db.select().from(cmsPages).where(eq(cmsPages.slug, blockRow.page)).limit(1);
  if (page) {
    const path = getPathFromBlockKey(blockRow.key);
    if (hasPath(page.contentJson, path)) {
      const updatedContent = applyContentPathChanges(page.contentJson, [{ path, value: revisionRow.newValue }]);
      await db
        .update(cmsPages)
        .set({
          contentJson: updatedContent,
          status: "published",
          publishedAt: now,
          updatedAt: now,
        })
        .where(eq(cmsPages.id, page.id));
    }
  }

  return { block: mapBlock(blockRow), revision: mapRevision(updatedRevision) };
}

export async function rollbackRevision(
  revisionId: string,
  options?: { createdBy?: string | null; changeSummary?: string | null },
) {
  const db = getDb();
  const [target] = await db
    .select()
    .from(cmsContentRevisions)
    .where(eq(cmsContentRevisions.id, revisionId))
    .limit(1);
  if (!target) {
    throw new Error("Revision not found for rollback.");
  }

  const [block] = await db
    .select()
    .from(cmsContentBlocks)
    .where(eq(cmsContentBlocks.id, target.contentBlockId))
    .limit(1);
  if (!block) {
    throw new Error("Content block not found for rollback.");
  }

  const rollbackRevisionRecord = await updateContentBlock(block.key, target.newValue, {
    page: block.page,
    type: block.type,
    createdBy: options?.createdBy ?? null,
    status: "draft",
    changeType: "rollback",
    changeSummary: options?.changeSummary ?? `Rollback to revision v${target.versionNumber}`,
  });

  return publishRevision(rollbackRevisionRecord.revision.id);
}

export async function getRevisionHistory(
  contentBlockId: string,
  pagination?: { page?: number; limit?: number },
): Promise<{ items: ContentRevision[]; total: number; page: number; limit: number }> {
  const db = getDb();
  const page = Math.max(1, pagination?.page ?? 1);
  const limit = Math.min(100, Math.max(1, pagination?.limit ?? 20));
  const offset = (page - 1) * limit;

  const items = await db
    .select()
    .from(cmsContentRevisions)
    .where(eq(cmsContentRevisions.contentBlockId, contentBlockId))
    .orderBy(desc(cmsContentRevisions.versionNumber))
    .limit(limit)
    .offset(offset);

  const [count] = await db
    .select({ count: sql<number>`count(*)` })
    .from(cmsContentRevisions)
    .where(eq(cmsContentRevisions.contentBlockId, contentBlockId));

  return {
    items: items.map(mapRevision),
    total: Number(count?.count ?? 0),
    page,
    limit,
  };
}

export async function getRevisionHistoryByBlockKey(
  key: string,
  pagination?: { page?: number; limit?: number; status?: RevisionStatus },
) {
  const block = await getContentBlock(key);
  if (!block) {
    return { block: null, items: [], total: 0, page: pagination?.page ?? 1, limit: pagination?.limit ?? 20 };
  }

  const db = getDb();
  const page = Math.max(1, pagination?.page ?? 1);
  const limit = Math.min(100, Math.max(1, pagination?.limit ?? 20));
  const offset = (page - 1) * limit;
  const conditions = [eq(cmsContentRevisions.contentBlockId, block.id)];
  if (pagination?.status) {
    conditions.push(eq(cmsContentRevisions.status, pagination.status));
  }
  const whereClause = and(...conditions);

  const rows = await db
    .select()
    .from(cmsContentRevisions)
    .where(whereClause)
    .orderBy(desc(cmsContentRevisions.versionNumber))
    .limit(limit)
    .offset(offset);

  const [count] = await db
    .select({ count: sql<number>`count(*)` })
    .from(cmsContentRevisions)
    .where(whereClause);

  return {
    block,
    items: rows.map(mapRevision),
    total: Number(count?.count ?? 0),
    page,
    limit,
  };
}

export async function publishLatestDraftForPage(slug: string) {
  const db = getDb();
  const latestDrafts = await db
    .select({
      id: cmsContentRevisions.id,
      contentBlockId: cmsContentRevisions.contentBlockId,
      versionNumber: cmsContentRevisions.versionNumber,
    })
    .from(cmsContentRevisions)
    .innerJoin(cmsContentBlocks, eq(cmsContentBlocks.id, cmsContentRevisions.contentBlockId))
    .where(
      and(eq(cmsContentBlocks.page, slug), eq(cmsContentRevisions.status, "draft")),
    )
    .orderBy(desc(cmsContentRevisions.versionNumber));

  const newestByBlock = new Map<string, string>();
  for (const row of latestDrafts) {
    if (!newestByBlock.has(row.contentBlockId)) {
      newestByBlock.set(row.contentBlockId, row.id);
    }
  }

  const published: Array<{ block: ContentBlock; revision: ContentRevision }> = [];
  for (const revisionId of newestByBlock.values()) {
    published.push(await publishRevision(revisionId));
  }

  await getCmsPageBySlug(slug);
  return published;
}

export async function cleanupOldRevisions(options?: { now?: Date }) {
  const db = getDb();
  const now = options?.now ?? new Date();
  const retentionCutoff = new Date(now);
  retentionCutoff.setDate(retentionCutoff.getDate() - REVISION_RETENTION_DAYS);

  const allBlocks = await db.select({ id: cmsContentBlocks.id }).from(cmsContentBlocks);
  const protectedIds = new Set<string>();

  for (const block of allBlocks) {
    const keepRows = await db
      .select({ id: cmsContentRevisions.id })
      .from(cmsContentRevisions)
      .where(eq(cmsContentRevisions.contentBlockId, block.id))
      .orderBy(desc(cmsContentRevisions.versionNumber))
      .limit(MIN_REVISIONS_PER_BLOCK);
    for (const row of keepRows) {
      protectedIds.add(row.id);
    }
  }

  const candidateRows = await db
    .select({ id: cmsContentRevisions.id })
    .from(cmsContentRevisions)
    .where(
      and(
        eq(cmsContentRevisions.isProtected, false),
        or(
          and(
            inArray(cmsContentRevisions.status, ["published", "archived"]),
            lt(cmsContentRevisions.createdAt, retentionCutoff),
          ),
          and(eq(cmsContentRevisions.status, "draft"), isNotNull(cmsContentRevisions.expiresAt), lt(cmsContentRevisions.expiresAt, now)),
        ),
      ),
    );

  const deletableIds = candidateRows.map((row) => row.id).filter((id) => !protectedIds.has(id));
  if (deletableIds.length === 0) {
    return { deletedCount: 0 };
  }

  await db.delete(cmsContentRevisions).where(inArray(cmsContentRevisions.id, deletableIds));
  return { deletedCount: deletableIds.length };
}

export async function saveDraftRevisionsForChanges(input: {
  slug: string;
  changes: Array<{ path: string; value: unknown }>;
  createdBy?: string | null;
  changeSummary?: string | null;
}) {
  const page = await getCmsPageBySlug(input.slug);
  const created = [];
  const saveBatchId = crypto.randomUUID();

  for (const change of input.changes) {
    if (!hasPath(page.contentJson, change.path) && !isKnownDynamicCmsPath(change.path)) {
      throw new Error(`Path '${change.path}' tidak ditemukan pada content saat ini.`);
    }

    const key = getBlockKey(input.slug, change.path);
    const currentValue = hasPath(page.contentJson, change.path)
      ? getValueByPath(page.contentJson, change.path)
      : "";
    const saved = await updateContentBlock(key, change.value, {
      page: input.slug,
      type: "text",
      createdBy: input.createdBy ?? null,
      status: "draft",
      changeType: "update",
      changeSummary: input.changeSummary ?? null,
      expiresAt: null,
      currentValue,
      saveBatchId,
    });
    created.push(saved);
  }

  const pendingDraftCount = await countPendingDraftsByPage(input.slug);
  return { created, pendingDraftCount, saveBatchId };
}

export async function countPendingDraftsByPage(slug: string): Promise<number> {
  const db = getDb();
  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(cmsContentRevisions)
    .innerJoin(cmsContentBlocks, eq(cmsContentBlocks.id, cmsContentRevisions.contentBlockId))
    .where(and(eq(cmsContentBlocks.page, slug), eq(cmsContentRevisions.status, "draft")));
  return Number(row?.count ?? 0);
}

export async function listContentBlocksWithRevisionSummary(page?: string) {
  const db = getDb();
  const where = page ? eq(cmsContentBlocks.page, page) : undefined;
  const blocks = await db
    .select()
    .from(cmsContentBlocks)
    .where(where)
    .orderBy(desc(cmsContentBlocks.updatedAt));

  const results = [];
  for (const block of blocks) {
    const [counts] = await db
      .select({
        total: sql<number>`count(*)`,
        drafts: sql<number>`count(*) filter (where ${cmsContentRevisions.status} = 'draft')`,
        published: sql<number>`count(*) filter (where ${cmsContentRevisions.status} = 'published')`,
      })
      .from(cmsContentRevisions)
      .where(eq(cmsContentRevisions.contentBlockId, block.id));

    const [latest] = await db
      .select()
      .from(cmsContentRevisions)
      .where(eq(cmsContentRevisions.contentBlockId, block.id))
      .orderBy(desc(cmsContentRevisions.versionNumber))
      .limit(1);

    const [latestPublished] = await db
      .select()
      .from(cmsContentRevisions)
      .where(
        and(
          eq(cmsContentRevisions.contentBlockId, block.id),
          eq(cmsContentRevisions.status, "published"),
        ),
      )
      .orderBy(desc(cmsContentRevisions.versionNumber))
      .limit(1);

    results.push({
      block: mapBlock(block),
      summary: {
        totalRevisions: Number(counts?.total ?? 0),
        draftCount: Number(counts?.drafts ?? 0),
        publishedCount: Number(counts?.published ?? 0),
        latestRevision: latest ? mapRevision(latest) : null,
        latestPublishedRevision: latestPublished ? mapRevision(latestPublished) : null,
      },
    });
  }

  return results;
}

export async function listRevisionSavesByPage(
  page: string,
  status?: "draft" | "published" | "archived",
): Promise<RevisionSaveGroup[]> {
  const db = getDb();
  const conditions = [eq(cmsContentBlocks.page, page)];
  if (status) {
    conditions.push(eq(cmsContentRevisions.status, status));
  }
  const whereClause = and(...conditions);

  const rows = await db
    .select({
      blockKey: cmsContentBlocks.key,
      blockPage: cmsContentBlocks.page,
      revisionId: cmsContentRevisions.id,
      saveBatchId: cmsContentRevisions.saveBatchId,
      contentBlockId: cmsContentRevisions.contentBlockId,
      versionNumber: cmsContentRevisions.versionNumber,
      previousValue: cmsContentRevisions.previousValue,
      newValue: cmsContentRevisions.newValue,
      changeType: cmsContentRevisions.changeType,
      revisionStatus: cmsContentRevisions.status,
      changeSummary: cmsContentRevisions.changeSummary,
      createdBy: cmsContentRevisions.createdBy,
      createdAt: cmsContentRevisions.createdAt,
      updatedAt: cmsContentRevisions.updatedAt,
      publishedAt: cmsContentRevisions.publishedAt,
      expiresAt: cmsContentRevisions.expiresAt,
      isProtected: cmsContentRevisions.isProtected,
    })
    .from(cmsContentRevisions)
    .innerJoin(cmsContentBlocks, eq(cmsContentBlocks.id, cmsContentRevisions.contentBlockId))
    .where(whereClause)
    .orderBy(desc(cmsContentRevisions.createdAt), desc(cmsContentRevisions.versionNumber));

  const groups = new Map<string, RevisionSaveGroup>();
  for (const row of rows) {
    const saveId = row.saveBatchId ?? `legacy:${row.revisionId}`;
    const item: SaveBatchRevisionItem = {
      id: row.revisionId,
      contentBlockId: row.contentBlockId,
      saveBatchId: row.saveBatchId,
      versionNumber: row.versionNumber,
      previousValue: row.previousValue,
      newValue: row.newValue,
      changeType: row.changeType,
      status: row.revisionStatus,
      changeSummary: row.changeSummary ?? null,
      createdBy: row.createdBy ?? null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      publishedAt: row.publishedAt ?? null,
      expiresAt: row.expiresAt ?? null,
      isProtected: row.isProtected,
      blockKey: row.blockKey,
      blockPage: row.blockPage,
    };

    const existing = groups.get(saveId);
    if (!existing) {
      groups.set(saveId, {
        saveId,
        createdAt: row.createdAt,
        createdBy: row.createdBy ?? null,
        totalChanges: 1,
        draftCount: row.revisionStatus === "draft" ? 1 : 0,
        publishedCount: row.revisionStatus === "published" ? 1 : 0,
        archivedCount: row.revisionStatus === "archived" ? 1 : 0,
        items: [item],
      });
      continue;
    }

    existing.totalChanges += 1;
    if (row.revisionStatus === "draft") existing.draftCount += 1;
    if (row.revisionStatus === "published") existing.publishedCount += 1;
    if (row.revisionStatus === "archived") existing.archivedCount += 1;
    existing.items.push(item);
  }

  return [...groups.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
