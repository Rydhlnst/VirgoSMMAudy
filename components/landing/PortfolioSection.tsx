"use client";

import type { LandingPageContent } from "@/lib/landing-content/types";
import { Video, Image as ImageIcon, HeartIcon, ArrowUpRight } from "lucide-react";
import { EditableImage } from "@/components/cms/EditableImage";
import { EditableText } from "@/components/cms/EditableText";
import { Button } from "@/components/ui/button";
import { useEditModeContext } from "@/components/cms/EditModeProvider";

type PortfolioEntry = {
  item: LandingPageContent["portfolio"]["items"][number];
  index: number;
};

function IconBar({ type }: { type: "video" | "photo" }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[color:var(--surface-inverse)] text-[color:var(--surface-inverse-foreground)]">
        {type === "video" ? <Video className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
      </div>
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[color:var(--surface-inverse)] text-[color:var(--surface-inverse-foreground)]">
        <span className="text-xs font-black"><HeartIcon className="fill-background size-4" /></span>
      </div>
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-(--surface-inverse) text-[color:var(--surface-inverse-foreground)]">
        <span className="text-xs font-black"><ArrowUpRight className="size-4" /></span>
      </div>
    </div>
  );
}

function PortfolioGrid({ entries, onRemove }: { entries: PortfolioEntry[]; onRemove?: (index: number) => void }) {
  const context = useEditModeContext();
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      {entries.map(({ item, index }, idx) => {
        return (
          <div
            key={idx}
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
                <IconBar type={item.type} />
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
    </div>
  );
}

export function PortfolioSection({ portfolio }: { portfolio: LandingPageContent["portfolio"] }) {
  const context = useEditModeContext();
  const itemsFromContext = context?.getFieldValue("portfolio.items");
  const items = Array.isArray(itemsFromContext) ? (itemsFromContext as LandingPageContent["portfolio"]["items"]) : portfolio.items;

  const videofolio = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.type === "video");
  const photofolio = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.type === "photo");

  function addItem(type: "video" | "photo") {
    if (!context?.isEditMode) return;
    const current = items;
    context.updateField("portfolio.items", [
      ...current,
      {
        type,
        title: type === "video" ? "New video" : "New photo",
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
                <Button type="button" variant="accent" onClick={() => addItem("video")}>
                  Add video
                </Button>
              </div>
            ) : null}
            {videofolio.length ? (
              <PortfolioGrid entries={videofolio} onRemove={removeItem} />
            ) : (
              <EditableText
                as="div"
                path="portfolio.emptyVideoText"
                value={portfolio.emptyVideoText}
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
                <Button type="button" variant="accent" onClick={() => addItem("photo")}>
                  Add photo
                </Button>
              </div>
            ) : null}
            {photofolio.length ? (
              <PortfolioGrid entries={photofolio} onRemove={removeItem} />
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
