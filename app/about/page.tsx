import { LandingShell } from "@/components/landing/LandingShell";
import { MarkdownContent } from "@/components/landing/MarkdownContent";
import { Skeleton } from "@/components/ui/skeleton";
import { readLandingPageContent } from "@/lib/landing-content/storage";
import Link from "next/link";

export const dynamic = "force-dynamic";

function AboutDivider() {
  return <div className="my-12 h-px w-full bg-foreground/10" />;
}

function Tag({ text }: { text: string }) {
  return (
    <div className="rounded-full border border-foreground/15 bg-background px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/80">
      {text}
    </div>
  );
}

export default async function AboutPage() {
  const content = await readLandingPageContent();
  const about = content.about;
  const intro = content.introduction;
  const steps = content.workProcess.steps;
  const page = content.pages.about;

  return (
    <LandingShell content={content}>
      <div className="mx-auto w-full max-w-7xl px-6 py-14">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="inline-flex rounded-full bg-[color:var(--accent)] px-4 py-1 text-xs font-black tracking-[0.22em] text-foreground">
              {page.badge}
            </div>
            <h1 className="hero-name mt-4 text-[64px] leading-[0.9] sm:text-[84px] md:text-[108px]">{about.title}</h1>
          </div>
          <div className="md:col-span-5">
            <div className="rounded-[36px] border border-foreground/10 bg-card p-6">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60">{intro.title}</div>
              <MarkdownContent content={intro.description} className="mt-4 text-sm text-foreground/75 sm:text-base" />
            </div>
          </div>
        </div>

        {content.hero.tags.length ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {content.hero.tags.slice(0, 10).map((t, idx) => (
              <Tag key={`${t}-${idx}`} text={t} />
            ))}
          </div>
        ) : null}

        <AboutDivider />

        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-5">
            <div className="sticky top-28 rounded-[44px] border border-foreground/10 bg-background p-6">
              <div className="text-xs font-black tracking-[0.22em] text-foreground/60">{page.profileLabel}</div>
              <div className="hero-name mt-3 text-3xl">{about.label}</div>
              <div className="mt-6 h-0.5 w-14 bg-foreground/20" />
              <div className="mt-6 grid gap-3">
                <div className="rounded-3xl bg-foreground p-5 text-background">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-background/70">{page.focusLabel}</div>
                  <div className="mt-2 text-sm text-background/85">{page.focusText}</div>
                </div>
                <div className="rounded-3xl border border-foreground/10 bg-card p-5">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60">{page.availabilityLabel}</div>
                  <div className="mt-2 text-sm text-foreground/75">{page.availabilityText}</div>
                  <Link
                    href="/contact"
                    className="mt-4 inline-flex w-fit rounded-full bg-[color:var(--accent)] px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:bg-[color:var(--accent)]/90 active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
                  >
                    {page.contactCtaText}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="rounded-[48px] border border-foreground/10 bg-card p-6 sm:p-8">
              <div className="text-xs font-black tracking-[0.22em] text-foreground/60">{page.storyLabel}</div>
              <MarkdownContent content={about.description} className="mt-4 text-base text-foreground/80 sm:text-lg" />
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {about.images.slice(0, 3).map((img, idx) => (
                  <div key={`${img.alt}-${idx}`} className="rounded-[28px] border border-foreground/10 bg-background p-3">
                    <Skeleton className="aspect-[4/3] w-full rounded-[22px]" />
                    <div className="mt-3 text-xs font-semibold text-foreground/60">{img.alt}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-[36px] border border-foreground/10 bg-background p-6">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60">{page.notesLabel}</div>
                <div className="mt-3 text-sm text-foreground/75">{page.notesText}</div>
              </div>
            </div>

            <div className="mt-10 rounded-[48px] border border-foreground/10 bg-background p-6 sm:p-8">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <div className="text-xs font-black tracking-[0.22em] text-foreground/60">{page.processLabel}</div>
                  <div className="hero-name mt-2 text-4xl sm:text-5xl">{page.processTitle}</div>
                </div>
                <Link
                  href="/services"
                  className="hidden rounded-full border border-foreground/10 bg-card px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground shadow-sm transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:bg-foreground hover:text-background active:translate-y-0 active:rotate-0 active:scale-[0.99] sm:inline-flex motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
                >
                  {page.servicesCtaText}
                </Link>
              </div>
              <div className="mt-8 grid gap-4">
                {steps.map((s) => (
                  <div key={s.number} className="grid gap-4 rounded-[36px] border border-foreground/10 bg-card p-6 sm:grid-cols-12 sm:items-start">
                    <div className="sm:col-span-3">
                      <div className="inline-flex rounded-full bg-foreground px-4 py-2 text-sm font-black tracking-tight text-background">
                        {s.number}
                      </div>
                      <Skeleton className="mt-4 h-20 w-20 rounded-[22px]" />
                    </div>
                    <div className="sm:col-span-9">
                      <div className="hero-name text-2xl">{s.title}</div>
                      {s.description ? <MarkdownContent content={s.description} className="mt-2 text-sm text-foreground/70" /> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingShell>
  );
}
