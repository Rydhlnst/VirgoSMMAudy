import type { LandingPageContent } from "@/lib/landing-content/types";
import { Heart, MessageCircle } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { TypingBubbleClient } from "./TypingBubbleClient";
import { Skeleton } from "@/components/ui/skeleton";

export function TestimonialsSection({ testimonials }: { testimonials: LandingPageContent["testimonials"] }) {
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title={testimonials.title}
          description={testimonials.description || "Real results + real words from clients."}
          kicker="CLIENT FEEDBACK"
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonials.items.map((t, idx) => (
            <figure
              key={idx}
              className="group relative overflow-hidden rounded-[48px] bg-[color:var(--surface-inverse)] shadow-[var(--shadow-3)]"
            >
              <div className="relative h-[440px] w-full sm:h-[520px]">
                <Skeleton className="absolute inset-0 h-full w-full rounded-none bg-background/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--mask-strong)] via-[color:var(--mask-medium)] to-[color:var(--mask-weak)]" />

                <div className="pointer-events-none absolute left-5 top-5 inline-flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--overlay-inverse-1)] text-[color:var(--surface-inverse-foreground)] backdrop-blur">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--overlay-inverse-1)] text-[color:var(--surface-inverse-foreground)] backdrop-blur">
                    <Heart className="h-5 w-5" />
                  </span>
                </div>

                <div className="absolute right-5 top-5 hidden md:block">
                  <div className="origin-top-right scale-[0.78]">
                    <TypingBubbleClient text={t.name} />
                  </div>
                </div>

                <figcaption className="absolute inset-x-5 bottom-5">
                  <div className="rounded-[34px] bg-[color:var(--surface-inverse-80)] p-6 text-[color:var(--surface-inverse-foreground)] backdrop-blur">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[color:var(--inverse-border-subtle)] bg-white/10" />
                      <div className="min-w-0 flex-1">
                        <div className="text-2xl font-black tracking-tight">{t.name}</div>
                        {t.role ? (
                          <div className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--inverse-muted-foreground-weak)]">
                            {t.role}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {t.workTitle ? (
                      <div className="mt-4 text-sm font-extrabold uppercase tracking-[0.22em] text-[color:var(--inverse-muted-foreground)]">
                        {t.workTitle}
                      </div>
                    ) : null}
                    {t.description ? (
                      <div className="mt-2 text-sm leading-6 text-[color:var(--inverse-muted-foreground)]">
                        {t.description}
                      </div>
                    ) : null}

                    <blockquote className="mt-4 text-sm leading-6 text-[color:var(--inverse-muted-foreground)]">
                      “{t.quote}”
                    </blockquote>
                  </div>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
