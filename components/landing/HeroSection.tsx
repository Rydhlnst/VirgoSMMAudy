import { Button } from "@/components/ui/button";
import type { LandingPageContent } from "@/lib/landing-content/types";
import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { MarkdownContent } from "@/components/landing/MarkdownContent";

export function HeroSection({ hero }: { hero: LandingPageContent["hero"] }) {
  const tags = hero.tags.filter(Boolean);
  const primaryTags = tags.slice(0, 3);
  const extraTags = tags.slice(3);

  return (
    <section id="top" className="relative overflow-hidden bg-background">
      <div className="mx-auto grid max-w-7xl items-stretch gap-8 px-6 py-10 md:py-14 lg:grid-cols-12 lg:gap-10">
        <div className="order-2 lg:order-1 lg:col-span-7">
          <div className="flex h-full flex-col">
            <h1
              className="hero-name text-center text-[52px] sm:text-[80px] lg:text-left lg:text-[92px]"
              style={{ whiteSpace: "pre-line" }}
            >
              {hero.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 pb-4 pt-8 lg:justify-start">
              <div className="inline-flex rounded-full bg-accent px-5 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[color:var(--accent-foreground)]">
                {hero.badge}
              </div>
              {extraTags.length ? (
                <div className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[color:var(--muted-foreground-weak)]">
                  {extraTags.join("  •  ")}
                </div>
              ) : null}
            </div>

            {hero.description ? (
              <MarkdownContent
                content={hero.description}
                className="mt-6 max-w-xl text-center text-base text-[color:var(--muted-foreground)] sm:text-lg lg:text-left"
              />
            ) : null}

            <div className="mt-auto pt-10">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center justify-center gap-6 lg:justify-start">
                  {primaryTags.map((t) => (
                    <div
                      key={t}
                      className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[color:var(--muted-foreground-weaker)]"
                    >
                      {t}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <Button asChild variant="accent" size="lg" className="h-12 px-8">
                    <Link href={hero.ctaLink}>{hero.ctaText}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-5">
          <div className="relative aspect-4/3 rounded-4xl w-full shadow-(--shadow-1)">
            <button
              type="button"
              aria-label="Favorite"
              className="absolute right-4 top-4 z-10 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-(--surface-inverse) text-(--surface-inverse-foreground) shadow-sm transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:rotate-12 active:translate-y-0 active:rotate-0 active:scale-[0.99] lg:-right-6 lg:top-10 motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
            >
              <Heart className="size-10 fill-(--surface-inverse-foreground) text-(--surface-inverse-foreground)" />
            </button>

            <div className="relative overflow-hidden rounded-4xl">
              <Skeleton className="aspect-4/3 w-full h-full rounded-4xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
