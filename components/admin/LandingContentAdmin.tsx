"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { landingPageContentSchema } from "@/lib/landing-content/schema";
import type { LandingPageContent, LandingPageContentInput } from "@/lib/landing-content/types";
import { DEFAULT_LANDING_PAGE_CONTENT } from "@/lib/landing-content/default-content";

import { NavbarCMSForm } from "./sections/NavbarCMSForm";
import { HeroCMSForm } from "./sections/HeroCMSForm";
import { BrandStripCMSForm } from "./sections/BrandStripCMSForm";
import { IntroductionCMSForm } from "./sections/IntroductionCMSForm";
import { AboutCMSForm } from "./sections/AboutCMSForm";
import { PortfolioCMSForm } from "./sections/PortfolioCMSForm";
import { ServicesCMSForm } from "./sections/ServicesCMSForm";
import { ServicesDetailsCMSForm } from "./sections/ServicesDetailsCMSForm";
import { TestimonialsCMSForm } from "./sections/TestimonialsCMSForm";
import { BrandingCMSForm } from "./sections/BrandingCMSForm";
import { WorkProcessCMSForm } from "./sections/WorkProcessCMSForm";
import { ContactCMSForm } from "./sections/ContactCMSForm";
import { FooterCMSForm } from "./sections/FooterCMSForm";
import { useCrudToast } from "./useCrudToast";

type ApiResponse =
  | { success: true; data: LandingPageContent | { contentJson: LandingPageContent } }
  | {
      success: false;
      issues?: unknown;
      error?: {
        code: string;
        message: string;
        details?: unknown;
      };
    };

type RevisionItem = {
  id: string;
  versionNumber: number;
  status: "draft" | "published" | "archived";
  changeType: "create" | "update" | "publish" | "rollback";
  changeSummary: string | null;
  createdBy: string | null;
  createdAt: string;
  publishedAt: string | null;
  previousValue: unknown;
  newValue: unknown;
  blockKey?: string;
};

type RevisionSaveGroup = {
  saveId: string;
  createdAt: string;
  createdBy: string | null;
  totalChanges: number;
  draftCount: number;
  publishedCount: number;
  archivedCount: number;
  items: Array<RevisionItem & { blockKey: string; blockPage: string }>;
};

