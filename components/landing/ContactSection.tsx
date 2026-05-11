import { Button } from "@/components/ui/button";
import type { LandingPageContent } from "@/lib/landing-content/types";
import Link from "next/link";
import { getSocialIcon } from "@/lib/social-icons";
import { EditableText } from "@/components/cms/EditableText";
import { EditableTextarea } from "@/components/cms/EditableTextarea";

export function ContactSection({ contact }: { contact: LandingPageContent["contact"] }) {
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
              <Link href={primaryEmailHref}>
                <EditableText path="contact.emailText" value={contact.emailText} />
              </Link>
            </Button>
            {contact.email ? (
              <EditableText
                as="a"
                path="contact.email"
                value={contact.email}
                className="text-sm font-semibold text-(--inverse-muted-foreground) transition-colors motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:text-(--surface-inverse-foreground) motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
              />
            ) : null}
          </div>
          {contact.socialLinks.length ? (
            <div className="mt-8 flex flex-wrap gap-2 items-center justify-center">
              {contact.socialLinks.map((s, idx) => {
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
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
