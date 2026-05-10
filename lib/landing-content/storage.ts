import { promises as fs } from "node:fs";
import path from "node:path";
import { landingPageContentSchema } from "./schema";
import { DEFAULT_LANDING_PAGE_CONTENT } from "./default-content";
import type { LandingPageContent } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "landing-page-content.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge<T>(base: T, patch: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(patch) ? patch : base) as T;
  }
  if (isPlainObject(base)) {
    if (!isPlainObject(patch)) return base;
    const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [key, patchValue] of Object.entries(patch)) {
      if (!(key in result)) {
        result[key] = patchValue;
        continue;
      }
      result[key] = deepMerge(result[key], patchValue);
    }
    return result as T;
  }
  return (patch ?? base) as T;
}

function normalizeLegacyAnchors(content: LandingPageContent): LandingPageContent {
  const anchorToRoute: Record<string, string> = {
    "#about": "/about",
    "#services": "/services",
    "#portfolio": "/portfolio",
    "#contact": "/contact",
    "/#contact": "/contact",
  };

  const normalizedNavbarMenu = content.navbar.menu.map((item) => ({
    ...item,
    href: anchorToRoute[item.href] ?? item.href,
  }));

  const normalizedFooterLinks = content.footer.links.map((item) => ({
    ...item,
    href: anchorToRoute[item.href] ?? item.href,
  }));

  const normalizedServiceItems = content.services.items.map((item) => ({
    ...item,
    buttonLink: anchorToRoute[item.buttonLink] ?? item.buttonLink,
  }));

  return {
    ...content,
    navbar: {
      ...content.navbar,
      menu: normalizedNavbarMenu,
      ctaLink: anchorToRoute[content.navbar.ctaLink] ?? content.navbar.ctaLink,
    },
    hero: {
      ...content.hero,
      ctaLink: anchorToRoute[content.hero.ctaLink] ?? content.hero.ctaLink,
    },
    services: {
      ...content.services,
      items: normalizedServiceItems,
    },
    footer: {
      ...content.footer,
      links: normalizedFooterLinks,
    },
  };
}

export async function readLandingPageContent(): Promise<LandingPageContent> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const json = JSON.parse(raw) as unknown;
    const parsed = landingPageContentSchema.safeParse(json);
    if (parsed.success) return normalizeLegacyAnchors(parsed.data);
    if (isPlainObject(json)) {
      const merged = deepMerge(DEFAULT_LANDING_PAGE_CONTENT, json);
      const repaired = landingPageContentSchema.safeParse(merged);
      if (repaired.success) return normalizeLegacyAnchors(repaired.data);
    }
    return normalizeLegacyAnchors(DEFAULT_LANDING_PAGE_CONTENT);
  } catch {
    return normalizeLegacyAnchors(DEFAULT_LANDING_PAGE_CONTENT);
  }
}

export async function writeLandingPageContent(payload: unknown): Promise<LandingPageContent> {
  const parsed = landingPageContentSchema.parse(payload);
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(parsed, null, 2), "utf8");
  return parsed;
}
