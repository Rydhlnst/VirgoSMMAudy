import type { LandingPageContent } from "@/lib/landing-content/types";
import { Video, Image as ImageIcon, HeartIcon, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function PortfolioSection({ portfolio }: { portfolio: LandingPageContent["portfolio"] }) {
  const videofolio = portfolio.items.filter((i) => i.type === "video");
  const photofolio = portfolio.items.filter((i) => i.type === "photo");

  function IconBar({ type }: { type: "video" | "photo" }) {
    return (
      <div className="flex items-center justify-center gap-2">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[color:var(--surface-inverse)] text-[color:var(--surface-inverse-foreground)]">
          {type === "video" ? <Video className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
        </div>
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[color:var(--surface-inverse)] text-[color:var(--surface-inverse-foreground)]">
          <span className="text-xs font-black"><HeartIcon className="fill-background size-4"/></span>
        </div>
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-(--surface-inverse) text-[color:var(--surface-inverse-foreground)]">
          <span className="text-xs font-black"><ArrowUpRight className="size-4"/></span>
        </div>
      </div>
    );
  }

  function Grid({ items }: { items: LandingPageContent["portfolio"]["items"] }) {
    return (
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {items.map((item, idx) => {
          const Comp = item.link ? "a" : "div";
          return (
            <Comp
              key={idx}
              {...(item.link ? { href: item.link, target: "_blank", rel: "noreferrer" } : {})}
              className="group flex min-h-[340px] flex-col rounded-[34px] border-none border-foreground bg-card p-3 shadow-sm transition motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:shadow-md motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
            >
              <div className="relative overflow-hidden rounded-2xl border border-foreground/10">
                <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
              </div>
              <div className="flex min-h-[110px] flex-1 flex-col px-1 pb-2 pt-3">
                <div className="min-h-[44px] text-sm font-black text-foreground">{item.title}</div>
                <div className="mt-auto pt-3">
                  <IconBar type={item.type} />
                </div>
              </div>
            </Comp>
          );
        })}
      </div>
    );
  }

  return (
    <section id="portfolio" className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="hero-name text-[64px] sm:text-[84px] md:text-[108px]" style={{ whiteSpace: "pre-line" }}>
            {portfolio.title}
          </h2>
        </div>

        <div className="mt-10 overflow-hidden rounded-[40px] border-none border-foreground bg-background">
          <div className="px-6 py-8">
            <div className="text-center">
              <div className="hero-name text-[44px] sm:text-[56px] md:text-[64px]">VIDEOFOLIO</div>
            </div>
            {videofolio.length ? (
              <Grid items={videofolio} />
            ) : (
              <div className="mt-4 text-sm text-foreground/60">No video items yet.</div>
            )}
          </div>

          <div className="h-px w-full bg-foreground/15" />

          <div className="px-6 py-8">
            <div className="text-center">
              <div className="hero-name text-[44px] sm:text-[56px] md:text-[64px]">PHOTOFOLIO</div>
            </div>
            {photofolio.length ? (
              // eslint-disable-next-line react-hooks/static-components
              <Grid items={photofolio} />
            ) : (
              <div className="mt-4 text-sm text-foreground/60">No photo items yet.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
