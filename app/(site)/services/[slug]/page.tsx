import { readLandingPageContent } from "@/lib/landing-content/storage";
import { Badge } from "@/components/ui/badge";
import { LandingShell } from "@/components/landing/LandingShell";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EditableImage } from "@/components/cms/EditableImage";
import { EditableMarkdown } from "@/components/cms/EditableMarkdown";
import { EditableText } from "@/components/cms/EditableText";

export const dynamic = "force-dynamic";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await readLandingPageContent();
  const details = content.servicesDetails;
  const page = content.pages.services;

  const categoryIndex = details.categories.findIndex((c) => c.slug === slug);
  const industryIndex = details.industries.findIndex((c) => c.slug === slug);
  const item =
    categoryIndex >= 0 ? details.categories[categoryIndex] : industryIndex >= 0 ? details.industries[industryIndex] : undefined;
  if (!item) return notFound();

  const isCore = categoryIndex >= 0;
  const groupPath = isCore ? "pages.services.groupCoreLabel" : "pages.services.groupIndustryLabel";
  const group = isCore ? page.groupCoreLabel : page.groupIndustryLabel;
  const basePath = isCore ? `servicesDetails.categories.${categoryIndex}` : `servicesDetails.industries.${industryIndex}`;

  return (
    <LandingShell content={content}>
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Badge variant="accent">
                <EditableText path={groupPath} value={group.toUpperCase()} className="uppercase" />
              </Badge>
              <EditableText
                path="servicesDetails.name"
                value={details.name}
                className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60"
              />
            </div>
            <EditableText path={`${basePath}.title`} value={item.title} as="h1" className="hero-name mt-3 text-5xl sm:text-7xl" />
            {item.description ? (
              <EditableMarkdown path={`${basePath}.description`} value={item.description} className="mt-4 max-w-2xl text-base text-foreground/70" />
            ) : null}
          </div>
          <Link
            href="/services"
            className="w-fit rounded-full border-none border-foreground bg-card px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground shadow-sm transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:bg-foreground hover:text-background active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
          >
            <EditableText path="pages.services.detailBackText" value={page.detailBackText} />
          </Link>
        </div>

        <div className="my-10 h-px w-full bg-foreground/10" />

        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="rounded-[44px] border-none border-foreground bg-card p-4">
              <div className="relative overflow-hidden rounded-[34px]">
                <EditableImage
                  path={`${basePath}.heroImageUrl`}
                  src={item.heroImageUrl}
                  alt={item.title}
                  className="w-full"
                  imgClassName="aspect-[4/3] w-full rounded-[34px] object-cover"
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-6">
            <div className="rounded-[44px] border-none border-foreground bg-foreground p-8 text-background">
              <EditableText
                path="pages.services.detailIncludesLabel"
                value={page.detailIncludesLabel}
                className="text-xs font-black tracking-[0.22em] text-background/70"
              />
              <ul className="mt-5 grid gap-3">
                {item.bullets.map((b, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[color:var(--accent)]" />
                    <EditableText
                      path={`${basePath}.bullets.${idx}`}
                      value={b}
                      className="text-sm leading-6 text-background/85"
                    />
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-8 inline-flex w-fit rounded-full bg-[color:var(--accent)] px-6 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:bg-[color:var(--accent)]/90 active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
              >
                <EditableText path="pages.services.detailCtaText" value={page.detailCtaText} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LandingShell>
  );
}
