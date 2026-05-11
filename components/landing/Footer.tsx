import type { LandingPageContent } from "@/lib/landing-content/types";
import Link from "next/link";
import { MarkdownContent } from "@/components/landing/MarkdownContent";

function renderYearTemplate(text: string, year: number) {
  return text.replaceAll("{year}", String(year));
}

export function Footer({ footer }: { footer: LandingPageContent["footer"] }) {
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
              {footer.brandName}
            </Link>
            {footer.description ? (
              <MarkdownContent
                content={footer.description}
                className="mt-4 max-w-md text-sm text-(--inverse-muted-foreground)"
                tone="dark"
              />
            ) : null}
          </div>

          <div className="md:col-span-7 md:flex md:justify-end md:gap-16">
            {footer.links.length ? (
              <div>
                <div className="text-xs font-black tracking-[0.18em] text-[color:var(--inverse-muted-foreground-weak)]">
                  LINKS
                </div>
                <nav className="mt-4 grid gap-2 text-sm font-semibold">
                  {footer.links.map((l, idx) => (
                    <Link
                      key={idx}
                      href={l.href}
                      className="text-[color:var(--inverse-muted-foreground)] transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:text-[color:var(--surface-inverse-foreground)] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ) : null}

            {footer.socialLinks.length ? (
              <div>
                <div className="text-xs font-black tracking-[0.18em] text-[color:var(--inverse-muted-foreground-weak)]">
                  SOCIAL
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {footer.socialLinks.map((s, idx) => (
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
