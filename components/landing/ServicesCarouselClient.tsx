"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LandingPageContent } from "@/lib/landing-content/types";
import Link from "next/link";
import { EditableImage } from "@/components/cms/EditableImage";
import { EditableText } from "@/components/cms/EditableText";
import { EditableTextarea } from "@/components/cms/EditableTextarea";
import { useEditModeContext } from "@/components/cms/EditModeProvider";

export function ServicesCarouselClient({
  items,
  carouselHintText,
  idealForLabel,
}: {
  items: LandingPageContent["services"]["items"];
  carouselHintText: string;
  idealForLabel: string;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const context = useEditModeContext();

  const itemsFromContext = context?.getFieldValue("services.items");
  const renderItems = Array.isArray(itemsFromContext) ? (itemsFromContext as typeof items) : items;

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
          <EditableText path="services.carouselHintText" value={carouselHintText} />
        </div>
        <div className="flex items-center gap-2">
          {context?.isEditMode ? (
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-full border-[color:var(--inverse-border-subtle)] bg-[color:var(--overlay-inverse-1)] text-[color:var(--surface-inverse-foreground)] hover:bg-[color:var(--overlay-inverse-2)]"
              onClick={() => {
                const current = Array.isArray(itemsFromContext) ? (itemsFromContext as typeof items) : items;
                context.updateField("services.items", [
                  ...current,
                  {
                    title: "",
                    name: "New Service",
                    description: "",
                    price: "",
                    hoursPerWeek: "",
                    includes: [],
                    idealFor: "",
                    imageUrl: "",
                    buttonText: "Get Started",
                    buttonLink: "/contact",
                    isHighlighted: false,
                  },
                ]);
              }}
            >
              Add item
            </Button>
          ) : null}
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
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Services carousel"
      >
        {renderItems.map((svc, idx) => {
          const highlighted = Boolean(svc.isHighlighted);
          return (
            <div
              key={idx}
              className="w-full shrink-0 snap-start basis-[85%] sm:basis-[46%] md:basis-[44%] lg:basis-[32%]"
            >
              <div className="rounded-[44px] bg-[color:var(--card)] p-3 text-[color:var(--card-foreground)] shadow-[var(--shadow-4)]">
                <div className="relative overflow-hidden rounded-[36px]">
                  <EditableImage
                    path={`services.items.${idx}.imageUrl`}
                    src={svc.imageUrl}
                    alt={svc.title}
                    imgClassName="aspect-[4/3] w-full rounded-[36px] object-cover"
                  />
                </div>

                <div
                  className={[
                    "mt-3 flex min-h-[440px] flex-col rounded-[34px] p-6",
                    highlighted ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]" : "bg-[color:var(--card)]",
                  ].join(" ")}
                >
                  <div className="text-center">
                    <EditableText
                      as="div"
                      path={`services.items.${idx}.title`}
                      value={svc.title}
                      className="text-3xl font-black tracking-tight sm:text-4xl"
                    />
                    {svc.hoursPerWeek ? (
                      <EditableText
                        as="div"
                        path={`services.items.${idx}.hoursPerWeek`}
                        value={svc.hoursPerWeek}
                        className="mt-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[color:var(--muted-foreground-weak)]"
                      />
                    ) : null}
                  </div>

                  <div className="mt-5 flex flex-1 flex-col">
                    <EditableTextarea
                      path={`services.items.${idx}.description`}
                      value={svc.description}
                      rows={4}
                      className="text-sm text-[color:var(--muted-foreground)]"
                    />
                    {svc.includes?.length ? (
                      <ul className="mt-4 grid gap-2 text-left text-sm text-[color:var(--muted-foreground)]">
                        {svc.includes.slice(0, 6).map((b, bIdx) => (
                          <li key={bIdx} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--muted-foreground-weak)]" />
                            <EditableText path={`services.items.${idx}.includes.${bIdx}`} value={b} />
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {svc.idealFor ? (
                      <div className="mt-4 text-left text-sm">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[color:var(--muted-foreground-weak)]">
                          <EditableText path="services.idealForLabel" value={idealForLabel} />
                        </span>
                        <EditableText
                          as="div"
                          path={`services.items.${idx}.idealFor`}
                          value={svc.idealFor}
                          className="mt-1 text-[color:var(--muted-foreground)]"
                        />
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
                      <Link href={svc.buttonLink}>
                        <EditableText path={`services.items.${idx}.buttonText`} value={svc.buttonText} />
                      </Link>
                    </Button>
                  </div>

                  {context?.isEditMode ? (
                    <div className="mt-4 flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const current = Array.isArray(itemsFromContext) ? (itemsFromContext as typeof items) : items;
                          context.updateField(
                            "services.items",
                            current.filter((_, i) => i !== idx),
                          );
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

