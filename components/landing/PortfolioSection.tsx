"use client";

import type { LandingPageContent } from "@/lib/landing-content/types";
import { Image as ImageIcon, HeartIcon, ArrowUpRight } from "lucide-react";
import { EditableImage } from "@/components/cms/EditableImage";
import { EditableText } from "@/components/cms/EditableText";
import { Button } from "@/components/ui/button";
import { useEditModeContext } from "@/components/cms/EditModeProvider";
import { CmsAddItemCard } from "@/components/cms/CmsAddItemCard";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

type PortfolioEntry = {
  item: LandingPageContent["portfolio"]["items"][number];
  index: number;
};

function ImageLightbox({
  open,
  onOpenChange,
  src,
  alt,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  src: string;
  alt?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      onOpenChange(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[9998] grid place-items-center bg-black/60 p-4"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          onClick={() => onOpenChange(false)}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black/20 shadow-2xl backdrop-blur"
            initial={prefersReducedMotion ? { scale: 1 } : { scale: 0.98 }}
            animate={{ scale: 1 }}
            exit={prefersReducedMotion ? { scale: 1 } : { scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt || "Image"} className="h-auto max-h-[80dvh] w-full object-contain" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function IconBar({ imageSrc, imageAlt }: { imageSrc: string; imageAlt?: string }) {
  const [isZoomOpen, setIsZoomOpen] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();

  const canZoom = Boolean(imageSrc);

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <motion.button
          type="button"
          onClick={() => {
            if (!canZoom) return;
            setIsZoomOpen(true);
          }}
          whileHover={prefersReducedMotion ? undefined : canZoom ? { y: -1, rotate: -1 } : undefined}
          whileTap={prefersReducedMotion ? undefined : canZoom ? { scale: 0.98 } : undefined}
          className={[
            "inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[color:var(--surface-inverse)] text-[color:var(--surface-inverse-foreground)]",
            "transition motion-reduce:transition-none",
            canZoom ? "cursor-pointer" : "cursor-not-allowed opacity-40",
          ].join(" ")}
          aria-label={canZoom ? "Zoom image" : "No image"}
        >
          <ImageIcon className="h-4 w-4" />
        </motion.button>

        <motion.button
          type="button"
          onClick={() => setLiked((v) => !v)}
          whileHover={prefersReducedMotion ? undefined : { y: -1 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
          animate={
            prefersReducedMotion
              ? undefined
              : liked
                ? { scale: [1, 1.08, 1], rotate: [0, -6, 0] }
                : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 0.18 }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[color:var(--surface-inverse)] text-[color:var(--surface-inverse-foreground)] transition motion-reduce:transition-none"
          aria-pressed={liked}
          aria-label="Like"
        >
          <HeartIcon className={["size-4", liked ? "fill-[color:var(--surface-inverse-foreground)]" : ""].join(" ")} />
        </motion.button>

        <button
          type="button"
          className="inline-flex h-9 w-9 cursor-default items-center justify-center rounded-2xl bg-[color:var(--surface-inverse)] text-[color:var(--surface-inverse-foreground)]"
          aria-label="Arrow (coming soon)"
          disabled
        >
          <ArrowUpRight className="size-4 opacity-70" />
        </button>
      </div>

      <ImageLightbox open={isZoomOpen} onOpenChange={setIsZoomOpen} src={imageSrc} alt={imageAlt} />
    </>
  );
}

function PortfolioGrid({
  entries,
  onRemove,
  onAdd,
  addLabel,
}: {
  entries: PortfolioEntry[];
  onRemove?: (index: number) => void;
  onAdd?: () => void;
  addLabel?: string;
}) {
  const context = useEditModeContext();
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      {entries.map(({ item, index }) => {
        return (
          <div
            key={index}
            className="group flex min-h-[340px] flex-col rounded-[34px] border-none border-foreground bg-card p-3 shadow-sm transition motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:shadow-md motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
          >
            <div className="relative overflow-hidden rounded-2xl border border-foreground/10">
              <EditableImage
                path={`portfolio.items.${index}.thumbnailUrl`}
                src={item.thumbnailUrl}
                alt={item.title}
                imgClassName="aspect-[4/3] w-full rounded-2xl object-cover"
              />
            </div>
            <div className="flex min-h-[110px] flex-1 flex-col px-1 pb-2 pt-3">
              <EditableText
                as="div"
                path={`portfolio.items.${index}.title`}
                value={item.title}
                className="min-h-[44px] text-sm font-black text-foreground"
              />
              <div className="mt-auto pt-3">
                <IconBar
                  imageSrc={item.link?.length ? item.link : item.thumbnailUrl}
                  imageAlt={item.title}
                />
              </div>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex w-fit rounded-full bg-[color:var(--accent)] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
                >
                  Open
                </a>
              ) : null}

              {context?.isEditMode && onRemove ? (
                <div className="mt-3">
                  <Button type="button" variant="outline" onClick={() => onRemove(index)} className="w-full">
                    Remove
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}

      {context?.isEditMode && onAdd ? (
        <div className="group flex min-h-[340px] flex-col rounded-[34px] border-none border-foreground bg-card p-3 shadow-sm">
          <div className="flex flex-1 flex-col">
            <CmsAddItemCard
              label={addLabel || "Add item"}
              onClick={onAdd}
              className="h-full min-h-[340px] rounded-[28px]"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function PortfolioSection({ portfolio }: { portfolio: LandingPageContent["portfolio"] }) {
  const context = useEditModeContext();
  const itemsFromContext = context?.getFieldValue("portfolio.items");
  const items = Array.isArray(itemsFromContext) ? (itemsFromContext as LandingPageContent["portfolio"]["items"]) : portfolio.items;

  const hasSocialType = items.some((item) => item.type === "social");

  const socialEntries = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.type === "social" || (!hasSocialType && item.type === "photo" && item.slot === "top"));

  const photoEntries = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.type === "photo" && (hasSocialType ? true : item.slot !== "top"));

  function addSocial() {
    if (!context?.isEditMode) return;
    const current = items;
    context.updateField("portfolio.items", [
      ...current,
      {
        type: "social",
        slot: "top",
        title: "New social image",
        thumbnailUrl: "",
        link: "",
        caption: "",
      },
    ]);
  }

  function addPhoto() {
    if (!context?.isEditMode) return;
    const current = items;
    context.updateField("portfolio.items", [
      ...current,
      {
        type: "photo",
        slot: "bottom",
        title: "New photo",
        thumbnailUrl: "",
        link: "",
        caption: "",
      },
    ]);
  }

  function removeItem(index: number) {
    if (!context?.isEditMode) return;
    context.updateField(
      "portfolio.items",
      items.filter((_, i) => i !== index),
    );
  }

  return (
    <section id="portfolio" className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <EditableText
            as="h2"
            path="portfolio.title"
            value={portfolio.title}
            className="hero-name text-[64px] sm:text-[84px] md:text-[108px]"
          />
        </div>

        <div className="mt-10 overflow-hidden rounded-[40px] border-none border-foreground bg-background">
          <div className="px-6 py-8">
            <div className="text-center">
              <EditableText
                as="div"
                path="portfolio.videoLabel"
                value={portfolio.videoLabel}
                className="hero-name text-[44px] sm:text-[56px] md:text-[64px]"
              />
            </div>
            {context?.isEditMode ? (
              <div className="mt-4 flex justify-center">
                <div className="flex flex-wrap justify-center gap-2">
                  <Button type="button" variant="accent" onClick={addSocial}>
                    Add social image
                  </Button>
                </div>
              </div>
            ) : null}
            {socialEntries.length || context?.isEditMode ? (
              <PortfolioGrid
                entries={socialEntries}
                onRemove={removeItem}
                onAdd={addSocial}
                addLabel="Add social image"
              />
            ) : (
              <EditableText
                as="div"
                path="portfolio.emptySocialText"
                value={
                  "emptySocialText" in portfolio
                    ? (portfolio as LandingPageContent["portfolio"] & { emptySocialText?: string }).emptySocialText ||
                      "No social items yet."
                    : "No social items yet."
                }
                className="mt-4 text-sm text-foreground/60"
              />
            )}
          </div>

          <div className="h-px w-full bg-foreground/15" />

          <div className="px-6 py-8">
            <div className="text-center">
              <EditableText
                as="div"
                path="portfolio.photoLabel"
                value={portfolio.photoLabel}
                className="hero-name text-[44px] sm:text-[56px] md:text-[64px]"
              />
            </div>
            {context?.isEditMode ? (
              <div className="mt-4 flex justify-center">
                <div className="flex flex-wrap justify-center gap-2">
                  <Button type="button" variant="accent" onClick={addPhoto}>
                    Add photo
                  </Button>
                </div>
              </div>
            ) : null}
            {photoEntries.length || context?.isEditMode ? (
              <PortfolioGrid
                entries={photoEntries}
                onRemove={removeItem}
                onAdd={addPhoto}
                addLabel="Add photo"
              />
            ) : (
              <EditableText
                as="div"
                path="portfolio.emptyPhotoText"
                value={portfolio.emptyPhotoText}
                className="mt-4 text-sm text-foreground/60"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
