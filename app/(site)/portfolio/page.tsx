import { Divider } from "@/components/landing/Divider";
import { LandingShell } from "@/components/landing/LandingShell";
import { readLandingPageContent } from "@/lib/landing-content/storage";
import Link from "next/link";
import { EditableText } from "@/components/cms/EditableText";
import { PortfolioItemsGridClient } from "./_components/PortfolioItemsGridClient";

export const dynamic = "force-dynamic";

function Stat({ label, value, labelPath }: { label: string; value: string; labelPath: string }) {
  return (
    <div className="rounded-[28px] border border-foreground/10 bg-card p-5">
      <EditableText
        as="div"
        path={labelPath}
        value={label}
        className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60"
      />
      <div className="hero-name mt-2 text-3xl">{value}</div>
    </div>
  );
}

export default async function PortfolioPage() {
  const content = await readLandingPageContent();
  const p = content.portfolio;
  const page = content.pages.portfolio;

  const videoCount = p.items.filter((i) => i.type === "video").length;
  const photoCount = p.items.filter((i) => i.type === "photo").length;

  return (
    <LandingShell content={content}>
      <div className="mx-auto w-full max-w-7xl px-6 py-14">
        <div className="gap-10 flex flex-col ">
          <div className="md:col-span-9">
            <div className="inline-flex rounded-full bg-accent px-4 py-1 text-xs font-black tracking-[0.22em] text-foreground">
              <EditableText path="pages.portfolio.badge" value={page.badge} />
            </div>
            <EditableText
              path="portfolio.title"
              value={p.title}
              as="h1"
              className="hero-name mt-4 text-[64px] leading-[0.9] sm:text-[84px] md:text-[108px]"
            />
            <EditableText path="pages.portfolio.introText" value={page.introText} as="p" className="app-description mt-6 max-w-2xl text-base text-foreground/75 sm:text-lg" />
          </div>
          <div className="md:max-w-2xl">
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat labelPath="pages.portfolio.statsProjectsLabel" label={page.statsProjectsLabel} value={`${p.items.length}`} />
              <Stat labelPath="pages.portfolio.statsVideosLabel" label={page.statsVideosLabel} value={`${videoCount}`} />
              <Stat labelPath="pages.portfolio.statsPhotosLabel" label={page.statsPhotosLabel} value={`${photoCount}`} />
            </div>
          </div>
        </div>

        <Divider className="py-10" />

        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-12">
            <div className="rounded-[52px] border border-foreground/10 bg-background p-6 sm:p-8">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <EditableText
                    as="div"
                    path="pages.portfolio.gridLabel"
                    value={page.gridLabel}
                    className="text-xs font-black tracking-[0.22em] text-foreground/60"
                  />
                  <EditableText
                    as="div"
                    path="pages.portfolio.gridTitle"
                    value={page.gridTitle}
                    className="hero-name mt-2 text-4xl sm:text-5xl"
                  />
                </div>
                <Link
                  href="/contact"
                  className="hidden rounded-full border border-foreground/10 bg-card px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground shadow-sm transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:bg-foreground hover:text-background active:translate-y-0 active:rotate-0 active:scale-[0.99] sm:inline-flex motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
                >
                  <EditableText path="pages.portfolio.workTogetherCtaText" value={page.workTogetherCtaText} />
                </Link>
              </div>

              <PortfolioItemsGridClient initialItems={p.items} page={page} />
            </div>
          </div>
        </div>
      </div>
    </LandingShell>
  );
}
