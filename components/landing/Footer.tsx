"use client";

import type { LandingPageContent } from "@/lib/landing-content/types";
import Link from "next/link";
import { getSocialIcon } from "@/lib/social-icons";
import { EditableText } from "@/components/cms/EditableText";
import { EditableTextarea } from "@/components/cms/EditableTextarea";
import { useEditModeContext } from "@/components/cms/EditModeProvider";
import { Plus } from "lucide-react";

function renderYearTemplate(text: string, year: number) {
  return text.replaceAll("{year}", String(year));
}

export function Footer({ footer }: { footer: LandingPageContent["footer"] }) {
  const context = useEditModeContext();
  const linksFromContext = context?.getFieldValue("footer.links");
  const socialFromContext = context?.getFieldValue("footer.socialLinks");

  const links = Array.isArray(linksFromContext)
    ? (linksFromContext as LandingPageContent["footer"]["links"])
    : footer.links;
  const socialLinks = Array.isArray(socialFromContext)
    ? (socialFromContext as LandingPageContent["footer"]["socialLinks"])
    : footer.socialLinks;

  const year = new Date().getFullYear();
  const copyright = renderYearTemplate(footer.copyrightText, year);

  return (
    <footer className="border-t border-[color:var(--inverse-border-subtle)] bg-[color:var(--surface-inverse)] text-[color:var(--surface-inverse-foreground)]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Link
              href="/"
              className="hero-name text-2xl transition-transform motion-reduce:transition-none hover:-rotate-1 md:text-3xl motion-reduce:hover:rotate-0"
            >
              <EditableText path="footer.brandName" value={footer.brandName} />
            </Link>
            {footer.description ? (
              <EditableTextarea
                path="footer.description"
                value={footer.description}
                className="mt-4 max-w-md text-sm text-(--inverse-muted-foreground)"
                rows={3}
              />
            ) : null}
          </div>

          <div className="md:col-span-7 md:flex md:justify-end md:gap-16">
            {links.length || context?.isEditMode ? (
              <div>
                <div className="text-xs font-black tracking-[0.18em] text-[color:var(--inverse-muted-foreground-weak)]">
                  LINKS
                </div>
                <nav className="mt-4 grid gap-2 text-sm font-semibold">
                  {links.map((l, idx) => (
                    <Link
                      key={idx}
                      href={l.href}
                      className="text-[color:var(--inverse-muted-foreground)] transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:text-[color:var(--surface-inverse-foreground)] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
                    >
                      <EditableText path={`footer.links.${idx}.label`} value={l.label} />
                    </Link>
                  ))}

                  {context?.isEditMode ? (
                    <button
                      type="button"
                      onClick={() => {
                        context.updateField("footer.links", [...links, { label: "New link", href: "/#" }]);
                      }}
                      className="inline-flex w-fit items-center gap-2 rounded-full border border-dashed border-accent/60 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[color:var(--inverse-muted-foreground)] hover:text-[color:var(--surface-inverse-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      aria-label="Add footer link"
                    >
                      <Plus className="h-3.5 w-3.5 text-accent" aria-hidden />
                      Add
                    </button>
                  ) : null}
                </nav>
              </div>
            ) : null}

            {socialLinks.length || context?.isEditMode ? (
              <div>
                <div className="text-xs font-black tracking-[0.18em] text-[color:var(--inverse-muted-foreground-weak)]">
                  SOCIAL
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {socialLinks.map((s, idx) => {
                    const Icon = getSocialIcon(s.platform);
                    return (
                      <Link
                        key={idx}
                        href={s.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--inverse-border-subtle)] px-4 py-2 text-xs font-semibold text-[color:var(--inverse-muted-foreground)] transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:text-[color:var(--surface-inverse-foreground)] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
                      >
                        <Icon className="h-3.5 w-3.5" aria-hidden />
                        <EditableText path={`footer.socialLinks.${idx}.platform`} value={s.platform} />
                      </Link>
                    );
                  })}

                  {context?.isEditMode ? (
                    <button
                      type="button"
                      onClick={() => {
                        context.updateField("footer.socialLinks", [...socialLinks, { platform: "New", url: "" }]);
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-dashed border-accent/60 px-4 py-2 text-xs font-semibold text-[color:var(--inverse-muted-foreground)] transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:text-[color:var(--surface-inverse-foreground)] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      aria-label="Add footer social link"
                    >
                      <Plus className="h-3.5 w-3.5 text-accent" aria-hidden />
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.22em]">Add</span>
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-10 text-xs font-semibold tracking-wide text-[color:var(--inverse-muted-foreground-weak)]">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
