"use client";

import * as React from "react";
import Link from "next/link";
import type { LandingPageContent } from "@/lib/landing-content/types";
import { useEditModeContext } from "@/components/cms/EditModeProvider";
import { EditableImage } from "@/components/cms/EditableImage";
import { EditableVideo } from "@/components/cms/EditableVideo";
import { EditableText } from "@/components/cms/EditableText";
import { Button } from "@/components/ui/button";

type PortfolioItem = LandingPageContent["portfolio"]["items"][number];

export function PortfolioItemsGridClient({
  initialItems,
  page,
}: {
  initialItems: PortfolioItem[];
  page: LandingPageContent["pages"]["portfolio"];
}) {
  const context = useEditModeContext();

  const itemsFromContext = context?.getFieldValue("portfolio.items");
  const items = Array.isArray(itemsFromContext) ? (itemsFromContext as PortfolioItem[]) : initialItems;

  const reels = React.useMemo(
    () => items.map((item, idx) => ({ item, idx })).filter(({ item }) => item.type === "video"),
    [items],
  );

  function addReel() {
    if (!context?.isEditMode) return;
    context.updateField("portfolio.items", [
      ...items,
      {
        type: "video",
        slot: "bottom",
        title: "New reel",
        thumbnailUrl: "",
        link: "",
        caption: "",
      },
    ] satisfies PortfolioItem[]);
  }

  function removeItem(index: number) {
    if (!context?.isEditMode) return;
    context.updateField(
      "portfolio.items",
      items.filter((_, i) => i !== index),
    );
  }

  return (
    <div className="mt-8">
      {context?.isEditMode ? (
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="accent" onClick={addReel}>
            Add reel
          </Button>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {reels.map(({ item, idx }) => (
          <div
            key={`${item.title}-${idx}`}
            className="group rounded-[34px] border border-foreground/10 bg-card p-4 transition motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:shadow-md motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0"
          >
            <div className="grid gap-3">
              <EditableVideo
                path={`portfolio.items.${idx}.link`}
                src={item.link}
                posterSrc={item.thumbnailUrl}
                className="w-full"
                videoClassName="aspect-[9/16] w-full rounded-[26px] object-cover"
              />
              <EditableImage
                path={`portfolio.items.${idx}.thumbnailUrl`}
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-full"
                imgClassName="aspect-[4/3] w-full rounded-[26px] object-cover"
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <EditableText
                  as="div"
                  path={`portfolio.items.${idx}.title`}
                  value={item.title}
                  className="text-sm font-black text-foreground"
                />
                {item.caption ? (
                  <EditableText
                    as="div"
                    path={`portfolio.items.${idx}.caption`}
                    value={item.caption}
                    className="mt-2 text-sm text-foreground/65"
                  />
                ) : null}
              </div>

              {item.link?.length ? (
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-full bg-accent px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground transition-colors transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 hover:bg-[color:var(--accent)]/90 active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
                >
                  <EditableText path="pages.portfolio.openLinkText" value={page.openLinkText} />
                </Link>
              ) : (
                <div className="shrink-0 rounded-full border border-foreground/10 bg-background px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/60">
                  <EditableText path="pages.portfolio.noLinkText" value={page.noLinkText} />
                </div>
              )}
            </div>

            {context?.isEditMode ? (
              <div className="mt-3">
                <Button type="button" variant="outline" onClick={() => removeItem(idx)} className="w-full">
                  Remove
                </Button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
