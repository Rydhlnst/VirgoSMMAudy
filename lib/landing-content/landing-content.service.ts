import { ApiRouteError } from "@/lib/api/errors";
import { DEFAULT_LANDING_PAGE_CONTENT } from "@/lib/landing-content/default-content";
import { mapLandingContentRowToContent } from "@/lib/landing-content/landing-content.mapper";
import {
  getLandingPageContent,
  upsertLandingPageContent,
  updateLandingPageSection,
} from "@/lib/landing-content/landing-content.repository";
import {
  landingContentSectionSchema,
  landingContentSectionSchemas,
  landingPageContentSchema,
  type LandingContentSection,
} from "@/lib/landing-content/landing-content.validation";
import type { LandingPageContent } from "@/lib/landing-content/types";

const DEFAULT_SITE_KEY = "default";

function normalizeLegacyAnchors(content: LandingPageContent): LandingPageContent {
  const anchorToRoute: Record<string, string> = {
    "#about": "/about",
    "#services": "/services",
    "#portfolio": "/portfolio",
    "#contact": "/contact",
    "/#contact": "/contact",
  };

  return {
    ...content,
    navbar: {
      ...content.navbar,
      menu: content.navbar.menu.map((item) => ({
        ...item,
        href: anchorToRoute[item.href] ?? item.href,
      })),
      ctaLink: anchorToRoute[content.navbar.ctaLink] ?? content.navbar.ctaLink,
    },
    hero: {
      ...content.hero,
      ctaLink: anchorToRoute[content.hero.ctaLink] ?? content.hero.ctaLink,
    },
    services: {
      ...content.services,
      items: content.services.items.map((item) => ({
        ...item,
        buttonLink: anchorToRoute[item.buttonLink] ?? item.buttonLink,
      })),
    },
    footer: {
      ...content.footer,
      links: content.footer.links.map((item) => ({
        ...item,
        href: anchorToRoute[item.href] ?? item.href,
      })),
    },
  };
}

export async function getPublicLandingContent(): Promise<LandingPageContent> {
  try {
    const row = await getLandingPageContent(DEFAULT_SITE_KEY);
    if (!row) {
      return normalizeLegacyAnchors(DEFAULT_LANDING_PAGE_CONTENT);
    }

    return normalizeLegacyAnchors(mapLandingContentRowToContent(row));
  } catch {
    return normalizeLegacyAnchors(DEFAULT_LANDING_PAGE_CONTENT);
  }
}

export async function upsertAdminLandingContent(input: unknown): Promise<LandingPageContent> {
  const content = landingPageContentSchema.parse(input);

  try {
    const row = await upsertLandingPageContent(DEFAULT_SITE_KEY, content);
    return mapLandingContentRowToContent(row);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database operation failed.";
    throw new ApiRouteError("DATABASE_ERROR", message, 500);
  }
}

export async function updateAdminLandingSection(section: string, input: unknown): Promise<LandingPageContent> {
  const parsedSection = landingContentSectionSchema.safeParse(section);
  if (!parsedSection.success) {
    throw new ApiRouteError("INVALID_SECTION", "Invalid landing content section.", 400, parsedSection.error.issues);
  }

  const sectionKey = parsedSection.data;
  const sectionSchema = landingContentSectionSchemas[sectionKey];
  const parsedSectionInput = sectionSchema.parse(input);

  try {
    const updatedRow = await updateLandingPageSection(DEFAULT_SITE_KEY, sectionKey, parsedSectionInput);
    if (!updatedRow) {
      const current = await getPublicLandingContent();
      const upserted = await upsertLandingPageContent(DEFAULT_SITE_KEY, {
        ...current,
        [sectionKey]: parsedSectionInput,
      } as LandingPageContent);
      return mapLandingContentRowToContent(upserted);
    }

    return mapLandingContentRowToContent(updatedRow);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database operation failed.";
    throw new ApiRouteError("DATABASE_ERROR", message, 500);
  }
}

export async function resetLandingContentToDefault(): Promise<LandingPageContent> {
  try {
    const row = await upsertLandingPageContent(DEFAULT_SITE_KEY, DEFAULT_LANDING_PAGE_CONTENT);
    return mapLandingContentRowToContent(row);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database operation failed.";
    throw new ApiRouteError("DATABASE_ERROR", message, 500);
  }
}

export function assertLandingSection(section: string): section is LandingContentSection {
  return landingContentSectionSchema.safeParse(section).success;
}
