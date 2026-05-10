"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LandingPageContent } from "@/lib/landing-content/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

function formatIdr(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  if (/^(idr|rp)\b/i.test(trimmed)) return trimmed.replace(/\s+/g, " ");

  const digits = trimmed.replace(/[^\d]/g, "");
  if (!digits) return trimmed;

  try {
    const n = Number(digits);
    if (!Number.isFinite(n)) return `IDR ${digits}`;
    return `IDR ${new Intl.NumberFormat("id-ID").format(n)}`;
  } catch {
    return `IDR ${digits}`;
  }
}

export function ServicesCarouselClient({ items }: { items: LandingPageContent["services"]["items"] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  function prefersReducedMotion() {
    return (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function animateScrollLeft(el: HTMLElement, toLeft: number, durationMs = 420) {
    if (prefersReducedMotion()) {
      el.scrollLeft = toLeft;
      return;
    }

    const from = el.scrollLeft;
    const delta = toLeft - from;
    if (!Number.isFinite(delta) || Math.abs(delta) < 1) return;

    const start = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      el.scrollLeft = from + delta * easeOutCubic(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }

  function getScrollStepPx() {
    const el = scrollerRef.current;
    if (!el) return 320;
    return Math.max(320, Math.floor(el.clientWidth * 0.9));
  }

  function scrollBy(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const nextLeft = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, el.scrollLeft + direction * getScrollStepPx()));
    animateScrollLeft(el, nextLeft);
  }

  return (
    <div className="mt-12">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="text-xs font-extrabold uppercase tracking-[0.22em] text-[color:var(--inverse-muted-foreground-weaker)]">
          Swipe / Scroll
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-[color:var(--inverse-border-subtle)] bg-[color:var(--overlay-inverse-1)] text-[color:var(--surface-inverse-foreground)] hover:bg-[color:var(--overlay-inverse-2)]"
            onClick={() => scrollBy(-1)}
            aria-label="Previous services"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-[color:var(--inverse-border-subtle)] bg-[color:var(--overlay-inverse-1)] text-[color:var(--surface-inverse-foreground)] hover:bg-[color:var(--overlay-inverse-2)]"
            onClick={() => scrollBy(1)}
            aria-label="Next services"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Services carousel"
      >
        {items.map((svc, idx) => {
          const highlighted = Boolean(svc.isHighlighted);
          const price = formatIdr(svc.price);
          const headline = price || svc.title || "Custom";
          return (
            <div
              key={idx}
              className="w-full shrink-0 snap-start basis-[85%] sm:basis-[46%] md:basis-[44%] lg:basis-[32%]"
            >
              <div className="rounded-[44px] bg-[color:var(--card)] p-3 text-[color:var(--card-foreground)] shadow-[var(--shadow-4)]">
                <div className="relative overflow-hidden rounded-[36px]">
                  <Skeleton className="aspect-[4/3] w-full rounded-[36px]" />
                </div>

                <div
                  className={[
                    "mt-3 flex min-h-[440px] flex-col rounded-[34px] p-6",
                    highlighted ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]" : "bg-[color:var(--card)]",
                  ].join(" ")}
                >
                  <div className="text-center">
                    <div className="text-3xl font-black tracking-tight sm:text-4xl">{svc.title}</div>
                    {svc.hoursPerWeek ? (
                      <div className="mt-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[color:var(--muted-foreground-weak)]">
                        {svc.hoursPerWeek}
                      </div>
                    ) : null}
                    {/* <div className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[color:var(--muted-foreground-weak)]">
                      {svc.nae}
                    </div> */}
                  </div>

                  <div className="mt-5 flex flex-1 flex-col">
                    {svc.description ? (
                      <div className="text-sm leading-6 text-[color:var(--muted-foreground)]">{svc.description}</div>
                    ) : null}
                    {svc.includes?.length ? (
                      <ul className="mt-4 grid gap-2 text-left text-sm text-[color:var(--muted-foreground)]">
                        {svc.includes.slice(0, 6).map((b, bIdx) => (
                          <li key={bIdx} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--muted-foreground-weak)]" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {svc.idealFor ? (
                      <div className="mt-4 text-left text-sm">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[color:var(--muted-foreground-weak)]">
                          Ideal for
                        </span>
                        <div className="mt-1 text-[color:var(--muted-foreground)]">{svc.idealFor}</div>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-auto flex justify-center pt-6">
                    <Button
                      asChild
                      variant={highlighted ? "default" : "accent"}
                      className={
                        highlighted
                          ? "bg-[color:var(--surface-inverse)] text-[color:var(--surface-inverse-foreground)] hover:bg-[color:var(--overlay-5)]"
                          : ""
                      }
                    >
                      <Link href={svc.buttonLink}>{svc.buttonText}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
