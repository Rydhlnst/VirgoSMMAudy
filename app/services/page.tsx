import { LandingShell } from "@/components/landing/LandingShell";
import { MarkdownContent } from "@/components/landing/MarkdownContent";
import { Skeleton } from "@/components/ui/skeleton";
import { readLandingPageContent } from "@/lib/landing-content/storage";
import Link from "next/link";

export const dynamic = "force-dynamic";

function ServicesDivider() {
  return <div className="my-12 h-px w-full bg-foreground/10" />;
}

function ServiceCard({
  href,
  title,
  description,
  pointsText,
  detailText,
}: {
  href: string;
  title: string;
  description?: string;
  pointsText: string;
  detailText: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[44px] border border-foreground/10 bg-card p-5 transition motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:shadow-md motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
    >
      <Skeleton className="aspect-[4/3] w-full rounded-[34px]" />
      <div className="mt-5">
        <div className="hero-name text-2xl">{title}</div>
        {description ? <MarkdownContent content={description} className="mt-2 text-sm text-foreground/70" /> : null}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60">
            {pointsText}
          </div>
          <div className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground">
            {detailText}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function ServicesPage() {
  const content = await readLandingPageContent();
  const details = content.servicesDetails;
  const page = content.pages.services;

  return (
    <LandingShell content={content}>
      <div className="mx-auto w-full max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="inline-flex rounded-full bg-[color:var(--accent)] px-4 py-1 text-xs font-black tracking-[0.22em] text-foreground">
              {page.badge}
            </div>
            <h1 className="hero-name mt-4 text-[64px] leading-[0.9] sm:text-[84px] md:text-[108px]">{details.name}</h1>
            {details.intro ? <MarkdownContent content={details.intro} className="mt-6 max-w-2xl text-base text-foreground/75 sm:text-lg" /> : null}
          </div>
          <div className="md:col-span-5">
            <div className="rounded-[52px] border border-foreground/10 bg-foreground p-6 text-background">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-background/70">{page.howToChooseLabel}</div>
              <div className="mt-3 text-sm text-background/85">{page.howToChooseText}</div>
              <Link
                href="/contact"
                className="mt-5 inline-flex w-fit rounded-full bg-[color:var(--accent)] px-6 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:bg-[color:var(--accent)]/90 active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
              >
                {page.checkAvailabilityCtaText}
              </Link>
            </div>
          </div>
        </div>

        <ServicesDivider />

        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="rounded-[44px] border border-foreground/10 bg-background p-6">
              <div className="text-xs font-black tracking-[0.22em] text-foreground/60">{page.coreServicesLabel}</div>
              <div className="hero-name mt-2 text-4xl">{page.coreServicesTitle}</div>
              <div className="mt-4 text-sm text-foreground/70">{page.coreServicesText}</div>
            </div>
          </div>
          <div className="md:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {details.categories.map((c) => (
                <ServiceCard
                  key={c.slug}
                  href={`/services/${c.slug}`}
                  title={c.title}
                  description={c.description}
                  pointsText={page.cardPointsText.replace("{count}", `${c.bullets.length}`)}
                  detailText={page.cardDetailText}
                />
              ))}
            </div>
          </div>
        </div>

        <ServicesDivider />

        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="rounded-[44px] border border-foreground/10 bg-background p-6">
              <div className="text-xs font-black tracking-[0.22em] text-foreground/60">{page.industriesLabel}</div>
              <div className="hero-name mt-2 text-4xl">{page.industriesTitle}</div>
              <div className="mt-4 text-sm text-foreground/70">{page.industriesText}</div>
            </div>
          </div>
          <div className="md:col-span-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {details.industries.map((c) => (
                <ServiceCard
                  key={c.slug}
                  href={`/services/${c.slug}`}
                  title={c.title}
                  description={c.description}
                  pointsText={page.cardPointsText.replace("{count}", `${c.bullets.length}`)}
                  detailText={page.cardDetailText}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </LandingShell>
  );
}
