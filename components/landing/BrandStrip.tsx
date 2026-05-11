"use client";

import type { LandingPageContent } from "@/lib/landing-content/types";
import { EditableImage } from "@/components/cms/EditableImage";
import { EditableText } from "@/components/cms/EditableText";
import { useEditModeContext } from "@/components/cms/EditModeProvider";
import { Plus } from "lucide-react";

export function BrandStrip({ brandStrip }: { brandStrip: LandingPageContent["brandStrip"] }) {
  const context = useEditModeContext();
  const itemsFromContext = context?.getFieldValue("brandStrip.items");
  const items = Array.isArray(itemsFromContext)
    ? (itemsFromContext as LandingPageContent["brandStrip"]["items"])
    : brandStrip.items;

  if (!items.length && !context?.isEditMode) return null;
  return (
    <section className="bg-(--surface-inverse) text-(--surface-inverse-foreground)">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex gap-6 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden items-center justify-center">
          {items.map((item, idx) => {
            const Comp = item.link ? "a" : "div";
            return (
              <Comp
                key={idx}
                {...(item.link ? { href: item.link, target: "_blank", rel: "noreferrer" } : {})}
                className="flex shrink-0 items-center gap-3 rounded-full border border-(--inverse-border-subtle) bg-(--overlay-inverse-1) px-5 py-2 text-sm font-semibold tracking-wide text-(--inverse-muted-foreground)"
              >
                {item.imageUrl ? (
                  <EditableImage
                    path={`brandStrip.items.${idx}.imageUrl`}
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-6"
                    imgClassName="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-accent" />
                )}
                <EditableText path={`brandStrip.items.${idx}.name`} value={item.name} />
              </Comp>
            );
          })}

          {context?.isEditMode ? (
            <button
              type="button"
              onClick={() => {
                context.updateField("brandStrip.items", [
                  ...items,
                  { name: "New item", imageUrl: "", link: "" },
                ]);
              }}
              className="flex shrink-0 items-center gap-2 rounded-full border border-dashed border-accent/60 bg-(--overlay-inverse-1) px-5 py-2 text-sm font-semibold tracking-wide text-(--inverse-muted-foreground) hover:bg-(--overlay-inverse-2) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Add brand strip item"
            >
              <Plus className="h-4 w-4 text-accent" />
              <span className="text-xs font-extrabold uppercase tracking-[0.22em]">Add</span>
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
