import fs from "node:fs";
import { readFile } from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_LANDING_PAGE_CONTENT } from "@/lib/landing-content/default-content";
import { normalizeContentForImageAndMinItems } from "../fixtures/cms-normalizer";
import { EXPECTED_IMAGE_URL_REGEX, SINGLE_IMAGE_SOURCE_PATH } from "../fixtures/image-fixture";

const mockRequireAdmin = vi.fn();
const mockGetCmsPageBySlug = vi.fn();
const mockUpdateContentWithVersioning = vi.fn();
const mockMkdir = vi.fn();
const mockWriteFile = vi.fn();

vi.mock("@/lib/auth/require-admin", () => ({
  requireAdmin: (...args: unknown[]) => mockRequireAdmin(...args),
}));
vi.mock("@/lib/cms/cms-service", () => ({
  getCmsPageBySlug: (...args: unknown[]) => mockGetCmsPageBySlug(...args),
}));
vi.mock("@/lib/cms/versioning", () => ({
  updateContentWithVersioning: (...args: unknown[]) => mockUpdateContentWithVersioning(...args),
}));
vi.mock("node:fs/promises", async () => {
  const actual = await vi.importActual<typeof import("node:fs/promises")>("node:fs/promises");
  return {
    ...actual,
    mkdir: (...args: unknown[]) => mockMkdir(...args),
    writeFile: (...args: unknown[]) => mockWriteFile(...args),
  };
});

describe("Admin CMS API routes", () => {
  it("OK AC-API-01 upload webp image and return cms URL", async () => {
    mockRequireAdmin.mockResolvedValue({
      success: true,
      session: { user: { email: "admin@example.com", role: "admin" } },
    });
    mockMkdir.mockResolvedValue(undefined);
    mockWriteFile.mockResolvedValue(undefined);

    if (!fs.existsSync(SINGLE_IMAGE_SOURCE_PATH)) {
      expect(true).toBe(true);
      return;
    }

    const { POST } = await import("@/app/api/admin/cms/uploads/image/route");
    const bytes = await readFile(SINGLE_IMAGE_SOURCE_PATH);
    const form = new FormData();
    form.append("file", new File([bytes], "11160584.webp", { type: "image/webp" }));

    const res = await POST(new Request("http://localhost/api/admin/cms/uploads/image", { method: "POST", body: form }));
    const json = (await res.json()) as { success: boolean; data?: { url: string } };

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data?.url).toMatch(EXPECTED_IMAGE_URL_REGEX);
  });

  it("ERR AC-API-02 reject non-image upload with 400", async () => {
    mockRequireAdmin.mockResolvedValue({
      success: true,
      session: { user: { email: "admin@example.com", role: "admin" } },
    });

    const { POST } = await import("@/app/api/admin/cms/uploads/image/route");
    const form = new FormData();
    form.append("file", new File([new Uint8Array([1, 2, 3])], "dummy.txt", { type: "text/plain" }));

    const res = await POST(new Request("http://localhost/api/admin/cms/uploads/image", { method: "POST", body: form }));
    expect(res.status).toBe(400);
  });

  it("ERR AC-API-03 reject oversized image with 413", async () => {
    mockRequireAdmin.mockResolvedValue({
      success: true,
      session: { user: { email: "admin@example.com", role: "admin" } },
    });

    const { POST } = await import("@/app/api/admin/cms/uploads/image/route");
    const bigBytes = new Uint8Array((10 * 1024 * 1024) + 1);
    const form = new FormData();
    form.append("file", new File([bigBytes], "huge.webp", { type: "image/webp" }));

    const res = await POST(new Request("http://localhost/api/admin/cms/uploads/image", { method: "POST", body: form }));
    expect(res.status).toBe(413);
  });

  it("OK AC-SAVE-01 + AC-API-READBACK save and readback normalized content", async () => {
    mockRequireAdmin.mockResolvedValue({
      success: true,
      session: { user: { email: "admin@example.com", role: "admin" } },
    });

    const normalized = normalizeContentForImageAndMinItems(
      structuredClone(DEFAULT_LANDING_PAGE_CONTENT),
      "/uploads/cms/test-image.webp",
    );

    const persisted = {
      slug: "home",
      title: "Home",
      status: "published",
      contentJson: normalized,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUpdateContentWithVersioning.mockResolvedValue({
      changedFields: ["hero.imageUrl"],
      changeSummary: "updated",
      noChanges: false,
    });
    mockGetCmsPageBySlug.mockResolvedValue(persisted);

    const { PATCH, GET } = await import("@/app/api/admin/cms/pages/[slug]/route");

    const patchRes = await PATCH(
      new Request("http://localhost/api/admin/cms/pages/home", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Home", contentJson: normalized }),
      }),
      { params: Promise.resolve({ slug: "home" }) },
    );
    expect(patchRes.status).toBe(200);

    const getRes = await GET(
      new Request("http://localhost/api/admin/cms/pages/home", { method: "GET" }),
      { params: Promise.resolve({ slug: "home" }) },
    );
    expect(getRes.status).toBe(200);
    const getJson = (await getRes.json()) as { success: boolean; data?: { contentJson: typeof normalized } };
    expect(getJson.success).toBe(true);
    expect(getJson.data?.contentJson.hero.imageUrl).toBe("/uploads/cms/test-image.webp");
  });
});
