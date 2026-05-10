import { Divider } from "@/components/landing/Divider";
import { LandingShell } from "@/components/landing/LandingShell";
import { Skeleton } from "@/components/ui/skeleton";
import { readLandingPageContent } from "@/lib/landing-content/storage";
import Link from "next/link";

export const dynamic = "force-dynamic";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[28px] border border-foreground/10 bg-card p-5">
      <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60">{label}</div>
      <div className="hero-name mt-2 text-3xl">{value}</div>
    </div>
  );
}

export default async function PortfolioPage() {
  const content = await readLandingPageContent();
  const p = content.portfolio;
  const details = content.portfolioDetails.projects;
  const page = content.pages.portfolio;

  const videoCount = p.items.filter((i) => i.type === "video").length;
  const photoCount = p.items.filter((i) => i.type === "photo").length;

  return (
    <LandingShell content={content}>
      <div className="mx-auto w-full max-w-7xl px-6 py-14">
        <div className="gap-10 flex flex-col ">
          <div className="md:col-span-9">
            <div className="inline-flex rounded-full bg-accent px-4 py-1 text-xs font-black tracking-[0.22em] text-foreground">
              {page.badge}
            </div>
            <h1 className="hero-name mt-4 text-[64px] leading-[0.9] sm:text-[84px] md:text-[108px]">{p.title}</h1>
            <p className="app-description mt-6 max-w-2xl text-base text-foreground/75 sm:text-lg">
              {page.introText}
            </p>
          </div>
          <div className="md:max-w-2xl">
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label={page.statsProjectsLabel} value={`${p.items.length}`} />
              <Stat label={page.statsVideosLabel} value={`${videoCount}`} />
              <Stat label={page.statsPhotosLabel} value={`${photoCount}`} />
            </div>
          </div>
        </div>

        <Divider className="py-10" />

        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-12">
            <div className="rounded-[52px] border border-foreground/10 bg-background p-6 sm:p-8">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <div className="text-xs font-black tracking-[0.22em] text-foreground/60">{page.gridLabel}</div>
                  <div className="hero-name mt-2 text-4xl sm:text-5xl">{page.gridTitle}</div>
                </div>
                <Link
                  href="/contact"
                  className="hidden rounded-full border border-foreground/10 bg-card px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground shadow-sm transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:bg-foreground hover:text-background active:translate-y-0 active:rotate-0 active:scale-[0.99] sm:inline-flex motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
                >
                  {page.workTogetherCtaText}
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {p.items.map((item, idx) => (
                  <div
                    key={`${item.title}-${idx}`}
                    className="group rounded-[34px] border border-foreground/10 bg-card p-4 transition motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:shadow-md motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
                  >
                    <Skeleton className="aspect-[4/3] w-full rounded-[26px]" />
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60">
                          {item.type}
                        </div>
                        <div className="mt-2 text-sm font-black text-foreground">{item.title}</div>
                        {item.caption ? <div className="mt-2 text-sm text-foreground/65">{item.caption}</div> : null}
                      </div>
                      {item.link?.length ? (
                        <Link
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 rounded-full bg-[color:var(--accent)] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:bg-[color:var(--accent)]/90 active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
                        >
                          {page.openLinkText}
                        </Link>
                      ) : (
                        <div className="shrink-0 rounded-full border border-foreground/10 bg-background px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60">
                          {page.noLinkText}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Divider className="py-10" />

        <div className="rounded-[56px] border border-foreground/10 bg-background p-6 sm:p-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs font-black tracking-[0.22em] text-foreground/60">{page.detailLabel}</div>
              <div className="hero-name mt-2 text-5xl sm:text-6xl">{page.detailTitle}</div>
            </div>
            <div className="hidden text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60 sm:block">
              {page.cmsHintText}
            </div>
          </div>

          <div className="mt-10 grid gap-5">
            {details.map((d, idx) => (
              <div key={`${d.title}-${idx}`} className="rounded-[44px] border border-foreground/10 bg-card p-6 sm:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60">
                      {d.client?.length ? d.client : page.clientFallbackLabel}
                    </div>
                    <div className="hero-name mt-2 text-3xl sm:text-4xl">{d.title}</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="rounded-full border border-foreground/10 bg-background px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/70">
                      {page.briefPillText}
                    </div>
                    <div className="rounded-full bg-[color:var(--accent)] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground">
                      {page.resultPillText}
                    </div>
                  </div>
                </div>

                {d.brief?.length ? <p className="app-description mt-5 max-w-3xl text-sm text-foreground/75 sm:text-base">{d.brief}</p> : null}

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[36px] border border-foreground/10 bg-background p-6">
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60">{page.approachLabel}</div>
                    <div className="mt-4 grid gap-2 text-sm text-foreground/75">
                      {d.approach.length ? (
                        d.approach.map((a, j) => (
                          <div key={`${a}-${j}`} className="flex gap-3">
                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[color:var(--accent)]" />
                            <span>{a}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-foreground/60">—</div>
                      )}
                    </div>
                  </div>
                  <div className="rounded-[36px] border border-foreground/10 bg-background p-6">
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60">{page.deliverablesLabel}</div>
                    <div className="mt-4 grid gap-2 text-sm text-foreground/75">
                      {d.deliverables.length ? (
                        d.deliverables.map((a, j) => (
                          <div key={`${a}-${j}`} className="flex gap-3">
                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[color:var(--accent)]" />
                            <span>{a}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-foreground/60">—</div>
                      )}
                    </div>
                  </div>
                </div>

                {d.result?.length ? (
                  <div className="mt-6 rounded-[36px] border border-foreground/10 bg-foreground p-6 text-background">
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-background/70">{page.resultLabel}</div>
                    <div className="mt-3 text-sm text-background/85">{d.result}</div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </LandingShell>
  );
}
