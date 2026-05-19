import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const cmsContentBlockStatusEnum = pgEnum("cms_content_block_status", ["published"]);
export const cmsContentRevisionStatusEnum = pgEnum("cms_content_revision_status", [
  "draft",
  "published",
  "archived",
]);
export const cmsContentChangeTypeEnum = pgEnum("cms_content_change_type", [
  "create",
  "update",
  "publish",
  "rollback",
]);

export const cmsContentBlocks = pgTable(
  "cms_content_blocks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: text("key").notNull().unique(),
    page: text("page").notNull(),
    type: text("type").notNull().default("text"),
    value: jsonb("value").notNull(),
    status: cmsContentBlockStatusEnum("status").notNull().default("published"),
    updatedBy: text("updated_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    pageIdx: index("cms_content_blocks_page_idx").on(table.page),
  }),
);

export const cmsContentRevisions = pgTable(
  "cms_content_revisions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    contentBlockId: uuid("content_block_id")
      .notNull()
      .references(() => cmsContentBlocks.id, { onDelete: "cascade" }),
    versionNumber: integer("version_number").notNull(),
    previousValue: jsonb("previous_value").notNull(),
    newValue: jsonb("new_value").notNull(),
    changeType: cmsContentChangeTypeEnum("change_type").notNull(),
    status: cmsContentRevisionStatusEnum("status").notNull().default("draft"),
    saveBatchId: uuid("save_batch_id"),
    changeSummary: text("change_summary"),
    createdBy: text("created_by"),
    isProtected: boolean("is_protected").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    blockVersionUnique: uniqueIndex("cms_content_revisions_block_version_unique").on(
      table.contentBlockId,
      table.versionNumber,
    ),
    blockVersionIdx: index("cms_content_revisions_block_version_idx").on(
      table.contentBlockId,
      table.versionNumber,
    ),
    blockStatusCreatedIdx: index("cms_content_revisions_block_status_created_idx").on(
      table.contentBlockId,
      table.status,
      table.createdAt,
    ),
    saveBatchIdx: index("cms_content_revisions_save_batch_idx").on(table.saveBatchId, table.createdAt),
    statusExpiresIdx: index("cms_content_revisions_status_expires_idx").on(table.status, table.expiresAt),
  }),
);

export type CmsContentBlockRow = typeof cmsContentBlocks.$inferSelect;
export type CmsContentRevisionRow = typeof cmsContentRevisions.$inferSelect;
