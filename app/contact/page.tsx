import { LandingShell } from "@/components/landing/LandingShell";
import { Skeleton } from "@/components/ui/skeleton";
import { readLandingPageContent } from "@/lib/landing-content/storage";
import Link from "next/link";

export const dynamic = "force-dynamic";

function ContactDivider() {
  return <div className="my-12 h-px w-full bg-foreground/10" />;
}

function Chip({ text }: { text: string }) {
  return (
    <div className="rounded-full border border-foreground/15 bg-background px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/80">
      {text}
    </div>
  );
}

export default async function ContactPage() {
  const content = await readLandingPageContent();
  const c = content.contact;
  const page = content.pages.contact;

  return (
    <LandingShell content={content}>
      <div className="mx-auto w-full max-w-7xl px-6 py-14">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="inline-flex rounded-full bg-[color:var(--accent)] px-4 py-1 text-xs font-black tracking-[0.22em] text-foreground">
              {page.badge}
            </div>
            <h1 className="hero-name mt-4 text-[64px] leading-[0.9] sm:text-[84px] md:text-[108px]">{c.title}</h1>
            {c.description ? <p className="app-description mt-6 max-w-2xl text-base text-foreground/75 sm:text-lg">{c.description}</p> : null}
          </div>
          <div className="md:col-span-5">
            <div className="rounded-[44px] border border-foreground/10 bg-foreground p-6 text-background">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-background/70">{page.fastestLabel}</div>
              <div className="mt-3 text-sm text-background/85">{page.fastestText}</div>
              <Link
                href={c.whatsappLink || "#"}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-fit rounded-full bg-[color:var(--accent)] px-6 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:bg-[color:var(--accent)]/90 active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
              >
                {c.whatsappText}
              </Link>
            </div>
          </div>
        </div>

        <ContactDivider />

        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-12">
            <div className="rounded-[48px] border border-foreground/10 bg-card p-6 sm:p-8">
              <div className="text-xs font-black tracking-[0.22em] text-foreground/60">{page.contactOptionsLabel}</div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[36px] border border-foreground/10 bg-background p-6">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60">{page.emailLabel}</div>
                  <div className="mt-2 text-sm text-foreground/75">{c.email?.length ? c.email : "—"}</div>
                  <Link
                    href={c.email?.length ? `mailto:${c.email}` : "#"}
                    className="mt-4 inline-flex w-fit rounded-full border border-foreground/15 bg-card px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:bg-foreground hover:text-background active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
                  >
                    {page.emailCtaText}
                  </Link>
                </div>
                <div className="rounded-[36px] border border-foreground/10 bg-background p-6">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60">{page.socialLabel}</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {c.socialLinks.map((s, idx) => (
                      <Link
                        key={`${s.platform}-${idx}`}
                        href={s.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
                      >
                        <Chip text={s.platform} />
                      </Link>
                    ))}
                    {!c.socialLinks.length ? <div className="text-sm text-foreground/60">{page.noSocialText}</div> : null}
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-[36px] border border-foreground/10 bg-background p-6">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60">{page.requiredInfoLabel}</div>
                <div className="mt-4 grid gap-2 text-sm text-foreground/75">
                  {page.requiredInfoItems.map((text, idx) => (
                    <div key={`${text}-${idx}`} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[color:var(--accent)]" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* <div className="md:col-span-5">
            <div className="rounded-[48px] border border-foreground/10 bg-background p-6 sm:p-8">
              <div className="text-xs font-black tracking-[0.22em] text-foreground/60">{page.previewLabel}</div>
              <div className="mt-4 text-sm text-foreground/70">{page.previewText}</div>
              <div className="mt-6 grid gap-4">
                <Skeleton className="h-36 w-full rounded-[34px]" />
                <Skeleton className="h-20 w-full rounded-[34px]" />
                <Skeleton className="h-48 w-full rounded-[34px]" />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </LandingShell>
  );
}
