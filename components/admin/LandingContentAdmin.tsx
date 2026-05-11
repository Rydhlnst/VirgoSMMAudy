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
  | { success: true; data: LandingPageContent }
  | {
      success: false;
      issues?: unknown;
      error?: {
        code: string;
        message: string;
        details?: unknown;
      };
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

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/landing-content", { cache: "no-store" });
        const json = (await res.json()) as ApiResponse;
        if (!cancelled && json.success) {
          form.reset(json.data);
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
      const res = await fetch("/api/admin/landing-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalized),
      });
      const json = (await res.json()) as ApiResponse;
      if (!json.success) {
        toast.error(json.error?.message || "Save failed");
        return;
      }
      crudToast.updated("Landing content");
      form.reset(json.data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
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
