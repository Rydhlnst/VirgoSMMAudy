import type { LandingPageContent } from "@/lib/landing-content/types";
import { Skeleton } from "@/components/ui/skeleton";

export function AboutSection({ about }: { about: LandingPageContent["about"] }) {
  return (
    <section id="about" className="py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10">
          <h2 className="hero-name text-[64px] sm:text-[84px] md:text-[108px]">{about.title}</h2>

          <div className="grid gap-8 md:grid-cols-12 md:items-start">
            <div className="md:col-span-5">
              <div className="inline-flex items-center gap-3">
                <div className="relative">
                  <div className="rounded-full border-none border-[color:var(--accent)] px-5 py-2 text-sm font-semibold italic text-foreground">
                    {about.label}
                  </div>
                  <div className="pointer-events-none absolute -inset-2 -rotate-6 rounded-full border-none border-[color:var(--accent)]/70" />
                  <div className="pointer-events-none absolute -inset-3 rotate-3 rounded-full border border-[color:var(--accent)]/40" />
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <p className="app-description max-w-2xl text-base text-foreground/70 sm:text-lg">{about.description}</p>
              <div className="mt-6 h-0.5 w-16 bg-foreground/25" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {about.images.slice(0, 3).map((img, idx) => {
              const rotate = idx === 0 ? "-rotate-6" : idx === 1 ? "rotate-2" : "rotate-8";
              return (
                <div
                  key={idx}
                  className={`overflow-hidden rounded-[28px] border-none border-foreground bg-background p-2 shadow-sm ${rotate}`}
                >
                  <div className="relative overflow-hidden rounded-[20px]">
                    <Skeleton className="aspect-[4/3] w-full rounded-[20px]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