export function LandingContentAdmin() {
  const crudToast = useCrudToast();
  const form = useForm<LandingPageContentInput>({
    resolver: zodResolver(landingPageContentSchema),
    defaultValues: DEFAULT_LANDING_PAGE_CONTENT,
    mode: "onChange",
  });

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [saveGroups, setSaveGroups] = React.useState<RevisionSaveGroup[]>([]);
  const [selectedSaveId, setSelectedSaveId] = React.useState<string | null>(null);
  const [revisionFilter, setRevisionFilter] = React.useState<"draft" | "published" | "history">("draft");
  const [loadingRevisionSaves, setLoadingRevisionSaves] = React.useState(false);
  const [changeSummary, setChangeSummary] = React.useState("");
  const [selectedRevisionId, setSelectedRevisionId] = React.useState<string | null>(null);

  const selectedSaveGroup = React.useMemo(
    () => saveGroups.find((item) => item.saveId === selectedSaveId) ?? null,
    [saveGroups, selectedSaveId],
  );
  const revisions = selectedSaveGroup?.items ?? [];
  const selectedRevision = React.useMemo(
    () => revisions.find((item) => item.id === selectedRevisionId) ?? null,
    [revisions, selectedRevisionId],
  );

  const loadRevisionSaves = React.useCallback(async () => {
    setLoadingRevisionSaves(true);
    try {
      const statusParam =
        revisionFilter === "history" ? "history" : revisionFilter;
      const res = await fetch(`/api/admin/cms/revision-saves?page=home&status=${statusParam}`, { cache: "no-store" });
      const json = (await res.json()) as
        | { success: true; data: { items: RevisionSaveGroup[] } }
        | { success: false; error?: { message?: string } };
      if (!json.success) {
        toast.error(json.error?.message || "Failed to load revision saves");
        setSaveGroups([]);
        return;
      }
      setSaveGroups(json.data.items);
      if (!selectedSaveId && json.data.items.length > 0) {
        setSelectedSaveId(json.data.items[0].saveId);
      } else if (selectedSaveId && !json.data.items.some((item) => item.saveId === selectedSaveId)) {
        setSelectedSaveId(json.data.items[0]?.saveId ?? null);
      }
    } catch {
      toast.error("Failed to load revision saves");
      setSaveGroups([]);
    } finally {
      setLoadingRevisionSaves(false);
    }
  }, [revisionFilter, selectedSaveId]);

  React.useEffect(() => {
    void loadRevisionSaves();
  }, [loadRevisionSaves]);

  React.useEffect(() => {
    setSelectedRevisionId(revisions[0]?.id ?? null);
  }, [selectedSaveId, revisions]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/cms/pages/home", { cache: "no-store" });
        const json = (await res.json()) as ApiResponse;
        if (!cancelled && json.success) {
          const content = "contentJson" in json.data ? json.data.contentJson : json.data;
          form.reset(content);
        }
      } catch {
        toast.error("Failed to load content. Using default.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [form]);

  async function onSubmit(values: LandingPageContentInput) {
    setSaving(true);
    try {
      const normalized = landingPageContentSchema.parse(values);
      const res = await fetch("/api/admin/cms/pages/home", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Home",
          contentJson: normalized,
        }),
      });
      const json = (await res.json()) as ApiResponse;
      if (!json.success) {
        toast.error(json.error?.message || "Save failed");
        return;
      }
      crudToast.updated("Landing content");
      const content = "contentJson" in json.data ? json.data.contentJson : json.data;
      form.reset(content);
      void loadRevisionSaves();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function rollbackRevision(revisionId: string) {
    try {
      const res = await fetch(`/api/admin/cms/revisions/${revisionId}/rollback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changeSummary }),
      });
      const json = (await res.json()) as { success: boolean; error?: { message?: string } };
      if (!json.success) {
        toast.error(json.error?.message || "Rollback failed");
        return;
      }
      crudToast.updated("Rollback completed");
      setChangeSummary("");
      void loadRevisionSaves();
    } catch {
      toast.error("Rollback failed");
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6">
      <div className="rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--card)] p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-12">
            <div className="text-xs font-black tracking-[0.18em] text-[color:var(--muted-foreground-weak)]">ADMIN</div>
            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Landing Page CMS</h1>
            <p className="mt-2 max-w-3xl text-sm text-[color:var(--muted-foreground)]">
              Markdown-enabled description editor with Tiptap. Semua perubahan akan disimpan sebagai markdown.
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset(DEFAULT_LANDING_PAGE_CONTENT);
              crudToast.updated("Form state");
            }}
            disabled={saving}
          >
            Reset Form to Default
          </Button>
          <Button type="button" variant="accent" onClick={form.handleSubmit(onSubmit)} disabled={saving || loading}>
            {saving ? "Saving..." : "Save All"}
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="grid gap-4 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--background)]/40 p-3 sm:p-4 lg:grid-cols-[360px_1fr]">
          <section className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--card)] p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted-foreground-weak)]">Saved Revisions (Per Save)</div>
              <Button type="button" variant="outline" onClick={() => void loadRevisionSaves()}>
                Refresh
              </Button>
            </div>
            <div className="mt-3 grid max-h-[70vh] gap-2 overflow-y-auto pr-1">
              {loadingRevisionSaves ? <div className="text-sm text-[color:var(--muted-foreground)]">Loading saves...</div> : null}
              {saveGroups.map((item) => (
                <button
                  key={item.saveId}
                  type="button"
                  onClick={() => {
                    setSelectedSaveId(item.saveId);
                    setSelectedRevisionId(null);
                  }}
                  className={`rounded-lg border p-3 text-left transition ${
                    selectedSaveId === item.saveId
                      ? "border-[color:var(--foreground)] bg-[color:var(--background)]"
                      : "border-[color:var(--border-subtle)] bg-[color:var(--card)]"
                  }`}
                >
                  <div className="text-sm font-semibold">
                    Save {item.saveId.startsWith("legacy:") ? item.saveId : item.saveId.slice(0, 8)}
                  </div>
                  <div className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                    {new Date(item.createdAt).toLocaleString()} · {item.createdBy || "unknown"}
                  </div>
                  <div className="mt-2 text-xs text-[color:var(--muted-foreground)]">
                    Changes: {item.totalChanges} · Draft: {item.draftCount} · Published: {item.publishedCount}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--card)] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-[color:var(--muted-foreground-weak)]">Revision History & Preview</div>
              <Tabs value={revisionFilter} onValueChange={(value) => setRevisionFilter(value as typeof revisionFilter)}>
                <TabsList className="h-auto w-full justify-start gap-1 p-1">
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <textarea
              className="mt-3 min-h-20 w-full rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--card)] p-3 text-sm"
              value={changeSummary}
              onChange={(event) => setChangeSummary(event.target.value)}
              placeholder="Optional change summary for rollback..."
            />
            <div className="mt-3 grid gap-2">
              {loadingRevisionSaves ? <div className="text-sm text-[color:var(--muted-foreground)]">Loading revisions...</div> : null}
              {revisions.length === 0 && !loadingRevisionSaves ? (
                <div className="text-sm text-[color:var(--muted-foreground)]">No revisions found for this save session.</div>
              ) : null}
              {revisions.map((revision) => (
                <button
                  key={revision.id}
                  type="button"
                  onClick={() => setSelectedRevisionId(revision.id)}
                  className={`rounded-xl border p-3 text-left ${
                    selectedRevisionId === revision.id
                      ? "border-[color:var(--foreground)] bg-[color:var(--background)]"
                      : "border-[color:var(--border-subtle)] bg-[color:var(--card)]"
                  }`}
                >
                  <div className="text-sm font-semibold">
                    v{revision.versionNumber} · {revision.status} · {revision.changeType}
                  </div>
                  <div className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                    {new Date(revision.createdAt).toLocaleString()} · {revision.createdBy || "unknown"}
                  </div>
                  <div className="mt-1 text-xs text-[color:var(--muted-foreground)]">{revision.blockKey}</div>
                </button>
              ))}
            </div>
            {selectedRevision ? (
              <div className="mt-4 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--background)]/60 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold">Preview v{selectedRevision.versionNumber}</div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => void rollbackRevision(selectedRevision.id)}>
                      Rollback
                    </Button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-[color:var(--muted-foreground)]">
                  Created: {new Date(selectedRevision.createdAt).toLocaleString()}
                  {selectedRevision.publishedAt ? ` · Published: ${new Date(selectedRevision.publishedAt).toLocaleString()}` : ""}
                </div>
                {selectedRevision.changeSummary ? (
                  <div className="mt-2 text-xs text-[color:var(--muted-foreground)]">{selectedRevision.changeSummary}</div>
                ) : null}
                <div className="mt-3 grid gap-2 lg:grid-cols-2">
                  <div className="rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--card)] p-2">
                    <div className="text-xs font-semibold text-[color:var(--muted-foreground)]">Previous Value</div>
                    <pre className="mt-1 max-h-40 overflow-auto text-xs">{JSON.stringify(selectedRevision.previousValue, null, 2)}</pre>
                  </div>
                  <div className="rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--card)] p-2">
                    <div className="text-xs font-semibold text-[color:var(--muted-foreground)]">New Value</div>
                    <pre className="mt-1 max-h-40 overflow-auto text-xs">{JSON.stringify(selectedRevision.newValue, null, 2)}</pre>
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--card)] p-2 sm:p-4">
        <div>
          <FormProvider {...form}>
            <Tabs defaultValue="hero">
              <div className="sticky top-[68px] z-40 -mx-2 rounded-xl bg-[color:var(--card)]/95 px-2 py-2 backdrop-blur sm:-mx-4 sm:px-4">
                <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto p-1">
                  <TabsTrigger value="navbar">Navbar</TabsTrigger>
                  <TabsTrigger value="hero">Hero</TabsTrigger>
                  <TabsTrigger value="brandStrip">Brand Strip</TabsTrigger>
                  <TabsTrigger value="introduction">Introduction</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="servicesDetails">Services Details</TabsTrigger>
                  <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                  <TabsTrigger value="branding">Branding</TabsTrigger>
                  <TabsTrigger value="workProcess">Work Process</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="footer">Footer</TabsTrigger>
                </TabsList>
              </div>

              <div className="mt-4 grid gap-4">
                {loading ? <div className="text-sm text-[color:var(--muted-foreground-weak)]">Loading...</div> : null}

                <TabsContent value="navbar">
                  <NavbarCMSForm />
                </TabsContent>
                <TabsContent value="hero">
                  <HeroCMSForm />
                </TabsContent>
                <TabsContent value="brandStrip">
                  <BrandStripCMSForm />
                </TabsContent>
                <TabsContent value="introduction">
                  <IntroductionCMSForm />
                </TabsContent>
                <TabsContent value="about">
                  <AboutCMSForm />
                </TabsContent>
                <TabsContent value="portfolio">
                  <PortfolioCMSForm />
                </TabsContent>
                <TabsContent value="services">
                  <ServicesCMSForm />
                </TabsContent>
                <TabsContent value="servicesDetails">
                  <ServicesDetailsCMSForm />
                </TabsContent>
                <TabsContent value="testimonials">
                  <TestimonialsCMSForm />
                </TabsContent>
                <TabsContent value="branding">
                  <BrandingCMSForm />
                </TabsContent>
                <TabsContent value="workProcess">
                  <WorkProcessCMSForm />
                </TabsContent>
                <TabsContent value="contact">
                  <ContactCMSForm />
                </TabsContent>
                <TabsContent value="footer">
                  <FooterCMSForm />
                </TabsContent>
              </div>
            </Tabs>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
