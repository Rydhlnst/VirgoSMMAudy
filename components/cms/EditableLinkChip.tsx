"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEditModeContext } from "@/components/cms/EditModeProvider";
import { EditableText } from "@/components/cms/EditableText";

export function EditableLinkChip({
  platformPath,
  urlPath,
  platformValue,
  urlValue,
  className,
}: {
  platformPath: string;
  urlPath: string;
  platformValue: string;
  urlValue?: string;
  className?: string;
}) {
  const context = useEditModeContext();
  const platformFromContext = context?.getFieldValue(platformPath);
  const urlFromContext = context?.getFieldValue(urlPath);

  const platform = typeof platformFromContext === "string" ? platformFromContext : platformValue;
  const url = typeof urlFromContext === "string" ? urlFromContext : urlValue || "";

  const href = url.length ? url : "#";

  return (
    <div className={cn("space-y-2", className)}>
      <Link
        href={href}
        target={url.length ? "_blank" : undefined}
        rel={url.length ? "noreferrer" : undefined}
        className="inline-block transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:-rotate-1 active:translate-y-0 active:rotate-0 active:scale-[0.99] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0 motion-reduce:active:scale-100"
      >
        <span className="inline-flex rounded-full border border-foreground/15 bg-background px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-foreground/80">
          <EditableText path={platformPath} value={platform} />
        </span>
      </Link>

      {context?.isEditMode ? (
        <input
          value={url}
          onChange={(event) => context.updateField(urlPath, event.currentTarget.value)}
          placeholder="https://..."
          className="w-full rounded-md border border-[color:var(--accent)]/55 bg-transparent px-3 py-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
        />
      ) : null}
    </div>
  );
}

