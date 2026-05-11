import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { LandingPageContent } from "@/lib/landing-content/types";

export const landingPageContent = pgTable("landing_page_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  siteKey: text("site_key").notNull().unique(),
  navbar: jsonb("navbar").$type<LandingPageContent["navbar"]>().notNull(),
  hero: jsonb("hero").$type<LandingPageContent["hero"]>().notNull(),
  brandStrip: jsonb("brand_strip").$type<LandingPageContent["brandStrip"]>().notNull(),
  introduction: jsonb("introduction").$type<LandingPageContent["introduction"]>().notNull(),
  about: jsonb("about").$type<LandingPageContent["about"]>().notNull(),
  portfolio: jsonb("portfolio").$type<LandingPageContent["portfolio"]>().notNull(),
  // Legacy column kept for backwards DB compatibility.
  portfolioDetails: jsonb("portfolio_details").$type<{ projects: unknown[] }>().notNull(),
  services: jsonb("services").$type<LandingPageContent["services"]>().notNull(),
  servicesDetails: jsonb("services_details").$type<LandingPageContent["servicesDetails"]>().notNull(),
  testimonials: jsonb("testimonials").$type<LandingPageContent["testimonials"]>().notNull(),
  branding: jsonb("branding").$type<LandingPageContent["branding"]>().notNull(),
  workProcess: jsonb("work_process").$type<LandingPageContent["workProcess"]>().notNull(),
  contact: jsonb("contact").$type<LandingPageContent["contact"]>().notNull(),
  footer: jsonb("footer").$type<LandingPageContent["footer"]>().notNull(),
  pages: jsonb("pages").$type<LandingPageContent["pages"]>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type LandingPageContentRow = typeof landingPageContent.$inferSelect;
export type InsertLandingPageContentRow = typeof landingPageContent.$inferInsert;
