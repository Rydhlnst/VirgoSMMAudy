"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function CmsAddItemCard({
  label = "Add",
  onClick,
  className,
  iconClassName,
  contentClassName,
}: {
  label?: string;
  onClick: () => void;
  className?: string;
  iconClassName?: string;
  contentClassName?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative grid place-items-center rounded-3xl border border-dashed border-[color:var(--accent)]/55 bg-[color:var(--overlay-1)] p-4 text-center transition hover:bg-[color:var(--overlay-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] motion-reduce:transition-none",
        className,
      )}
      aria-label={label}
    >
      <div className={cn("grid place-items-center gap-3", contentClassName)}>
        <span
          className={cn(
            "inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--accent)] text-[color:var(--accent-foreground)] shadow-sm transition-transform group-hover:-translate-y-0.5 group-hover:-rotate-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:rotate-0",
            iconClassName,
          )}
        >
          <Plus className="h-6 w-6" />
        </span>
        <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[color:var(--muted-foreground-weak)]">
          {label}
        </span>
      </div>
    </button>
  );
}

