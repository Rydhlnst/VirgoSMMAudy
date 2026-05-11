"use client";

import type { LandingPageContent } from "@/lib/landing-content/types";
import { Heart, MessageCircle } from "lucide-react";
import { TypingBubbleClient } from "./TypingBubbleClient";
import { EditableText } from "@/components/cms/EditableText";
import { EditableTextarea } from "@/components/cms/EditableTextarea";
import { TestimonialsWorkImageFrameClient } from "@/components/landing/TestimonialsWorkImageFrameClient";
import { useEditModeContext } from "@/components/cms/EditModeProvider";
import { CmsAddItemCard } from "@/components/cms/CmsAddItemCard";
import { Button } from "@/components/ui/button";

export function TestimonialsSection({ testimonials }: { testimonials: LandingPageContent["testimonials"] }) {
  const context = useEditModeContext();
  const itemsFromContext = context?.getFieldValue("testimonials.items");
  const items = Array.isArray(itemsFromContext)
    ? (itemsFromContext as LandingPageContent["testimonials"]["items"])
    : testimonials.items;

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-left">
          <EditableText
            as="div"
            path="testimonials.kicker"
            value={testimonials.kicker}
            className="mb-3 inline-flex rounded-full bg-accent px-4 py-1 text-xs font-black tracking-[0.22em] text-accent-foreground"
          />
          <EditableText as="h2" path="testimonials.title" value={testimonials.title} className="hero-name text-[52px] sm:text-[64px] md:text-[84px]" />
          <EditableTextarea
            path="testimonials.description"
            value={testimonials.description || testimonials.fallbackDescription}
            className="app-description mt-3 max-w-2xl text-base text-(--muted-foreground)"
            rows={3}
          />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {items.map((t, idx) => (
            <figure
              key={idx}
              className="group relative overflow-hidden rounded-[48px] bg-[color:var(--surface-inverse)] shadow-[var(--shadow-3)]"
            >
              <div className="relative h-[440px] w-full sm:h-[520px]">
                <TestimonialsWorkImageFrameClient
                  idx={idx}
                  src={t.workImageUrl}
                  alt={t.workTitle || t.name}
                  imgClassName="absolute inset-0 h-full w-full rounded-none object-cover"
                />
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
                        <EditableText
                          as="div"
                          path={`testimonials.items.${idx}.name`}
                          value={t.name}
                          className="text-2xl font-black tracking-tight"
                        />
                        {t.role ? (
                          <EditableText
                            as="div"
                            path={`testimonials.items.${idx}.role`}
                            value={t.role}
                            className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--inverse-muted-foreground-weak)]"
                          />
                        ) : null}
                      </div>
                    </div>

                    {t.workTitle ? (
                      <EditableText
                        as="div"
                        path={`testimonials.items.${idx}.workTitle`}
                        value={t.workTitle}
                        className="mt-4 text-sm font-extrabold uppercase tracking-[0.22em] text-[color:var(--inverse-muted-foreground)]"
                      />
                    ) : null}
                    {t.description ? (
                      <EditableTextarea
                        path={`testimonials.items.${idx}.description`}
                        value={t.description}
                        className="mt-2 text-sm text-[color:var(--inverse-muted-foreground)]"
                        rows={3}
                      />
                    ) : null}

                    <EditableTextarea
                      path={`testimonials.items.${idx}.quote`}
                      value={t.quote}
                      className="mt-4 text-sm leading-6 text-[color:var(--inverse-muted-foreground)]"
                      rows={3}
                    />

                    {context?.isEditMode ? (
                      <div className="mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-[color:var(--inverse-border-subtle)] bg-[color:var(--overlay-inverse-1)] text-[color:var(--surface-inverse-foreground)] hover:bg-[color:var(--overlay-inverse-2)]"
                          onClick={() => {
                            context.updateField(
                              "testimonials.items",
                              items.filter((_, i) => i !== idx),
                            );
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </figcaption>
              </div>
            </figure>
          ))}

          {context?.isEditMode ? (
            <figure className="group relative overflow-hidden rounded-[48px] bg-[color:var(--surface-inverse)] shadow-[var(--shadow-3)]">
              <div className="relative h-[440px] w-full sm:h-[520px]">
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--mask-strong)] via-[color:var(--mask-medium)] to-[color:var(--mask-weak)]" />
                <div className="absolute inset-0 p-6">
                  <CmsAddItemCard
                    label="Add testimonial"
                    onClick={() => {
                      context.updateField("testimonials.items", [
                        ...items,
                        {
                          name: "New client",
                          role: "",
                          quote: "New quote",
                          workTitle: "",
                          description: "",
                          workImageUrl: "",
                          imageUrl: "",
                        },
                      ]);
                    }}
                    className="h-full rounded-[34px] border-[color:var(--inverse-border-subtle)]/80 bg-[color:var(--surface-inverse-80)]"
                    iconClassName="bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
                    contentClassName="gap-4"
                  />
                </div>
              </div>
            </figure>
          ) : null}
        </div>
      </div>
    </section>
  );
}
