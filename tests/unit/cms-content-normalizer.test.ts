import { DEFAULT_LANDING_PAGE_CONTENT } from "@/lib/landing-content/default-content";
import { landingPageContentSchema } from "@/lib/landing-content/schema";
import { describe, expect, it } from "vitest";
import { normalizeContentForImageAndMinItems } from "../fixtures/cms-normalizer";

const IMAGE_URL = "/uploads/cms/test-image.webp";

function collectByKey(value: unknown, key: string, result: unknown[] = []): unknown[] {
  if (Array.isArray(value)) {
    value.forEach((item) => collectByKey(item, key, result));
    return result;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k === key) result.push(v);
      collectByKey(v, key, result);
    }
  }
  return result;
}

describe("normalizeContentForImageAndMinItems", () => {
  it("OK AC-IMG-01 fills all image fields with single image url", () => {
    const input = structuredClone(DEFAULT_LANDING_PAGE_CONTENT);
    const normalized = normalizeContentForImageAndMinItems(input, IMAGE_URL);

    const keys = ["imageUrl", "thumbnailUrl", "heroImageUrl", "workImageUrl", "beforeImageUrl", "afterImageUrl", "icon"];
    for (const key of keys) {
      const values = collectByKey(normalized, key);
      for (const value of values) {
        expect(value).toBe(IMAGE_URL);
      }
    }
  });

  it("OK AC-ARR-01 converts empty repeaters into minimum one valid item", () => {
    const input = structuredClone(DEFAULT_LANDING_PAGE_CONTENT);
    input.testimonials.items = [];
    input.workProcess.steps = [];
    input.contact.socialLinks = [];

    const normalized = normalizeContentForImageAndMinItems(input, IMAGE_URL);
    expect(normalized.testimonials.items.length).toBeGreaterThanOrEqual(1);
    expect(normalized.workProcess.steps.length).toBeGreaterThanOrEqual(1);
    expect(normalized.contact.socialLinks.length).toBeGreaterThanOrEqual(1);

    const parsed = landingPageContentSchema.safeParse(normalized);
    expect(parsed.success).toBe(true);
  });

  it("BOUND AC-ARR-02 preserves existing items while only patching missing image values", () => {
    const input = structuredClone(DEFAULT_LANDING_PAGE_CONTENT);
    input.services.items = [
      {
        ...input.services.items[0],
        name: "Preserved Service",
        imageUrl: "",
      },
    ];
    const normalized = normalizeContentForImageAndMinItems(input, IMAGE_URL);
    expect(normalized.services.items).toHaveLength(1);
    expect(normalized.services.items[0]?.name).toBe("Preserved Service");
    expect(normalized.services.items[0]?.imageUrl).toBe(IMAGE_URL);
  });
});
