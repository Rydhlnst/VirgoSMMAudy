import { Button } from "@/components/ui/button";
import type { LandingPageContent } from "@/lib/landing-content/types";
import { SectionHeading } from "./SectionHeading";
import Link from "next/link";

export function ContactSection({ contact }: { contact: LandingPageContent["contact"] }) {
  return (
    <section id="contact" className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-2xl bg-[color:var(--surface-inverse)] p-8 text-[color:var(--surface-inverse-foreground)] shadow-[0_35px_90px_rgba(0,0,0,0.25)] md:p-12">
          <SectionHeading
            title={contact.title}
            description={contact.description}
            className="text-[color:var(--surface-inverse-foreground)] text-4xl"
            tone="dark"
          />
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild variant="accent" size="lg">
              <Link href={contact.whatsappLink} target="_blank" rel="noreferrer">
                {contact.whatsappText}
              </Link>
            </Button>
            {contact.email ? (
              <Link
                href={`mailto:${contact.email}`}
                className="text-sm font-semibold text-[color:var(--inverse-muted-foreground)] transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:text-[color:var(--surface-inverse-foreground)] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
              >
                {contact.email}
              </Link>
            ) : null}
          </div>
          {contact.socialLinks.length ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {contact.socialLinks.map((s, idx) => (
                <Link
                  key={idx}
                  href={s.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[color:var(--inverse-border-subtle)] px-4 py-2 text-xs font-semibold text-[color:var(--inverse-muted-foreground)] transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:text-[color:var(--surface-inverse-foreground)] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
                >
                  {s.platform}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
