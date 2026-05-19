"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { LandingPageContent } from "@/lib/landing-content/types";
import { EditModeProvider, useEditModeContext } from "@/components/cms/EditModeProvider";
import { CmsSaveBar } from "@/components/cms/CmsSaveBar";
import { CmsSectionWrapper } from "@/components/cms/CmsSectionWrapper";
import { EditableText } from "@/components/cms/EditableText";
import { EditableTextarea } from "@/components/cms/EditableTextarea";
import { HeroSection } from "@/components/landing/HeroSection";
import { Divider } from "@/components/landing/Divider";
import { BrandStrip } from "@/components/landing/BrandStrip";
import { AboutSection } from "@/components/landing/AboutSection";
import { PortfolioSection } from "@/components/landing/PortfolioSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { BrandingSection } from "@/components/landing/BrandingSection";
import { WorkProcessSection } from "@/components/landing/WorkProcessSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { LandingShell } from "@/components/landing/LandingShell";

type StringField = {
  path: string;
  value: string;
};

function collectStringFields(input: unknown, basePath: string): StringField[] {
  if (typeof input === "string") {
    return [{ path: basePath, value: input }];
  }

  if (Array.isArray(input)) {
    return input.flatMap((item, index) => collectStringFields(item, `${basePath}.${index}`));
  }

  if (typeof input === "object" && input !== null) {
    return Object.entries(input).flatMap(([key, value]) => collectStringFields(value, `${basePath}.${key}`));
  }

  return [];
}

function InlineEditorCanvas() {
  const context = useEditModeContext();
  if (!context) return null;

  const content = context.content as LandingPageContent;
  const pageFieldEntries = collectStringFields(content.pages, "pages");

  return (
    <>
      <CmsSaveBar />

      <div className="mx-auto w-full max-w-7xl px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--card)] p-4">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[color:var(--muted-foreground-weak)]">Inline CMS</div>
            <div className="mt-1 text-sm text-[color:var(--muted-foreground)]">Slug: {context.slug} · Save creates a new revision</div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/admin">Legacy Admin</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">View Public</Link>
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-4">
          <CmsSectionWrapper title="Navbar">
            <div className="grid gap-3 md:grid-cols-2">
              <EditableText path="navbar.brandName" value={content.navbar.brandName} className="text-lg font-black" />
              <EditableText path="navbar.ctaText" value={content.navbar.ctaText} className="text-lg font-black" />
              {content.navbar.menu.map((item, idx) => (
                <div key={`${item.label}-${idx}`} className="rounded-xl border border-[color:var(--border-subtle)] p-3">
                  <EditableText path={`navbar.menu.${idx}.label`} value={item.label} className="font-semibold" />
                  <EditableTextarea path={`navbar.menu.${idx}.href`} value={item.href} rows={2} className="mt-2 text-sm" />
                </div>
              ))}
            </div>
          </CmsSectionWrapper>

          <CmsSectionWrapper title="Other Public Pages (pages.*)">
            <div className="grid gap-3 md:grid-cols-2">
              {pageFieldEntries.map((entry) => (
                <div key={entry.path} className="rounded-xl border border-[color:var(--border-subtle)] p-3">
                  <div className="text-[11px] font-bold tracking-[0.18em] text-[color:var(--muted-foreground-weak)]">{entry.path}</div>
                  <EditableTextarea path={entry.path} value={entry.value} rows={2} className="mt-2 text-sm" />
                </div>
              ))}
            </div>
          </CmsSectionWrapper>
        </div>
      </div>

      <LandingShell content={{ navbar: content.navbar, footer: content.footer }}>
        <div>
          <HeroSection hero={content.hero} />
          <Divider className="py-6" />
          <BrandStrip brandStrip={content.brandStrip} />
          <Divider className="py-10" />
          <AboutSection about={content.about} />
          <Divider className="py-10" />
          <PortfolioSection portfolio={content.portfolio} />
          <ServicesSection services={content.services} />
          <TestimonialsSection testimonials={content.testimonials} />
          <BrandingSection branding={content.branding} />
          <WorkProcessSection workProcess={content.workProcess} />
          <ContactSection contact={content.contact} />
        </div>
      </LandingShell>
    </>
  );
}

export function CmsInlineEditor({
  slug,
  title,
  initialContent,
}: {
  slug: string;
  title: string;
  initialContent: LandingPageContent;
}) {
  return (
    <EditModeProvider slug={slug} initialTitle={title} initialContent={initialContent} isEditMode>
      <InlineEditorCanvas />
    </EditModeProvider>
  );
}
