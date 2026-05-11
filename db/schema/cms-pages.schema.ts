import { jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { LandingPageContent } from "@/lib/landing-content/types";

export const cmsPageStatusEnum = pgEnum("cms_page_status", ["draft", "published"]);

export const cmsPages = pgTable("cms_pages", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  contentJson: jsonb("content_json").$type<LandingPageContent>().notNull(),
  status: cmsPageStatusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type CmsPageRow = typeof cmsPages.$inferSelect;
export type InsertCmsPageRow = typeof cmsPages.$inferInsert;
