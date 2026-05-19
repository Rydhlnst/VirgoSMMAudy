import { DEFAULT_LANDING_PAGE_CONTENT } from "@/lib/landing-content/default-content";
import type { LandingPageContentInput } from "@/lib/landing-content/types";
import { KNOWN_IMAGE_KEYS } from "./image-fixture";

const ARRAY_ITEM_FALLBACKS: Record<string, unknown> = {
  "portfolio.items": { type: "photo", slot: "bottom", title: "Auto Photo", thumbnailUrl: "", link: "", caption: "" },
  "portfolioDetails.projects": {
    title: "Auto Project",
    client: "Auto Client",
    brief: "Auto brief",
    approach: ["Auto approach"],
    deliverables: ["Auto deliverable"],
    result: "Auto result",
  },
  "services.items": {
    title: "Auto Service",
    name: "Auto Service Name",
    description: "",
    price: "",
    hoursPerWeek: "",
    includes: ["Auto include"],
    idealFor: "",
    imageUrl: "",
    buttonText: "Book a Call",
    buttonLink: "/contact",
    isHighlighted: false,
  },
  "servicesDetails.categories": {
    slug: "auto-category",
    title: "Auto Category",
    description: "",
    heroImageUrl: "",
    bullets: ["Auto bullet"],
  },
  "servicesDetails.industries": {
    slug: "auto-industry",
    title: "Auto Industry",
    description: "",
    heroImageUrl: "",
    bullets: ["Auto bullet"],
  },
  "testimonials.items": {
    name: "Auto Name",
    role: "",
    quote: "Auto quote",
    workTitle: "",
    description: "",
    workImageUrl: "",
    imageUrl: "",
  },
  "workProcess.steps": { number: "01", title: "Auto Step", description: "", icon: "" },
  "about.workflowSteps": { title: "Auto Workflow", description: "" },
  "pages.about.meetTeamMembers": { name: "Auto Member", role: "Support Specialist", bio: "", imageUrl: "" },
  "pages.about.processSteps": { title: "Auto Process", description: "" },
  "pages.about.keyPoints": { title: "Auto Point", description: "" },
  "contact.socialLinks": { platform: "Instagram", url: "https://example.com" },
  "footer.socialLinks": { platform: "Instagram", url: "https://example.com" },
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function pathJoin(parent: string, key: string): string {
  return parent ? `${parent}.${key}` : key;
}

function normalizeNode(value: unknown, imageUrl: string, path: string): unknown {
  if (Array.isArray(value)) {
    const normalized = value.map((item) => normalizeNode(item, imageUrl, path));
    if (normalized.length > 0) return normalized;

    const fallback = ARRAY_ITEM_FALLBACKS[path];
    if (fallback !== undefined) return [normalizeNode(clone(fallback), imageUrl, pathJoin(path, "0"))];

    const template = path
      .split(".")
      .reduce<unknown>((acc, part) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[part] : undefined), DEFAULT_LANDING_PAGE_CONTENT);
    if (Array.isArray(template) && template.length > 0) {
      return [normalizeNode(clone(template[0]), imageUrl, pathJoin(path, "0"))];
    }
    return normalized;
  }

  if (value && typeof value === "object") {
    const next: Record<string, unknown> = {};
    for (const [key, raw] of Object.entries(value)) {
      if (KNOWN_IMAGE_KEYS.has(key)) {
        next[key] = imageUrl;
        continue;
      }
      next[key] = normalizeNode(raw, imageUrl, pathJoin(path, key));
    }
    return next;
  }

  return value;
}

export function normalizeContentForImageAndMinItems(
  content: LandingPageContentInput,
  imageUrl: string,
): LandingPageContentInput {
  return normalizeNode(clone(content), imageUrl, "") as LandingPageContentInput;
}
