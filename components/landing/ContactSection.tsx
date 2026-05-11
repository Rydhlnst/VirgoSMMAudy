"use client";

import { Button } from "@/components/ui/button";
import type { LandingPageContent } from "@/lib/landing-content/types";
import Link from "next/link";
import { getSocialIcon } from "@/lib/social-icons";
import { EditableText } from "@/components/cms/EditableText";
import { EditableTextarea } from "@/components/cms/EditableTextarea";
import { useEditModeContext } from "@/components/cms/EditModeProvider";
import { Plus } from "lucide-react";

export function ContactSection({ contact }: { contact: LandingPageContent["contact"] }) {
  const context = useEditModeContext();
  const linksFromContext = context?.getFieldValue("contact.socialLinks");
  const socialLinks = Array.isArray(linksFromContext)
    ? (linksFromContext as LandingPageContent["contact"]["socialLinks"])
    : contact.socialLinks;

  const primaryEmailHref =
    contact.emailLink?.length && contact.emailLink !== "mailto:"
      ? contact.emailLink
      : contact.email?.length
        ? `mailto:${contact.email}`
        : "#";

  return (
    <section id="contact" className="py-16">
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-center">
        <div className="rounded-2xl bg-(--surface-inverse) p-8 text-(--surface-inverse-foreground) shadow-[0_35px_90px_rgba(0,0,0,0.25)] md:p-12">
          <EditableText
            as="h2"
            path="contact.title"
            value={contact.title}
            className="hero-name text-(--surface-inverse-foreground) text-4xl text-center flex flex-col justify-center items-center"
          />
          <EditableTextarea
            path="contact.description"
            value={contact.description}
            className="mt-3 text-center text-(--inverse-muted-foreground)"
            rows={3}
          />
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center justify-center">
            <Button asChild variant="accent" size="lg">
              <Link href="/contact">
                <EditableText path="contact.emailText" value={contact.emailText} />
              </Link>
            </Button>
            {contact.email ? (
              <a
                href={primaryEmailHref}
                className="text-sm font-semibold text-(--inverse-muted-foreground) transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:text-(--surface-inverse-foreground) motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
              >
                <EditableText as="span" path="contact.email" value={contact.email} />
              </a>
            ) : null}
          </div>
          {socialLinks.length || context?.isEditMode ? (
            <div className="mt-8 flex flex-wrap gap-2 items-center justify-center">
              {socialLinks.map((s, idx) => {
                const Icon = getSocialIcon(s.platform);
                return (
                  <Link
                    key={idx}
                    href={s.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-(--inverse-border-subtle) px-4 py-2 text-xs font-semibold text-(--inverse-muted-foreground) transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:text-(--surface-inverse-foreground) motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    <EditableText path={`contact.socialLinks.${idx}.platform`} value={s.platform} />
                  </Link>
                );
              })}

              {context?.isEditMode ? (
                <button
                  type="button"
                  onClick={() => {
                    context.updateField("contact.socialLinks", [
                      ...socialLinks,
                      { platform: "New", url: "" },
                    ]);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-dashed border-accent/60 px-4 py-2 text-xs font-semibold text-(--inverse-muted-foreground) transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:text-(--surface-inverse-foreground) motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Add social link"
                >
                  <Plus className="h-3.5 w-3.5 text-accent" aria-hidden />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.22em]">Add</span>
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
