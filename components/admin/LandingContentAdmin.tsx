"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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

type ApiResponse =
  | { success: true; data: LandingPageContent }
  | { success: false; error: string; issues?: unknown };

export function LandingContentAdmin() {
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
        const res = await fetch("/api/landing-page", { cache: "no-store" });
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
      const res = await fetch("/api/landing-page", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
      const json = (await res.json()) as ApiResponse;
      if (!json.success) {
        toast.error(json.error || "Save failed");
        return;
      }
      toast.success("Saved");
      form.reset(json.data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-black tracking-[0.18em] text-[color:var(--muted-foreground-weak)]">ADMIN</div>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Landing Page CMS</h1>
          <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted-foreground)]">
            Phase 1: edit text and image URLs. No complex roles or media library yet.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset(DEFAULT_LANDING_PAGE_CONTENT)}
            disabled={saving}
          >
            Reset to Default
          </Button>
          <Button type="button" variant="accent" onClick={form.handleSubmit(onSubmit)} disabled={saving || loading}>
            {saving ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <FormProvider {...form}>
          <Tabs defaultValue="hero">
            <div className="sticky top-[72px] z-40 -mx-6 bg-[color:var(--background)] px-6 py-4 backdrop-blur">
              <TabsList className="w-full justify-start overflow-x-auto">
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

            <div className="mt-6 grid gap-6">
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
  );
}
