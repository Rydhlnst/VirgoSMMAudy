import { readLandingPageContent } from "@/lib/landing-content/storage";
import { Badge } from "@/components/ui/badge";
import { LandingShell } from "@/components/landing/LandingShell";
import { MarkdownContent } from "@/components/landing/MarkdownContent";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await readLandingPageContent();
  const details = content.servicesDetails;
  const page = content.pages.services;

  const item =
    details.categories.find((c) => c.slug === slug) ?? details.industries.find((c) => c.slug === slug);
  if (!item) return notFound();

  const group = details.categories.some((c) => c.slug === slug) ? page.groupCoreLabel : page.groupIndustryLabel;

  return (
    <LandingShell content={content}>
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Badge variant="accent">{group.toUpperCase()}</Badge>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60">{details.name}</div>
            </div>
            <h1 className="hero-name mt-3 text-5xl sm:text-7xl">{item.title}</h1>
            {item.description ? <MarkdownContent content={item.description} className="mt-4 max-w-2xl text-base text-foreground/70" /> : null}
          </div>
          <Link
            href="/services"
            className="w-fit rounded-full border-none border-foreground bg-card px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground shadow-sm transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:bg-foreground hover:text-background active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
          >
            {page.detailBackText}
          </Link>
        </div>

        <div className="my-10 h-px w-full bg-foreground/10" />

        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="rounded-[44px] border-none border-foreground bg-card p-4">
              <div className="relative overflow-hidden rounded-[34px]">
                <Skeleton className="aspect-[4/3] w-full rounded-[34px]" />
              </div>
              <div className="mt-4 rounded-[28px] border border-foreground/10 bg-background p-4">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60">{page.detailMediaLabel}</div>
                <div className="mt-2 text-sm text-foreground/70">{page.detailMediaText}</div>
              </div>
            </div>
          </div>
          <div className="md:col-span-6">
            <div className="rounded-[44px] border-none border-foreground bg-foreground p-8 text-background">
              <div className="text-xs font-black tracking-[0.22em] text-background/70">{page.detailIncludesLabel}</div>
              <ul className="mt-5 grid gap-3">
                {item.bullets.map((b, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[color:var(--accent)]" />
                    <span className="text-sm leading-6 text-background/85">{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-8 inline-flex w-fit rounded-full bg-[color:var(--accent)] px-6 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:bg-[color:var(--accent)]/90 active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
              >
                {page.detailCtaText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LandingShell>
  );
}
